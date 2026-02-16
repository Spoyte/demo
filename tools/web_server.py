#!/usr/bin/env python3
"""
Demo Environment Web Server
Provides web interface and WebSocket terminal for tool demos
"""

from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_socketio import SocketIO, emit
import subprocess
import os
import json
import threading
import time
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'demo-environment-secret'
socketio = SocketIO(app, cors_allowed_origins="*")

# Demo configuration
TOOLS = [
    {
        "id": "file-organizer",
        "name": "File Organizer",
        "category": "Productivity",
        "description": "Content-aware file organization with OCR support",
        "icon": "📁",
        "command": "file-organizer",
        "tutorial": "tutorials/file-organizer.md"
    },
    {
        "id": "tidyspace",
        "name": "TidySpace",
        "category": "Productivity", 
        "description": "Intelligent workspace cleanup and organization",
        "icon": "🧹",
        "command": "tidyspace",
        "tutorial": "tutorials/tidyspace.md"
    },
    {
        "id": "local-search",
        "name": "Local Search",
        "category": "Data",
        "description": "Fast full-text search engine for files",
        "icon": "🔍",
        "command": "local-search",
        "tutorial": "tutorials/local-search.md"
    },
    {
        "id": "task-cli",
        "name": "Task CLI",
        "category": "Productivity",
        "description": "Natural language task management",
        "icon": "✅",
        "command": "task-cli",
        "tutorial": "tutorials/task-cli.md"
    },
    {
        "id": "jsonq",
        "name": "JSONQ",
        "category": "Data",
        "description": "Query and transform JSON/YAML files",
        "icon": "📊",
        "command": "jsonq",
        "tutorial": "tutorials/jsonq.md"
    },
    {
        "id": "api-workbench",
        "name": "API Workbench",
        "category": "DevOps",
        "description": "Terminal HTTP client for API testing",
        "icon": "🌐",
        "command": "api-workbench",
        "tutorial": "tutorials/api-workbench.md"
    },
    {
        "id": "quick-serve",
        "name": "QuickServe",
        "category": "DevOps",
        "description": "Instant HTTP server with QR codes",
        "icon": "🚀",
        "command": "quick-serve",
        "tutorial": "tutorials/quick-serve.md"
    },
    {
        "id": "system-pulse",
        "name": "System Pulse",
        "category": "DevOps",
        "description": "Lightweight system monitor with TUI",
        "icon": "💓",
        "command": "system-pulse",
        "tutorial": "tutorials/system-pulse.md"
    },
    {
        "id": "git-time-machine",
        "name": "Git Time Machine",
        "category": "Development",
        "description": "Visualize repository evolution through time",
        "icon": "⏰",
        "command": "git-time-machine",
        "tutorial": "tutorials/git-time-machine.md"
    },
    {
        "id": "clipkeep",
        "name": "ClipKeep",
        "category": "Productivity",
        "description": "Smart clipboard manager with auto-categorization",
        "icon": "📋",
        "command": "clipkeep",
        "tutorial": "tutorials/clipkeep.md"
    }
]

active_sessions = {}

@app.route('/')
def index():
    return render_template('index.html', tools=TOOLS)

@app.route('/api/tools')
def get_tools():
    return jsonify(TOOLS)

@app.route('/api/tool/<tool_id>')
def get_tool(tool_id):
    tool = next((t for t in TOOLS if t['id'] == tool_id), None)
    if tool:
        # Load tutorial content
        tutorial_path = f"/workspace/{tool['tutorial']}"
        if os.path.exists(tutorial_path):
            with open(tutorial_path, 'r') as f:
                tool['tutorial_content'] = f.read()
        return jsonify(tool)
    return jsonify({"error": "Tool not found"}), 404

@app.route('/api/terminal', methods=['POST'])
def run_terminal():
    """Execute a terminal command"""
    data = request.json
    command = data.get('command', '')
    cwd = data.get('cwd', '/workspace')
    
    # Security: whitelist safe commands
    dangerous = ['rm -rf /', 'mkfs', 'dd if=/dev/zero', ':(){ :|:& };:']
    if any(d in command for d in dangerous):
        return jsonify({"error": "Command not allowed"}), 403
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=30
        )
        return jsonify({
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode
        })
    except subprocess.TimeoutExpired:
        return jsonify({"error": "Command timed out"}), 408
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
    active_sessions[request.sid] = {
        'connected_at': datetime.now().isoformat(),
        'cwd': '/workspace'
    }

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")
    if request.sid in active_sessions:
        del active_sessions[request.sid]

@socketio.on('terminal_command')
def handle_terminal_command(data):
    """Handle terminal commands via WebSocket"""
    command = data.get('command', '')
    session = active_sessions.get(request.sid, {'cwd': '/workspace'})
    cwd = session.get('cwd', '/workspace')
    
    # Security check
    dangerous = ['rm -rf /', 'mkfs', 'dd if=/dev/zero']
    if any(d in command for d in dangerous):
        emit('terminal_output', {'error': 'Command not allowed'})
        return
    
    try:
        process = subprocess.Popen(
            command,
            shell=True,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Stream output
        for line in process.stdout:
            emit('terminal_output', {'output': line})
        
        for line in process.stderr:
            emit('terminal_output', {'error': line})
        
        process.wait()
        emit('terminal_output', {'done': True, 'returncode': process.returncode})
        
    except Exception as e:
        emit('terminal_output', {'error': str(e)})

@socketio.on('change_directory')
def handle_change_directory(data):
    """Change working directory"""
    new_dir = data.get('path', '/workspace')
    if os.path.isdir(new_dir):
        if request.sid in active_sessions:
            active_sessions[request.sid]['cwd'] = new_dir
        emit('directory_changed', {'cwd': new_dir})
    else:
        emit('directory_changed', {'error': 'Directory not found'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080, debug=True)
