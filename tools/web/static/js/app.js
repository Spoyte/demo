// Demo Environment Web App
const socket = io();

// State
let currentSection = 'dashboard';
let commandCount = 0;
let sessionStartTime = Date.now();

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initToolSearch();
    initTerminal();
    initSessionTimer();
    initResetButton();
});

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
            
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    const titles = {
        'dashboard': 'Dashboard',
        'tools': 'Tools',
        'terminal': 'Terminal',
        'tutorials': 'Tutorials'
    };
    
    document.getElementById('page-title').textContent = titles[sectionId] || 'Dashboard';
    currentSection = sectionId;
}

// Tool Search & Filter
function initToolSearch() {
    const searchInput = document.getElementById('tool-search');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const toolCards = document.querySelectorAll('.tool-card');
    
    // Search
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterTools(query, getActiveFilter());
    });
    
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterTools(searchInput.value.toLowerCase(), tab.dataset.filter);
        });
    });
}

function getActiveFilter() {
    const activeTab = document.querySelector('.filter-tab.active');
    return activeTab ? activeTab.dataset.filter : 'all';
}

function filterTools(query, category) {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        const name = card.querySelector('.tool-name').textContent.toLowerCase();
        const desc = card.querySelector('.tool-description').textContent.toLowerCase();
        const cardCategory = card.dataset.category;
        
        const matchesQuery = !query || name.includes(query) || desc.includes(query);
        const matchesCategory = category === 'all' || cardCategory === category;
        
        card.style.display = matchesQuery && matchesCategory ? 'block' : 'none';
    });
}

// Terminal
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                addTerminalLine(`demo@nemo:~$ ${command}`, 'command');
                executeCommand(command);
                input.value = '';
                commandCount++;
                updateCommandCount();
            }
        }
    });
    
    // Clear terminal button
    document.getElementById('clear-terminal').addEventListener('click', () => {
        output.innerHTML = `
            <div class="terminal-line">
                <span class="terminal-prompt">demo@nemo:~$</span>
                <span class="terminal-text">Terminal cleared.</span>
            </div>
        `;
    });
    
    // Socket.io for real-time terminal
    socket.on('terminal_output', (data) => {
        if (data.output) {
            addTerminalLine(data.output, 'output');
        }
        if (data.error) {
            addTerminalLine(data.error, 'error');
        }
        if (data.done) {
            addTerminalLine('', 'prompt');
        }
    });
}

function addTerminalLine(text, type = 'output') {
    const output = document.getElementById('terminal-output');
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (type === 'command') {
        line.innerHTML = `<span class="terminal-prompt">demo@nemo:~$</span><span class="terminal-text">${escapeHtml(text.replace('demo@nemo:~$ ', ''))}</span>`;
    } else if (type === 'error') {
        line.innerHTML = `<span style="color: var(--accent-danger)">${escapeHtml(text)}</span>`;
    } else if (type === 'prompt') {
        line.innerHTML = `<span class="terminal-prompt">demo@nemo:~$</span><span class="terminal-cursor">_</span>`;
    } else {
        line.innerHTML = `<span class="terminal-text">${escapeHtml(text)}</span>`;
    }
    
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function executeCommand(command) {
    // Simulate command execution
    const responses = {
        'help': `Available commands:
  help              Show this help message
  ls                List files in current directory
  pwd               Print working directory
  cd <dir>          Change directory
  clear             Clear terminal
  
Try these tool commands:
  file-organizer --help
  local-search --help
  jsonq --help`,
        'ls': 'documents/  logs/  json/  code/  output/',
        'pwd': '/workspace/playground',
        'clear': ''
    };
    
    const response = responses[command] || `Command '${command}' executed successfully. (Demo mode - full functionality available in container)`;
    
    if (command !== 'clear') {
        setTimeout(() => {
            addTerminalLine(response, 'output');
            addTerminalLine('', 'prompt');
        }, 100);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Session Timer
function initSessionTimer() {
    setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        
        document.querySelector('.session-time').textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

function updateCommandCount() {
    const statValue = document.querySelector('.stat-value');
    if (statValue && statValue.nextElementSibling.textContent === 'Commands Run') {
        statValue.textContent = commandCount;
    }
}

// Reset Demo
function initResetButton() {
    document.getElementById('reset-demo').addEventListener('click', () => {
        if (confirm('Reset demo environment? All changes will be lost.')) {
            location.reload();
        }
    });
}

// Tool Modal
function openTool(toolId) {
    fetch(`/api/tool/${toolId}`)
        .then(r => r.json())
        .then(tool => {
            document.getElementById('modal-title').textContent = `${tool.icon} ${tool.name}`;
            document.getElementById('modal-body').innerHTML = `
                <div class="tool-detail">
                    <p class="tool-description">${tool.description}</p>
                    <div class="tool-meta">
                        <span class="tool-category-badge">${tool.category}</span>
                        <code class="tool-command">${tool.command}</code>
                    </div>
                    <div class="tool-actions-modal">
                        <button class="btn btn-primary" onclick="showSection('terminal'); closeModal();">
                            <i class="fas fa-terminal"></i>
                            Open in Terminal
                        </button>
                        <button class="btn btn-secondary" onclick="showTutorial('${tool.id}')">
                            <i class="fas fa-book"></i>
                            View Tutorial
                        </button>
                    </div>
                    ${tool.tutorial_content ? `
                    <div class="tutorial-preview">
                        <h3>Quick Start</h3>
                        <pre><code>${escapeHtml(tool.tutorial_content.substring(0, 500))}...</code></pre>
                    </div>
                    ` : ''}
                </div>
            `;
            document.getElementById('tool-modal').classList.add('active');
        });
}

function showTutorial(toolId) {
    fetch(`/api/tool/${toolId}`)
        .then(r => r.json())
        .then(tool => {
            document.getElementById('modal-title').textContent = `${tool.icon} ${tool.name} Tutorial`;
            document.getElementById('modal-body').innerHTML = `
                <div class="tutorial-content">
                    ${tool.tutorial_content ? `
                        <div class="tutorial-markdown">
                            ${markdownToHtml(tool.tutorial_content)}
                        </div>
                    ` : '<p>No tutorial available yet.</p>'}
                    <div class="tutorial-actions">
                        <button class="btn btn-primary" onclick="showSection('terminal'); closeModal();">
                            <i class="fas fa-terminal"></i>
                            Try It Now
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('tool-modal').classList.add('active');
        });
}

function closeModal() {
    document.getElementById('tool-modal').classList.remove('active');
}

// Simple markdown parser
function markdownToHtml(markdown) {
    return markdown
        .replace(/# (.*)/g, '<h1>$1</h1>')
        .replace(/## (.*)/g, '<h2>$1</h2>')
        .replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/- (.*)/g, '<li>$1</li>')
        .replace(/\n/g, '<br>');
}

// Close modal on outside click
document.getElementById('tool-modal').addEventListener('click', (e) => {
    if (e.target.id === 'tool-modal') {
        closeModal();
    }
});
