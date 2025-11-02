#!/bin/bash

# Tying.ai Development Tools Script
# Provides helpful commands for development workflow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Tying.ai Development Tools${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Show help
show_help() {
    echo -e "\n${CYAN}Usage: $0 [command]${NC}\n"
    echo "Available commands:"
    echo "  setup           - Setup development environment"
    echo "  dev             - Start development server"
    echo "  build           - Build for production"
    echo "  test            - Run tests (when configured)"
    echo "  lint            - Check code quality (when configured)"
    echo "  clean           - Clean build files and cache"
    echo "  status          - Show project status"
    echo "  perf            - Performance analysis guide"
    echo "  deploy-local    - Deploy to local server"
    echo "  help            - Show this help message"
    echo ""
}

# Setup development environment
setup_env() {
    print_status "Setting up development environment..."

    # Check Node.js version
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_status "Node.js version: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js >= 14.0.0"
        exit 1
    fi

    # Check npm version
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        print_status "npm version: $NPM_VERSION"
    else
        print_error "npm not found"
        exit 1
    fi

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi

    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file from template..."
        cp .env.example .env
        print_warning "Please review and update .env file with your settings"
    fi

    print_status "Development environment setup complete!"
    print_status "Run '$0 dev' to start development server"
}

# Start development server
start_dev() {
    print_status "Starting development server..."
    print_status "Server will be available at: http://localhost:3000"
    print_status "Press Ctrl+C to stop the server"
    echo ""

    # Kill any existing server on port 3000
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        print_warning "Port 3000 is in use. Stopping existing server..."
        kill -9 $(lsof -ti:3000) 2>/dev/null || true
        sleep 1
    fi

    npm run dev
}

# Build for production
build_project() {
    print_status "Building project for production..."

    # Clean first
    npm run clean

    # Build
    npm run build

    print_status "Build complete! Files are in ./dist/"
    print_status "Run '$0 deploy-local' to test locally"
}

# Run tests
run_tests() {
    print_status "Running tests..."

    if npm run test 2>/dev/null; then
        print_status "All tests passed!"
    else
        print_warning "Tests not configured yet. Add testing framework to enable."
    fi
}

# Run linting
run_lint() {
    print_status "Running code quality checks..."

    if npm run lint 2>/dev/null; then
        print_status "Code quality checks passed!"
    else
        print_warning "Linting not configured yet. Add ESLint to enable."
    fi
}

# Clean project
clean_project() {
    print_status "Cleaning build files and cache..."
    npm run clean
    print_status "Clean complete!"
}

# Show project status
show_status() {
    print_status "Project Status:"
    echo ""
    npm run status
    echo ""

    # Check if dist exists
    if [ -d "dist" ]; then
        DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
        print_status "Build directory: $DIST_SIZE"
    else
        print_warning "No build directory found. Run '$0 build' to create."
    fi

    # Check git status
    if [ -d ".git" ]; then
        echo ""
        print_status "Git Status:"
        git status --porcelain | head -5
        if [ $(git status --porcelain | wc -l) -gt 5 ]; then
            echo "... and more"
        fi
    fi
}

# Performance analysis guide
show_perf_guide() {
    print_status "Performance Analysis Guide:"
    echo ""
    echo "1. Start local server: $0 deploy-local"
    echo "2. Open Chrome DevTools (F12)"
    echo "3. Go to Lighthouse tab"
    echo "4. Run Lighthouse audit"
    echo "5. Review performance scores"
    echo ""
    echo "Key metrics to check:"
    echo "  • First Contentful Paint (FCP) - should be < 1.8s"
    echo "  • Largest Contentful Paint (LCP) - should be < 2.5s"
    echo "  • Cumulative Layout Shift (CLS) - should be < 0.1"
    echo "  • First Input Delay (FID) - should be < 100ms"
    echo ""
    echo "For detailed analysis, check the Performance tab in DevTools."
}

# Deploy to local server
deploy_local() {
    if [ ! -d "dist" ]; then
        print_error "No build directory found. Run '$0 build' first."
        exit 1
    fi

    print_status "Starting local server from build directory..."
    print_status "Server will be available at: http://localhost:8080"
    print_status "Press Ctrl+C to stop the server"
    echo ""

    # Kill any existing server on port 8080
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
        print_warning "Port 8080 is in use. Stopping existing server..."
        kill -9 $(lsof -ti:8080) 2>/dev/null || true
        sleep 1
    fi

    cd dist && python3 -m http.server 8080
}

# Main script logic
main() {
    case "${1:-help}" in
        "setup")
            setup_env
            ;;
        "dev")
            setup_env
            start_dev
            ;;
        "build")
            build_project
            ;;
        "test")
            run_tests
            ;;
        "lint")
            run_lint
            ;;
        "clean")
            clean_project
            ;;
        "status")
            show_status
            ;;
        "perf")
            show_perf_guide
            ;;
        "deploy-local")
            deploy_local
            ;;
        "help"|"--help"|"-h")
            print_header
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"