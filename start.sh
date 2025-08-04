#!/bin/bash

# LogiAI Quick Start Script
echo "🚀 Starting LogiAI Development Server..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found!"
    echo "📝 Creating a template .env.local file..."
    cat > .env.local << EOL
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Ollama Configuration (for local AI)
OLLAMA_BASE_URL=http://localhost:11434

# Mapbox Configuration (optional)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOL
    echo "✅ Template .env.local created!"
    echo "🔧 Please update the Supabase URL and keys in .env.local"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    echo ""
fi

# Start the development server
echo "🌟 Starting Next.js development server..."
echo "📱 Your app will be available at: http://localhost:3000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

npm run dev
