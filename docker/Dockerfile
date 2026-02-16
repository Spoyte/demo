FROM ubuntu:22.04

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    git \
    curl \
    wget \
    vim \
    nano \
    tree \
    htop \
    jq \
    fzf \
    ripgrep \
    fd-find \
    tesseract-ocr \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Create demo user
RUN useradd -m -s /bin/bash demo && \
    echo "demo:demo" | chpasswd && \
    usermod -aG sudo demo

# Set up workspace
WORKDIR /workspace
RUN chown demo:demo /workspace

# Copy tool scripts
COPY --chown=demo:demo tools/ /home/demo/tools/
COPY --chown=demo:demo sample-data/ /workspace/sample-data/

# Install Python tools
RUN pip3 install --no-cache-dir \
    flask \
    flask-socketio \
    pyyaml \
    requests \
    rich \
    click \
    prompt-toolkit \
    pygments

# Install Node.js tools globally
RUN npm install -g \
    http-server \
    nodemon

# Set up environment
ENV PATH="/home/demo/tools:${PATH}"
ENV DEMO_MODE=1
ENV HOME=/home/demo

# Copy entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Switch to demo user
USER demo

# Expose ports
EXPOSE 8080 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["web"]
