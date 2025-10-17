#!/bin/bash

# =====================================
# BGIN Agent Framework Deployment Script
# =====================================

set -e  # Exit on error

echo "🚀 Starting BGIN Agent Framework deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if node_modules exist
echo ""
echo "${YELLOW}📦 Checking dependencies...${NC}"

if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

echo "${GREEN}✅ Dependencies checked${NC}"

# Build frontend
echo ""
echo "${YELLOW}🏗️  Building frontend...${NC}"
cd frontend
npm run build
cd ..
echo "${GREEN}✅ Frontend built successfully${NC}"

# Build backend
echo ""
echo "${YELLOW}🏗️  Building backend...${NC}"
cd backend
npm run build
cd ..
echo "${GREEN}✅ Backend built successfully${NC}"

# Show deployment info
echo ""
echo "${GREEN}✨ Build completed successfully!${NC}"
echo ""
echo "📋 Deployment Summary:"
echo "  - Frontend build: $(du -sh frontend/dist | cut -f1)"
echo "  - Backend build: $(du -sh backend/dist | cut -f1)"
echo ""
echo "🚀 To start the server:"
echo "  ${YELLOW}cd backend && npm start${NC}"
echo ""
echo "  Or for development:"
echo "  ${YELLOW}cd backend && npm run dev${NC}"
echo ""
echo "📝 Server will run on: http://localhost:4000"
echo "   - Frontend: http://localhost:4000"
echo "   - API: http://localhost:4000/api"
echo "   - Health: http://localhost:4000/health"
echo ""
