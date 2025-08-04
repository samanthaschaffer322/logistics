#!/bin/bash

# GitHub Setup Script for LogiAI
echo "🐙 Setting up GitHub repository for LogiAI..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found! Please run this script from the logistics project directory."
    exit 1
fi

print_step "Current project status:"
echo "📁 Project: $(pwd)"
echo "📦 Package: $(grep '"name"' package.json | cut -d'"' -f4)"
echo "🔢 Version: $(grep '"version"' package.json | cut -d'"' -f4)"
echo ""

# Check git status
print_step "Checking git repository..."
if [ ! -d ".git" ]; then
    print_error "Not a git repository! Initializing..."
    git init
    git add .
    git commit -m "Initial commit: LogiAI Logistics Platform"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "Update: Prepare for GitHub deployment $(date '+%Y-%m-%d %H:%M:%S')"
fi

print_success "Git repository is ready!"
echo ""

# Instructions for GitHub setup
echo "🐙 GitHub Repository Setup Instructions:"
echo "========================================"
echo ""
echo "1. Go to https://github.com and sign in"
echo "2. Click the '+' button and select 'New repository'"
echo "3. Repository settings:"
echo "   - Repository name: logiai-logistics"
echo "   - Description: AI-Powered Logistics Management Platform"
echo "   - Visibility: Private (recommended) or Public"
echo "   - DO NOT initialize with README, .gitignore, or license"
echo ""
echo "4. After creating the repository, copy the repository URL"
echo "   (it will look like: https://github.com/YOUR_USERNAME/logiai-logistics.git)"
echo ""

# Get repository URL from user
read -p "📝 Enter your GitHub repository URL: " repo_url

if [ -z "$repo_url" ]; then
    print_error "No repository URL provided!"
    exit 1
fi

# Validate URL format
if [[ ! "$repo_url" =~ ^https://github\.com/.+/.+\.git$ ]]; then
    print_warning "URL format seems incorrect. Expected format: https://github.com/username/repo.git"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Add remote and push
print_step "Adding GitHub remote and pushing code..."

# Remove existing origin if it exists
git remote remove origin 2>/dev/null || true

# Add new origin
git remote add origin "$repo_url"

# Set main branch
git branch -M main

# Push to GitHub
print_step "Pushing to GitHub..."
if git push -u origin main; then
    print_success "Code successfully pushed to GitHub!"
else
    print_error "Failed to push to GitHub. Please check your repository URL and permissions."
    exit 1
fi

echo ""
print_success "🎉 GitHub repository setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Your code is now on GitHub: $repo_url"
echo "2. You can now connect this repository to Cloudflare Pages"
echo "3. Run './deploy-cloudflare.sh' for Cloudflare Pages setup"
echo ""
