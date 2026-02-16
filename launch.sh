#!/bin/bash
# Demo Environment Launcher
# Usage: ./launch.sh [web|cli]

MODE=${1:-web}
DEMO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🐙 Nemo Demo Environment"
echo "========================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed."
    echo "   Install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is required but not installed."
    exit 1
fi

cd "$DEMO_DIR/docker"

case "$MODE" in
    web)
        echo "🌐 Starting web interface..."
        docker-compose up --build -d
        echo ""
        echo "✅ Demo environment is running!"
        echo ""
        echo "📱 Access the web interface:"
        echo "   http://localhost:8080"
        echo ""
        echo "🛑 To stop: docker-compose down"
        ;;
    cli)
        echo "💻 Starting CLI mode..."
        docker-compose up --build
        ;;
    stop)
        echo "🛑 Stopping demo environment..."
        docker-compose down
        echo "✅ Stopped"
        ;;
    build)
        echo "🔨 Building demo image..."
        docker-compose build
        echo "✅ Build complete"
        ;;
    *)
        echo "Usage: ./launch.sh [web|cli|stop|build]"
        echo ""
        echo "Commands:"
        echo "  web    - Start web interface (background)"
        echo "  cli    - Start interactive CLI mode"
        echo "  stop   - Stop the demo environment"
        echo "  build  - Rebuild the Docker image"
        exit 1
        ;;
esac
