#!/bin/bash

# Ultra-fast build script for Cloudflare Pages
echo "🚀 Starting LogiAI build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --silent

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Static files generated in 'out' directory"
echo "🚀 Ready for deployment!"
