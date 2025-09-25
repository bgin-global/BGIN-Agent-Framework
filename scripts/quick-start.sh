#!/bin/bash

# BGIN GovHack MVP - Quick Start Script
# This script provides a quick way to start the BGIN Multi-Agent Research Platform

set -e

echo "🚀 BGIN GovHack MVP - Quick Start"
echo "================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if .env exists
if [ ! -f .env ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env
    print_status "Please edit .env file with your API keys before continuing"
    print_status "Required: ANTHROPIC_API_KEY, OPENAI_API_KEY"
    exit 1
fi

# Start all services
print_status "Starting BGIN Multi-Agent Research Platform..."

# Start Docker services
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to initialize..."
sleep 15

# Start development servers
print_status "Starting development servers..."
npm run dev &

# Wait a moment for servers to start
sleep 5

print_success "BGIN GovHack MVP is now running!"
echo ""
echo "🌐 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:4000"
echo "   Health Check: http://localhost:4000/health"
echo ""
echo "📊 Monitoring (if enabled):"
echo "   Prometheus: http://localhost:9090"
echo "   Grafana: http://localhost:3001"
echo ""
echo "🔧 Management:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart: docker-compose restart"
echo ""
echo "Happy researching! 🧠🤖"
