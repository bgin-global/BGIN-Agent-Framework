# BGIN Agent Framework - Windows Setup Script
# This script will install all required dependencies and set up the development environment

Write-Host "🚀 BGIN Agent Framework - Windows Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "⚠️  This script requires administrator privileges for some installations." -ForegroundColor Yellow
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to continue anyway (some installations may fail)"
}

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to download and install Node.js
function Install-NodeJS {
    Write-Host "📦 Installing Node.js..." -ForegroundColor Green
    if (Test-Command "node") {
        Write-Host "✅ Node.js is already installed" -ForegroundColor Green
        node --version
        return
    }
    
    Write-Host "Downloading Node.js LTS..." -ForegroundColor Yellow
    $nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
    $nodeInstaller = "$env:TEMP\nodejs-installer.msi"
    
    try {
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller
        Write-Host "Installing Node.js..." -ForegroundColor Yellow
        Start-Process msiexec.exe -Wait -ArgumentList "/i $nodeInstaller /quiet"
        Remove-Item $nodeInstaller
        Write-Host "✅ Node.js installed successfully" -ForegroundColor Green
        
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    }
    catch {
        Write-Host "❌ Failed to install Node.js: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Please download and install Node.js manually from https://nodejs.org/" -ForegroundColor Yellow
    }
}

# Function to install Docker Desktop
function Install-DockerDesktop {
    Write-Host "🐳 Installing Docker Desktop..." -ForegroundColor Green
    if (Test-Command "docker") {
        Write-Host "✅ Docker is already installed" -ForegroundColor Green
        docker --version
        return
    }
    
    Write-Host "Docker Desktop requires manual installation." -ForegroundColor Yellow
    Write-Host "Please download and install Docker Desktop from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    Write-Host "After installation, restart your computer and run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter after installing Docker Desktop"
}

# Function to install Git
function Install-Git {
    Write-Host "📋 Installing Git..." -ForegroundColor Green
    if (Test-Command "git") {
        Write-Host "✅ Git is already installed" -ForegroundColor Green
        git --version
        return
    }
    
    Write-Host "Downloading Git..." -ForegroundColor Yellow
    $gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"
    $gitInstaller = "$env:TEMP\git-installer.exe"
    
    try {
        Invoke-WebRequest -Uri $gitUrl -OutFile $gitInstaller
        Write-Host "Installing Git..." -ForegroundColor Yellow
        Start-Process $gitInstaller -Wait -ArgumentList "/SILENT"
        Remove-Item $gitInstaller
        Write-Host "✅ Git installed successfully" -ForegroundColor Green
        
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    }
    catch {
        Write-Host "❌ Failed to install Git: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Please download and install Git manually from https://git-scm.com/" -ForegroundColor Yellow
    }
}

# Function to install Ollama
function Install-Ollama {
    Write-Host "🤖 Installing Ollama..." -ForegroundColor Green
    if (Test-Command "ollama") {
        Write-Host "✅ Ollama is already installed" -ForegroundColor Green
        ollama --version
        return
    }
    
    Write-Host "Downloading Ollama..." -ForegroundColor Yellow
    $ollamaUrl = "https://ollama.ai/download/windows"
    Write-Host "Please download Ollama from: $ollamaUrl" -ForegroundColor Yellow
    Write-Host "After installation, restart your terminal and run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter after installing Ollama"
}

# Function to install project dependencies
function Install-ProjectDependencies {
    Write-Host "📦 Installing project dependencies..." -ForegroundColor Green
    
    if (-not (Test-Command "node")) {
        Write-Host "❌ Node.js is required but not installed" -ForegroundColor Red
        return
    }
    
    if (-not (Test-Command "npm")) {
        Write-Host "❌ npm is required but not installed" -ForegroundColor Red
        return
    }
    
    try {
        Write-Host "Installing root dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        Set-Location "frontend"
        npm install
        Set-Location ".."
        
        Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
        Set-Location "backend"
        npm install
        Set-Location ".."
        
        Write-Host "✅ All dependencies installed successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install dependencies: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to set up environment variables
function Setup-Environment {
    Write-Host "⚙️ Setting up environment variables..." -ForegroundColor Green
    
    if (Test-Path ".env") {
        Write-Host "✅ .env file already exists" -ForegroundColor Green
        return
    }
    
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env"
        Write-Host "✅ Created .env file from template" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env file with your API keys" -ForegroundColor Yellow
    } else {
        Write-Host "❌ env.example file not found" -ForegroundColor Red
    }
}

# Function to start Docker services
function Start-DockerServices {
    Write-Host "🐳 Starting Docker services..." -ForegroundColor Green
    
    if (-not (Test-Command "docker")) {
        Write-Host "❌ Docker is required but not installed" -ForegroundColor Red
        return
    }
    
    try {
        Write-Host "Starting core services (PostgreSQL, Redis, Qdrant)..." -ForegroundColor Yellow
        docker-compose up -d postgres redis qdrant
        
        Write-Host "Waiting for services to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        Write-Host "✅ Docker services started successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to start Docker services: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to set up Ollama model
function Setup-OllamaModel {
    Write-Host "🤖 Setting up Ollama model..." -ForegroundColor Green
    
    if (-not (Test-Command "ollama")) {
        Write-Host "❌ Ollama is required but not installed" -ForegroundColor Red
        return
    }
    
    try {
        Write-Host "Pulling llama3.2:3b-instruct model..." -ForegroundColor Yellow
        ollama pull llama3.2:3b-instruct
        
        Write-Host "✅ Ollama model ready" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to set up Ollama model: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main execution
Write-Host "Starting BGIN Agent Framework setup..." -ForegroundColor Cyan

# Step 1: Install core tools
Install-NodeJS
Install-Git
Install-DockerDesktop
Install-Ollama

# Step 2: Install project dependencies
Install-ProjectDependencies

# Step 3: Set up environment
Setup-Environment

# Step 4: Start Docker services
Start-DockerServices

# Step 5: Set up Ollama
Setup-OllamaModel

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your API keys" -ForegroundColor White
Write-Host "2. Start the development server: npm run dev" -ForegroundColor White
Write-Host "3. Open http://localhost:4000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "For detailed setup instructions, see BGIN_SETUP_COMPLETE.md" -ForegroundColor Yellow
