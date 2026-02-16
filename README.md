# Demo Environment

Docker-based interactive demo environment where users can try tools safely with pre-configured sample data.

## Features

- **Isolated Environment** — Each demo runs in its own Docker container
- **Pre-configured Tools** — 10+ popular tools ready to try
- **Sample Data** — Realistic datasets for testing
- **Web Terminal** — Browser-based terminal access
- **Guided Tours** — Step-by-step tutorials for each tool
- **Sandbox Mode** — Safe to experiment, changes discarded on exit

## Quick Start

```bash
# Start the demo environment
docker-compose up -d

# Access the web interface
open http://localhost:8080
```

## Included Tools

| Tool | Category | Description |
|------|----------|-------------|
| file-organizer | Productivity | Content-aware file organization |
| tidyspace | Productivity | Intelligent workspace cleanup |
| local-search | Data | Fast full-text file search |
| task-cli | Productivity | Natural language task management |
| jsonq | Data | JSON/YAML query and transform |
| api-workbench | DevOps | Terminal HTTP client |
| quick-serve | DevOps | Instant HTTP server |
| system-pulse | DevOps | System monitor with TUI |
| git-time-machine | Development | Visualize repo evolution |
| clipkeep | Productivity | Smart clipboard manager |

## Architecture

```
demo-environment/
├── docker/
│   ├── Dockerfile          # Base image with all tools
│   ├── docker-compose.yml  # Multi-service orchestration
│   └── entrypoint.sh       # Container initialization
├── web/
│   ├── server.py           # Flask web server
│   ├── terminal.py         # WebSocket terminal bridge
│   └── static/
│       ├── css/
│       ├── js/
│       └── index.html
├── tutorials/
│   ├── file-organizer.md
│   ├── tidyspace.md
│   └── ...
├── sample-data/
│   ├── documents/          # Mixed file types for organizing
│   ├── logs/               # Sample log files
│   ├── json/               # Sample JSON datasets
│   └── code/               # Sample code repositories
└── README.md
```

## Usage

### Web Interface

1. Navigate to `http://localhost:8080`
2. Select a tool from the catalog
3. Follow the guided tutorial or explore freely
4. Use the web terminal to run commands

### CLI Mode

```bash
# Run a specific tool demo
docker run -it nemo/demo-environment file-organizer

# Run with custom sample data
docker run -it -v $(pwd)/my-data:/data nemo/demo-environment
```

## Development

```bash
# Build the image
docker build -t nemo/demo-environment docker/

# Run locally
docker run -it -p 8080:8080 nemo/demo-environment
```

## License

MIT
