#!/bin/bash
# Campus Carbon Footprint Tracker Setup Script for Mac/Linux

echo ""
echo "===================================================="
echo "Campus Carbon Footprint Tracker - Setup"
echo "===================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[✓] Node.js detected"

# Install root dependencies
echo ""
echo "Installing root dependencies..."
npm install --legacy-peer-deps

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd server
npm install --legacy-peer-deps
cd ..

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd client
npm install --legacy-peer-deps
cd ..

echo ""
echo "===================================================="
echo "Installation Complete!"
echo "===================================================="
echo ""
echo "To start the application:"
echo ""
echo "Option 1 - Run both servers:"
echo "  npm run dev"
echo ""
echo "Option 2 - Run separately:"
echo "  Terminal 1: cd server && npm start"
echo "  Terminal 2: cd client && npm start"
echo ""
echo "Backend will run on http://localhost:5000"
echo "Frontend will run on http://localhost:3000"
echo ""
