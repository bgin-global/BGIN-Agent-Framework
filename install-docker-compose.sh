#!/bin/bash

# =====================================
# Install Docker Compose on EC2
# =====================================

set -e

echo "🚀 Installing Docker Compose..."

# Get latest version
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)

echo "Latest Docker Compose version: $DOCKER_COMPOSE_VERSION"

# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Create symbolic link (optional)
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify installation
docker-compose --version

echo "✅ Docker Compose installed successfully!"
