@echo off
echo ========================================
echo BGIN Agent Framework - Dependency Installer
echo ========================================
echo.

echo Checking current directory...
cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo Checking installed tools...
where node >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Node.js is installed
    node --version
) else (
    echo [MISSING] Node.js is NOT installed
)

where npm >nul 2>&1
if %errorlevel%==0 (
    echo [OK] npm is installed
    npm --version
) else (
    echo [MISSING] npm is NOT installed
)

where docker >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Docker is installed
    docker --version
) else (
    echo [MISSING] Docker is NOT installed
)

where git >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Git is installed
    git --version
) else (
    echo [MISSING] Git is NOT installed
)

where ollama >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Ollama is installed
    ollama --version
) else (
    echo [MISSING] Ollama is NOT installed
)

echo.
echo ========================================
echo INSTALLATION REQUIRED
echo ========================================
echo.
echo Please install the following tools:
echo.
echo 1. Node.js (REQUIRED)
echo    Download: https://nodejs.org/
echo    Choose LTS version (20.x recommended)
echo.
echo 2. Docker Desktop (REQUIRED)
echo    Download: https://www.docker.com/products/docker-desktop/
echo    After installation, restart your computer
echo.
echo 3. Git (REQUIRED)
echo    Download: https://git-scm.com/download/win
echo.
echo 4. Ollama (RECOMMENDED for local LLM)
echo    Download: https://ollama.ai/download/windows
echo.
echo After installing these tools, run this script again.
echo.
pause
