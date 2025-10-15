@echo off
echo ========================================
echo BGIN Agent Framework - Status Check
echo ========================================
echo.

echo Checking current system status...
echo.

echo Node.js Status:
where node >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Node.js is installed
    node --version
) else (
    echo [MISSING] Node.js is NOT installed
)

echo.
echo npm Status:
where npm >nul 2>&1
if %errorlevel%==0 (
    echo [OK] npm is installed
    npm --version
) else (
    echo [MISSING] npm is NOT installed
)

echo.
echo Docker Status:
where docker >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Docker is installed
    docker --version
) else (
    echo [MISSING] Docker is NOT installed
)

echo.
echo Git Status:
where git >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Git is installed
    git --version
) else (
    echo [MISSING] Git is NOT installed
)

echo.
echo Ollama Status:
where ollama >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Ollama is installed
    ollama --version
) else (
    echo [MISSING] Ollama is NOT installed
)

echo.
echo ========================================
echo SUMMARY
echo ========================================
echo.

where node >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Node.js - Ready
) else (
    echo ❌ Node.js - Need to install
)

where npm >nul 2>&1
if %errorlevel%==0 (
    echo ✅ npm - Ready
) else (
    echo ❌ npm - Need to install
)

where docker >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Docker - Ready
) else (
    echo ❌ Docker - Need to install
)

where git >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Git - Ready
) else (
    echo ❌ Git - Need to install
)

where ollama >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Ollama - Ready (Optional)
) else (
    echo ⚠️ Ollama - Optional (Not installed)
)

echo.
echo ========================================
echo NEXT STEPS
echo ========================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo 1. Install Node.js from: https://nodejs.org/
    echo    Choose LTS version (20.x recommended)
    echo.
)

where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo 2. Install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    echo    After installation, restart your computer
    echo.
)

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo 3. Install Git from: https://git-scm.com/download/win
    echo.
)

where ollama >nul 2>&1
if %errorlevel% neq 0 (
    echo 4. Install Ollama (Optional) from: https://ollama.ai/download/windows
    echo    This provides local AI models without API keys
    echo.
)

where node >nul 2>&1
if %errorlevel%==0 (
    where docker >nul 2>&1
    if %errorlevel%==0 (
        echo 🎉 You have the minimum requirements!
        echo.
        echo To start the BGIN Agent Framework:
        echo 1. Run: .\start-with-docker.bat
        echo 2. Open: http://localhost:4000
        echo.
    ) else (
        echo ⚠️ You have Node.js but need Docker for the full setup
        echo.
        echo Alternative: You can run the project with Node.js only
        echo 1. Run: .\setup-project.bat
        echo 2. Run: npm run dev
        echo.
    )
) else (
    echo ❌ You need to install the required tools first
)

echo.
pause
