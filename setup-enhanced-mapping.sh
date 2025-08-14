#!/bin/bash

# 🗺️ Enhanced Mapping Features Setup Script
# This script helps you set up the enhanced mapping features for Truck Insight V2

echo "🗺️ Setting up Enhanced Mapping Features for Truck Insight V2"
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
fi

# Check if ORS API key is configured
if grep -q "NEXT_PUBLIC_ORS_API_KEY=your_ors_api_key_here" .env.local; then
    echo -e "${RED}❌ OpenRouteService API key not configured${NC}"
    echo ""
    echo -e "${BLUE}📋 To get your FREE OpenRouteService API key:${NC}"
    echo "1. Visit: https://openrouteservice.org/dev/#/signup"
    echo "2. Sign up for a free account"
    echo "3. Generate an API key"
    echo "4. Replace 'your_ors_api_key_here' in .env.local with your actual key"
    echo ""
    echo -e "${YELLOW}💡 Free tier includes:${NC}"
    echo "   • 40 requests per minute"
    echo "   • 2,000 requests per day"
    echo "   • All routing profiles (car, truck, bike, walking)"
    echo "   • Truck-specific routing with restrictions"
    echo "   • No credit card required"
    echo ""
    
    # Open the signup page
    if command -v open &> /dev/null; then
        echo -e "${BLUE}🌐 Opening OpenRouteService signup page...${NC}"
        open "https://openrouteservice.org/dev/#/signup"
    elif command -v xdg-open &> /dev/null; then
        echo -e "${BLUE}🌐 Opening OpenRouteService signup page...${NC}"
        xdg-open "https://openrouteservice.org/dev/#/signup"
    fi
    
    echo ""
    read -p "Press Enter after you've updated your API key in .env.local..."
    
else
    echo -e "${GREEN}✅ OpenRouteService API key is configured${NC}"
fi

# Check if dependencies are installed
echo ""
echo -e "${BLUE}📦 Checking dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependencies not installed. Installing...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies are installed${NC}"
fi

# Check if the development server is running
echo ""
echo -e "${BLUE}🚀 Starting development server...${NC}"

# Kill any existing Next.js processes
pkill -f "next dev" 2>/dev/null || true

# Start the development server in the background
npm run dev &
DEV_PID=$!

echo -e "${GREEN}✅ Development server started (PID: $DEV_PID)${NC}"
echo ""

# Wait a moment for the server to start
sleep 3

# Open the enhanced route optimization page
echo -e "${BLUE}🌐 Opening Enhanced Route Optimization page...${NC}"
if command -v open &> /dev/null; then
    open "http://localhost:3000/enhanced-route-optimization"
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000/enhanced-route-optimization"
fi

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📍 Enhanced Mapping Features Available:${NC}"
echo "   • Interactive map with Vietnamese locations"
echo "   • Truck-specific route optimization"
echo "   • Multiple map providers (OSM, Satellite, Terrain)"
echo "   • Cost analytics in VND"
echo "   • Export capabilities (GPX, KML, JSON, CSV)"
echo ""
echo -e "${BLUE}🔗 Access Points:${NC}"
echo "   • Main App: http://localhost:3000"
echo "   • Enhanced Route Optimization: http://localhost:3000/enhanced-route-optimization"
echo "   • Navigation: Look for 'Enhanced Route Optimization' in the sidebar"
echo ""
echo -e "${YELLOW}💡 Usage Tips:${NC}"
echo "   • Click on the map to add locations"
echo "   • Use the search bar to find Vietnamese cities"
echo "   • Configure truck specifications in the Truck Specs tab"
echo "   • View detailed analytics in the Analytics tab"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   • See ENHANCED_MAPPING_FEATURES.md for detailed documentation"
echo "   • Check the setup guide for advanced configuration"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down development server...${NC}"
    kill $DEV_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Set trap to cleanup on script exit
trap cleanup EXIT

echo -e "${GREEN}✨ Enhanced mapping features are now ready to use!${NC}"
echo -e "${BLUE}Press Ctrl+C to stop the development server${NC}"

# Wait for user to stop the server
wait $DEV_PID
