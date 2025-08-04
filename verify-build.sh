#!/bin/bash

# Build Verification Script for LogiAI
echo "🔍 Verifying LogiAI Build Configuration"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found! Please run this script from the project root."
    exit 1
fi

print_step "Checking project structure..."

# Check essential files
essential_files=(
    "package.json"
    "next.config.ts"
    "tsconfig.json"
    "tailwind.config.js"
    "src/app/layout.tsx"
    "src/app/page.tsx"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file exists"
    else
        print_error "$file is missing!"
        exit 1
    fi
done

print_step "Checking dependencies..."

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_success "Dependencies installed"
else
    print_warning "Dependencies not installed. Installing now..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
fi

print_step "Checking environment configuration..."

# Check .env.local
if [ -f ".env.local" ]; then
    print_success ".env.local exists"
    
    # Check if environment variables are configured
    if grep -q "your-project.supabase.co" .env.local; then
        print_warning "Supabase URL needs to be updated in .env.local"
    else
        print_success "Supabase URL configured"
    fi
    
    if grep -q "your-anon-key" .env.local; then
        print_warning "Supabase anon key needs to be updated in .env.local"
    else
        print_success "Supabase anon key configured"
    fi
else
    print_warning ".env.local not found. Creating template..."
    cat > .env.local << EOL
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOL
    print_warning "Please update .env.local with your actual Supabase credentials"
fi

print_step "Running TypeScript check..."
if npm run type-check; then
    print_success "TypeScript check passed"
else
    print_error "TypeScript errors found. Please fix them before deploying."
    exit 1
fi

print_step "Running ESLint check..."
if npm run lint; then
    print_success "ESLint check passed"
else
    print_warning "ESLint warnings found. Consider fixing them for better code quality."
fi

print_step "Testing build process..."
echo "This may take a few minutes..."

# Clean previous build
npm run clean

# Run build
if npm run build; then
    print_success "Build completed successfully!"
    
    # Check if .next directory was created
    if [ -d ".next" ]; then
        print_success ".next directory created"
        
        # Check build size
        build_size=$(du -sh .next 2>/dev/null | cut -f1)
        print_success "Build size: $build_size"
    else
        print_error ".next directory not found after build"
        exit 1
    fi
else
    print_error "Build failed! Please check the errors above."
    exit 1
fi

print_step "Checking Git repository..."
if [ -d ".git" ]; then
    print_success "Git repository initialized"
    
    if git remote get-url origin &>/dev/null; then
        repo_url=$(git remote get-url origin)
        print_success "GitHub remote configured: $repo_url"
    else
        print_warning "GitHub remote not configured. Run './setup-github.sh' to set it up."
    fi
    
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "You have uncommitted changes"
    else
        print_success "Working directory clean"
    fi
else
    print_warning "Git repository not initialized"
fi

echo ""
print_success "🎉 Build verification complete!"
echo ""
echo "📋 Summary:"
echo "==========="
echo "✅ Project structure is correct"
echo "✅ Dependencies are installed"
echo "✅ TypeScript compilation successful"
echo "✅ Build process completed"
echo ""

if git remote get-url origin &>/dev/null; then
    echo "🚀 Ready for Cloudflare Pages deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push any changes to GitHub: git push"
    echo "2. Run './deploy-cloudflare.sh' for deployment instructions"
else
    echo "📝 Next steps:"
    echo "1. Run './setup-github.sh' to configure GitHub"
    echo "2. Run './deploy-cloudflare.sh' for deployment instructions"
fi

echo ""
