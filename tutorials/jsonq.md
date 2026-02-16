# JSONQ Tutorial

Query and transform JSON/YAML files with ease.

## Overview

JSONQ is like `jq` but more user-friendly. Query, filter, and transform JSON data.

## Basic Usage

```bash
# Pretty print JSON
jsonq '.' data.json

# Extract specific fields
jsonq '.users[].name' data.json

# Filter data
jsonq '.users[] | select(.age > 25)' data.json

# Transform output
jsonq '.users | map({name: .name, email: .email})' data.json

# Convert YAML to JSON
jsonq '.' config.yaml --output json
```

## Example

```bash
# Sample data
$ cat users.json
{
  "users": [
    {"name": "Alice", "age": 30, "city": "NYC"},
    {"name": "Bob", "age": 25, "city": "LA"},
    {"name": "Carol", "age": 35, "city": "NYC"}
  ]
}

# Query examples
$ jsonq '.users | length' users.json
3

$ jsonq '.users[] | select(.city == "NYC") | .name' users.json
Alice
Carol

$ jsonq '.users | group_by(.city) | map({city: .[0].city, count: length})' users.json
[
  {"city": "LA", "count": 1},
  {"city": "NYC", "count": 2}
]
```

## Tips

- Use `-c` for compact output (one line per result)
- Use `--raw-output` to get raw strings without quotes
- Pipe to other tools: `jsonq '.users[].email' | xargs -I {} echo {}`
- Supports YAML input/output with automatic detection
