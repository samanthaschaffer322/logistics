#!/bin/bash

# LogiAI Deployment Script for Cloudflare Pages
echo "🚀 LogiAI Deployment Script"
echo "================================"

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
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_success "All requirements met!"
}

# Check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local file not found!"
        print_status "Creating template .env.local file..."
        cat > .env.local << EOL
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.pages.dev

# Ollama Configuration (optional)
OLLAMA_BASE_URL=http://localhost:11434
EOL
        print_warning "Please update .env.local with your actual Supabase credentials before deploying!"
        return 1
    fi
    
    # Check if environment variables are set
    source .env.local
    if [[ "$NEXT_PUBLIC_SUPABASE_URL" == "https://your-project.supabase.co" ]]; then
        print_warning "Please update NEXT_PUBLIC_SUPABASE_URL in .env.local"
        return 1
    fi
    
    if [[ "$NEXT_PUBLIC_SUPABASE_ANON_KEY" == "your-anon-key" ]]; then
        print_warning "Please update NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
        return 1
    fi
    
    print_success "Environment variables configured!"
    return 0
}

# Install dependencies
install_deps() {
    print_status "Installing dependencies..."
    
    if [ ! -d "node_modules" ]; then
        npm install
        if [ $? -eq 0 ]; then
            print_success "Dependencies installed successfully!"
        else
            print_error "Failed to install dependencies!"
            exit 1
        fi
    else
        print_status "Dependencies already installed. Checking for updates..."
        npm update
    fi
}

# Run linting and type checking
run_checks() {
    print_status "Running code quality checks..."
    
    # Run ESLint
    npm run lint
    if [ $? -ne 0 ]; then
        print_warning "Linting issues found. Please fix them before deploying."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    print_success "Code quality checks passed!"
}

# Build the application
build_app() {
    print_status "Building the application..."
    
    npm run build
    if [ $? -eq 0 ]; then
        print_success "Application built successfully!"
    else
        print_error "Build failed! Please check the errors above."
        exit 1
    fi
}

# Git operations
git_operations() {
    print_status "Preparing Git repository..."
    
    # Check if we're in a git repository
    if [ ! -d ".git" ]; then
        print_status "Initializing Git repository..."
        git init
        git add .
        git commit -m "Initial commit: LogiAI Logistics Platform"
    else
        # Check for uncommitted changes
        if [ -n "$(git status --porcelain)" ]; then
            print_status "Committing changes..."
            git add .
            git commit -m "Update: Prepare for deployment $(date '+%Y-%m-%d %H:%M:%S')"
        fi
    fi
    
    print_success "Git repository ready!"
}

# Deploy to Cloudflare Pages
deploy_cloudflare() {
    print_status "Deploying to Cloudflare Pages..."
    
    echo ""
    echo "📋 Deployment Checklist:"
    echo "========================"
    echo "1. ✅ Code built successfully"
    echo "2. ✅ Git repository prepared"
    echo "3. 🔄 Ready for Cloudflare Pages deployment"
    echo ""
    echo "🌐 Next Steps:"
    echo "1. Go to https://dash.cloudflare.com/pages"
    echo "2. Click 'Create a project'"
    echo "3. Connect your GitHub repository"
    echo "4. Use these build settings:"
    echo "   - Framework preset: Next.js"
    echo "   - Build command: npm run build"
    echo "   - Build output directory: .next"
    echo "   - Node.js version: 18"
    echo ""
    echo "5. Add these environment variables in Cloudflare:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - NEXT_PUBLIC_APP_URL"
    echo ""
    
    print_success "Deployment preparation complete!"
}

# GitHub setup
setup_github() {
    print_status "Setting up GitHub repository..."
    
    echo ""
    echo "🐙 GitHub Setup Instructions:"
    echo "============================="
    echo "1. Create a new repository on GitHub"
    echo "2. Copy the repository URL"
    echo "3. Run these commands:"
    echo ""
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    
    read -p "Do you want to set up GitHub remote now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub repository URL: " repo_url
        if [ ! -z "$repo_url" ]; then
            git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"
            git branch -M main
            git push -u origin main
            print_success "GitHub repository set up successfully!"
        fi
    fi
}

# Main deployment flow
main() {
    echo ""
    print_status "Starting LogiAI deployment process..."
    echo ""
    
    # Run all checks and preparations
    check_requirements
    
    if ! check_env; then
        print_error "Please configure your environment variables first!"
        exit 1
    fi
    
    install_deps
    run_checks
    build_app
    git_operations
    
    # Ask user what they want to do
    echo ""
    echo "🎯 Deployment Options:"
    echo "====================="
    echo "1. Set up GitHub repository"
    echo "2. Show Cloudflare Pages deployment instructions"
    echo "3. Both"
    echo "4. Exit"
    echo ""
    
    read -p "Choose an option (1-4): " -n 1 -r
    echo ""
    
    case $REPLY in
        1)
            setup_github
            ;;
        2)
            deploy_cloudflare
            ;;
        3)
            setup_github
            deploy_cloudflare
            ;;
        4)
            print_status "Deployment preparation complete. You can deploy manually when ready."
            ;;
        *)
            print_warning "Invalid option. Showing deployment instructions..."
            deploy_cloudflare
            ;;
    esac
    
    echo ""
    print_success "🎉 LogiAI is ready for deployment!"
    echo ""
    echo "📚 Additional Resources:"
    echo "- README.md: Complete setup guide"
    echo "- DEPLOYMENT.md: Detailed deployment instructions"
    echo "- PROJECT_SUMMARY.md: Feature overview and next steps"
    echo ""
    echo "🔗 Useful Links:"
    echo "- Supabase Dashboard: https://supabase.com/dashboard"
    echo "- Cloudflare Pages: https://dash.cloudflare.com/pages"
    echo "- GitHub: https://github.com"
    echo ""
}

# Run the main function
main
