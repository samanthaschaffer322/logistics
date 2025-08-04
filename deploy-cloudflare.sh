#!/bin/bash

# Cloudflare Pages Deployment Script for LogiAI
echo "☁️ Cloudflare Pages Deployment Setup for LogiAI"
echo "==============================================="

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

# Check if GitHub is set up
print_step "Checking GitHub repository setup..."
if ! git remote get-url origin &>/dev/null; then
    print_error "GitHub remote not configured! Please run './setup-github.sh' first."
    exit 1
fi

REPO_URL=$(git remote get-url origin)
print_success "GitHub repository found: $REPO_URL"
echo ""

# Check environment variables
print_step "Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found! Creating template..."
    cat > .env.local << EOL
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration  
NEXT_PUBLIC_APP_URL=https://your-domain.pages.dev
EOL
    print_warning "Please update .env.local with your Supabase credentials!"
fi

# Test build locally
print_step "Testing local build..."
if npm run build; then
    print_success "Local build successful!"
else
    print_error "Local build failed! Please fix the errors before deploying."
    exit 1
fi

echo ""
echo "🌐 Cloudflare Pages Setup Instructions:"
echo "======================================="
echo ""
echo "1. 🌐 Go to Cloudflare Dashboard:"
echo "   https://dash.cloudflare.com"
echo ""
echo "2. 📄 Navigate to Pages:"
echo "   - Click 'Pages' in the left sidebar"
echo "   - Click 'Create a project'"
echo "   - Choose 'Connect to Git'"
echo ""
echo "3. 🔗 Connect GitHub:"
echo "   - Select 'GitHub'"
echo "   - Authorize Cloudflare if needed"
echo "   - Select your repository: $(basename "$REPO_URL" .git)"
echo ""
echo "4. ⚙️ Build Configuration:"
echo "   ┌─────────────────────────────────────┐"
echo "   │ Framework preset: Next.js           │"
echo "   │ Build command: npm run build        │"
echo "   │ Build output directory: .next       │"
echo "   │ Root directory: (leave empty)       │"
echo "   │ Node.js version: 18                 │"
echo "   └─────────────────────────────────────┘"
echo ""
echo "5. 🔐 Environment Variables:"
echo "   Add these in Cloudflare Pages settings:"
echo ""

# Read environment variables from .env.local
if [ -f ".env.local" ]; then
    echo "   ┌─────────────────────────────────────────────────────────┐"
    while IFS= read -r line; do
        if [[ $line =~ ^[A-Z] ]] && [[ $line == *"="* ]]; then
            var_name=$(echo "$line" | cut -d'=' -f1)
            var_value=$(echo "$line" | cut -d'=' -f2-)
            if [[ $var_value != *"your-"* ]]; then
                echo "   │ $var_name"
                echo "   │ Value: $var_value"
                echo "   │                                                         │"
            else
                echo "   │ $var_name"
                echo "   │ Value: ⚠️  PLEASE UPDATE THIS VALUE"
                echo "   │                                                         │"
            fi
        fi
    done < .env.local
    echo "   └─────────────────────────────────────────────────────────┘"
fi

echo ""
echo "6. 🚀 Deploy:"
echo "   - Click 'Save and Deploy'"
echo "   - Wait for the build to complete (2-5 minutes)"
echo "   - Your app will be available at: https://your-project.pages.dev"
echo ""

echo "🔧 Troubleshooting Common Issues:"
echo "================================="
echo ""
echo "❌ Build fails with 'package.json not found':"
echo "   - Make sure you selected the correct repository"
echo "   - Check that the root directory is empty (not set to a subdirectory)"
echo ""
echo "❌ Build fails with dependency errors:"
echo "   - Ensure Node.js version is set to 18"
echo "   - Check that all dependencies are in package.json"
echo ""
echo "❌ App loads but shows errors:"
echo "   - Verify all environment variables are set correctly"
echo "   - Check that Supabase URL and keys are valid"
echo ""
echo "❌ Authentication doesn't work:"
echo "   - Update Supabase Auth settings with your domain"
echo "   - Add redirect URLs in Supabase dashboard"
echo ""

echo "📋 Post-Deployment Checklist:"
echo "============================="
echo ""
echo "After successful deployment:"
echo "□ Test user registration and login"
echo "□ Verify dashboard loads correctly"
echo "□ Check all navigation links work"
echo "□ Test creating inventory items"
echo "□ Test shipment management features"
echo "□ Verify AI assistant functionality"
echo ""

echo "🔗 Useful Links:"
echo "================"
echo "• Cloudflare Pages: https://dash.cloudflare.com/pages"
echo "• Supabase Dashboard: https://supabase.com/dashboard"
echo "• GitHub Repository: $REPO_URL"
echo "• Project Documentation: README.md"
echo ""

print_success "🎉 Cloudflare Pages deployment guide complete!"
echo ""
echo "💡 Pro Tip: After deployment, you can set up a custom domain"
echo "   in Cloudflare Pages for a professional URL!"
echo ""

# Ask if user wants to open Cloudflare Pages
read -p "🌐 Open Cloudflare Pages dashboard now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://dash.cloudflare.com/pages"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://dash.cloudflare.com/pages"
    else
        echo "Please open: https://dash.cloudflare.com/pages"
    fi
fi
