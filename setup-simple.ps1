# BGIN Agent Framework - Simple Windows Setup
Write-Host "🚀 BGIN Agent Framework - Windows Setup" -ForegroundColor Cyan

# Check current directory
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green

# Step 1: Check what's already installed
Write-Host "`n📋 Checking installed tools..." -ForegroundColor Yellow

$tools = @("node", "npm", "docker", "git", "ollama")
foreach ($tool in $tools) {
    if (Get-Command $tool -ErrorAction SilentlyContinue) {
        Write-Host "✅ $tool is installed" -ForegroundColor Green
    } else {
        Write-Host "❌ $tool is NOT installed" -ForegroundColor Red
    }
}

Write-Host "`n📦 Installation Instructions:" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

Write-Host "`n1. Node.js (REQUIRED):" -ForegroundColor Yellow
Write-Host "   Download from: https://nodejs.org/" -ForegroundColor White
Write-Host "   Choose LTS version (20.x recommended)" -ForegroundColor White

Write-Host "`n2. Docker Desktop (REQUIRED):" -ForegroundColor Yellow
Write-Host "   Download from: https://www.docker.com/products/docker-desktop/" -ForegroundColor White
Write-Host "   After installation, restart your computer" -ForegroundColor White

Write-Host "`n3. Git (REQUIRED):" -ForegroundColor Yellow
Write-Host "   Download from: https://git-scm.com/download/win" -ForegroundColor White

Write-Host "`n4. Ollama (RECOMMENDED for local LLM):" -ForegroundColor Yellow
Write-Host "   Download from: https://ollama.ai/download/windows" -ForegroundColor White

Write-Host "`nAfter installing the above tools, run this script again to continue with project setup." -ForegroundColor Green
