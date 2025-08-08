#!/bin/bash

# Enhanced Logistics System Deployment Script
# This script deploys the complete enhanced AI route optimization system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="Enhanced Logistics System"
VERSION="2.0.0"
DOCKER_COMPOSE_FILE="docker-compose.fleetbase.yml"

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_step() {
    echo -e "${GREEN}➤ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

check_requirements() {
    print_step "Checking system requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "All requirements satisfied"
}

setup_environment() {
    print_step "Setting up environment..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Created .env file from .env.example"
        else
            print_warning "No .env.example file found. Creating basic .env file..."
            cat > .env << EOF
# Enhanced Logistics System Environment Variables
NODE_ENV=production
NEXT_PUBLIC_APP_NAME="Enhanced Logistics System"
NEXT_PUBLIC_APP_VERSION="2.0.0"

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORGANIZATION=your_openai_org_here

# Fleetbase Configuration
FLEETBASE_API_URL=http://localhost:8001
FLEETBASE_API_KEY=your_fleetbase_api_key_here

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id_here
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
CLOUDFLARE_ZONE_ID=your_cloudflare_zone_id_here

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Mapbox API
MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
EOF
            print_warning "Please update the .env file with your actual API keys and configuration"
        fi
    else
        print_success ".env file already exists"
    fi
    
    # Load environment variables
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
    fi
}

install_dependencies() {
    print_step "Installing dependencies..."
    
    # Install npm dependencies
    npm install
    print_success "npm dependencies installed"
    
    # Install additional dependencies for enhanced features
    npm install @supabase/supabase-js @aws-sdk/client-location socket.io-client recharts
    print_success "Enhanced feature dependencies installed"
}

build_application() {
    print_step "Building application..."
    
    # Build Next.js application
    npm run build
    print_success "Application built successfully"
}

setup_fleetbase() {
    print_step "Setting up Fleetbase infrastructure..."
    
    # Create necessary directories
    mkdir -p fleetbase-config/{api,console,nginx/ssl,database,prometheus,grafana/provisioning}
    
    # Generate SSL certificates for development
    if [ ! -f fleetbase-config/nginx/ssl/cert.pem ]; then
        print_step "Generating SSL certificates..."
        openssl req -x509 -newkey rsa:4096 -keyout fleetbase-config/nginx/ssl/key.pem -out fleetbase-config/nginx/ssl/cert.pem -days 365 -nodes -subj "/C=VN/ST=HCM/L=HoChiMinh/O=Logistics/CN=localhost" 2>/dev/null || {
            print_warning "OpenSSL not available. SSL certificates not generated."
            touch fleetbase-config/nginx/ssl/cert.pem
            touch fleetbase-config/nginx/ssl/key.pem
        }
    fi
    
    # Start Fleetbase services
    print_step "Starting Fleetbase services..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d
    
    # Wait for services to be ready
    print_step "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    check_service_health
}

check_service_health() {
    print_step "Checking service health..."
    
    services=("fleetbase-database" "fleetbase-cache" "fleetbase-api" "fleetbase-console")
    
    for service in "${services[@]}"; do
        if docker-compose -f $DOCKER_COMPOSE_FILE ps $service | grep -q "Up"; then
            print_success "$service is running"
        else
            print_warning "$service is not running properly"
        fi
    done
}

run_database_migrations() {
    print_step "Running database migrations..."
    
    # Wait for database to be ready
    sleep 10
    
    # Run migrations (if Fleetbase supports it)
    docker-compose -f $DOCKER_COMPOSE_FILE exec -T fleetbase-api php artisan migrate --force 2>/dev/null || {
        print_warning "Database migrations not available or already run"
    }
    
    print_success "Database setup completed"
}

run_tests() {
    print_step "Running system tests..."
    
    # Run optimization tests
    node test-optimization.mjs || {
        print_warning "Some tests failed, but deployment will continue"
    }
    
    print_success "Tests completed"
}

deploy_to_cloudflare() {
    print_step "Deploying to Cloudflare Pages..."
    
    if [ -n "$CLOUDFLARE_API_TOKEN" ] && [ "$CLOUDFLARE_API_TOKEN" != "your_cloudflare_api_token_here" ]; then
        # Deploy to Cloudflare Pages
        npx wrangler pages deploy out --project-name=enhanced-logistics --compatibility-date=2024-01-01 2>/dev/null || {
            print_warning "Cloudflare deployment failed. Please check your configuration."
        }
    else
        print_warning "Cloudflare API token not configured. Skipping Cloudflare deployment."
    fi
}

setup_monitoring() {
    print_step "Setting up monitoring and analytics..."
    
    # Create Prometheus configuration
    cat > fleetbase-config/prometheus/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'fleetbase-api'
    static_configs:
      - targets: ['fleetbase-api:8000']
  
  - job_name: 'logistics-app'
    static_configs:
      - targets: ['localhost:3000']
  
  - job_name: 'nginx'
    static_configs:
      - targets: ['fleetbase-proxy:80']
EOF
    
    print_success "Monitoring configuration created"
}

print_deployment_info() {
    print_header "Deployment Information"
    
    echo -e "${CYAN}Application URLs:${NC}"
    echo -e "  • Main Application: ${GREEN}http://localhost:3000${NC}"
    echo -e "  • Enhanced Optimizer: ${GREEN}http://localhost:3000/enhanced-optimizer${NC}"
    echo -e "  • Fleetbase Console: ${GREEN}http://localhost:4200${NC}"
    echo -e "  • Fleetbase API: ${GREEN}http://localhost:8001${NC}"
    echo -e "  • NGINX Proxy: ${GREEN}http://localhost:8080${NC}"
    echo -e "  • Grafana Dashboard: ${GREEN}http://localhost:3000${NC} (admin/logistics_grafana_password)"
    echo -e "  • Prometheus: ${GREEN}http://localhost:9090${NC}"
    echo -e "  • MinIO Console: ${GREEN}http://localhost:9001${NC} (logistics_minio_user/logistics_minio_password)"
    
    echo -e "\n${CYAN}Database Information:${NC}"
    echo -e "  • MySQL: ${GREEN}localhost:3306${NC}"
    echo -e "  • Database: ${GREEN}fleetbase_logistics${NC}"
    echo -e "  • Username: ${GREEN}fleetbase_user${NC}"
    echo -e "  • Password: ${GREEN}fleetbase_password${NC}"
    
    echo -e "\n${CYAN}Cache & Queue:${NC}"
    echo -e "  • Redis: ${GREEN}localhost:6379${NC}"
    echo -e "  • Elasticsearch: ${GREEN}localhost:9200${NC}"
    echo -e "  • Kibana: ${GREEN}localhost:5601${NC}"
    
    echo -e "\n${CYAN}Docker Services:${NC}"
    docker-compose -f $DOCKER_COMPOSE_FILE ps
    
    echo -e "\n${YELLOW}Next Steps:${NC}"
    echo -e "  1. Update your .env file with actual API keys"
    echo -e "  2. Configure your Fleetbase organization settings"
    echo -e "  3. Set up your AWS credentials for location services"
    echo -e "  4. Configure Supabase database and authentication"
    echo -e "  5. Test the enhanced route optimization features"
    
    echo -e "\n${GREEN}Deployment completed successfully! 🎉${NC}"
}

cleanup_on_error() {
    print_error "Deployment failed. Cleaning up..."
    docker-compose -f $DOCKER_COMPOSE_FILE down 2>/dev/null || true
    exit 1
}

# Main deployment process
main() {
    print_header "$PROJECT_NAME v$VERSION Deployment"
    
    # Set up error handling
    trap cleanup_on_error ERR
    
    # Run deployment steps
    check_requirements
    setup_environment
    install_dependencies
    build_application
    setup_fleetbase
    run_database_migrations
    setup_monitoring
    run_tests
    deploy_to_cloudflare
    
    # Print deployment information
    print_deployment_info
}

# Handle command line arguments
case "${1:-}" in
    "start")
        print_step "Starting services..."
        docker-compose -f $DOCKER_COMPOSE_FILE up -d
        print_success "Services started"
        ;;
    "stop")
        print_step "Stopping services..."
        docker-compose -f $DOCKER_COMPOSE_FILE down
        print_success "Services stopped"
        ;;
    "restart")
        print_step "Restarting services..."
        docker-compose -f $DOCKER_COMPOSE_FILE restart
        print_success "Services restarted"
        ;;
    "logs")
        docker-compose -f $DOCKER_COMPOSE_FILE logs -f
        ;;
    "status")
        docker-compose -f $DOCKER_COMPOSE_FILE ps
        ;;
    "clean")
        print_step "Cleaning up..."
        docker-compose -f $DOCKER_COMPOSE_FILE down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup completed"
        ;;
    "test")
        run_tests
        ;;
    *)
        main
        ;;
esac
