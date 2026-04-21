#!/bin/bash

echo "🚀 Escrow Shop Setup Script"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Backend setup
echo "${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "${YELLOW}⚠️  Please edit backend/.env and add your Escrow.com credentials${NC}"
fi

echo "Installing backend dependencies..."
npm install

echo "${GREEN}✅ Backend setup complete${NC}"
echo ""

# Frontend setup
echo "${YELLOW}Setting up Frontend...${NC}"
cd ../frontend

echo "Installing frontend dependencies..."
npm install

echo "${GREEN}✅ Frontend setup complete${NC}"
echo ""

# Final instructions
echo "=============================="
echo "${GREEN}Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your Escrow.com API credentials"
echo "2. Start backend: cd backend && npm start"
echo "3. Start frontend: cd frontend && npm start"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "For more information, see README.md"
