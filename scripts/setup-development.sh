#!/bin/bash

# BGIN GovHack MVP - Development Setup Script
# This script sets up the development environment for the BGIN Multi-Agent Research Platform

set -e

echo "🚀 Setting up BGIN GovHack MVP Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker from https://docker.com/"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    
    print_success "All requirements satisfied"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p logs
    mkdir -p uploads
    mkdir -p data/vector-db
    mkdir -p data/redis
    
    print_success "Directories created"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install backend dependencies
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    cd frontend
    npm install
    cd ..
    
    print_success "Dependencies installed"
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_warning "Created .env file from .env.example"
        print_warning "Please edit .env file with your actual configuration values"
    else
        print_success "Environment file already exists"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Start PostgreSQL and Redis
    docker-compose up -d postgres redis qdrant
    
    # Wait for services to be ready
    print_status "Waiting for database services to be ready..."
    sleep 10
    
    # Run database migrations
    print_status "Running database migrations..."
    cd backend
    npm run db:migrate
    cd ..
    
    print_success "Database setup complete"
}

# Seed initial data
seed_data() {
    print_status "Seeding initial data..."
    
    cd backend
    npm run db:seed
    npm run agents:seed
    cd ..
    
    print_success "Initial data seeded"
}

# Main setup function
main() {
    echo "=========================================="
    echo "BGIN GovHack MVP Development Setup"
    echo "=========================================="
    echo ""
    
    check_requirements
    create_directories
    install_dependencies
    setup_environment
    setup_database
    seed_data
    
    echo ""
    echo "=========================================="
    print_success "Setup complete! 🎉"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Edit .env file with your API keys"
    echo "2. Start the development environment:"
    echo "   docker-compose up -d"
    echo "   npm run dev"
    echo ""
    echo "3. Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:4000"
    echo "   Health Check: http://localhost:4000/health"
    echo ""
    echo "4. View logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main "$@"
