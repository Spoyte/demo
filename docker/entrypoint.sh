#!/bin/bash
set -e

# Demo Environment Entrypoint
# Usage: entrypoint.sh [web|cli|bash]

MODE=${1:-web}

echo "🐙 Nemo Demo Environment"
echo "========================"
echo ""

# Initialize sample data if not exists
if [ ! -d "/workspace/initialized" ]; then
    echo "📦 Setting up sample data..."
    
    # Create working directories
    mkdir -p /workspace/playground
    mkdir -p /workspace/projects
    mkdir -p /workspace/output
    
    # Copy sample data to playground
    cp -r /workspace/sample-data/documents/* /workspace/playground/ 2>/dev/null || true
    cp -r /workspace/sample-data/code/* /workspace/projects/ 2>/dev/null || true
    
    touch /workspace/initialized
    echo "✅ Sample data ready!"
    echo ""
fi

# Show available tools
echo "🔧 Available Tools:"
echo "  • file-organizer  - Organize files by content type"
echo "  • tidyspace       - Clean up workspace intelligently"
echo "  • local-search    - Search files with full-text index"
echo "  • task-cli        - Natural language task management"
echo "  • jsonq           - Query and transform JSON"
echo "  • api-workbench   - Test APIs from terminal"
echo "  • quick-serve     - Start HTTP server instantly"
echo "  • system-pulse    - Monitor system resources"
echo "  • git-time-machine- Visualize git history"
echo "  • clipkeep        - Smart clipboard manager"
echo ""

case "$MODE" in
    web)
        echo "🌐 Starting web interface on http://localhost:8080"
        echo ""
        cd /home/demo/tools/web && python3 server.py
        ;;
    cli)
        echo "💻 Interactive CLI mode"
        echo "Type 'help' for available commands"
        echo ""
        cd /workspace && exec bash
        ;;
    bash)
        echo "🐚 Bash shell"
        cd /workspace && exec bash
        ;;
    *)
        echo "Unknown mode: $MODE"
        echo "Usage: entrypoint.sh [web|cli|bash]"
        exit 1
        ;;
esac
