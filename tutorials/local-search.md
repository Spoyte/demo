# Local Search Tutorial

Fast full-text search engine for your files.

## Overview

Local Search builds an index of your files and enables lightning-fast full-text searches.

## Basic Usage

```bash
# Index a directory
local-search --index /path/to/documents

# Search for text
local-search "project requirements"

# Search with filters
local-search "TODO" --ext .md --modified "last week"

# Interactive mode
local-search --interactive
```

## Example

```bash
# Build index
$ local-search --index /workspace/playground
Indexing 1,247 files... Done!
Index saved to ~/.local-search/index

# Search
$ local-search "authentication"
Found 23 matches in 8 files:
  ./docs/api.md:42: Implement OAuth2 authentication flow
  ./src/auth.py:15: def authenticate_user(token):
  ./README.md:89: Authentication is required for all endpoints
  ...

# Fuzzy search
$ local-search "authentcation" --fuzzy
Did you mean: "authentication"?
Found 23 matches in 8 files
```

## Tips

- Index runs automatically on first search if no index exists
- Use `--watch` to auto-update index when files change
- Results show context lines for better understanding
- Export results with `--json` or `--csv`
