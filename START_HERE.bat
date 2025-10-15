@echo off
echo ========================================
echo BGIN Agent Framework - START HERE
echo ========================================
echo.

echo This will help you get the BGIN Agent Framework running!
echo.

echo STEP 1: Install Required Tools
echo ==============================
echo.
echo You need to install these 4 tools manually:
echo.
echo 1. Node.js (JavaScript runtime)
echo    Download: https://nodejs.org/
echo    Choose LTS version (20.x recommended)
echo.
echo 2. Docker Desktop (Container platform)
echo    Download: https://www.docker.com/products/docker-desktop/
echo    After installation, restart your computer
echo.
echo 3. Git (Version control)
echo    Download: https://git-scm.com/download/win
echo.
echo 4. Ollama (Local AI models - OPTIONAL)
echo    Download: https://ollama.ai/download/windows
echo.
echo After installing these tools, come back and run this script again.
echo.
pause

echo.
echo STEP 2: Checking if tools are installed...
echo =========================================

where node >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Node.js is installed
    node --version
) else (
    echo [MISSING] Node.js is NOT installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel%==0 (
    echo [OK] npm is installed
    npm --version
) else (
    echo [MISSING] npm is NOT installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

where docker >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Docker is installed
    docker --version
) else (
    echo [MISSING] Docker is NOT installed
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

where git >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Git is installed
    git --version
) else (
    echo [MISSING] Git is NOT installed
    echo Please install Git from https://git-scm.com/download/win
    pause
    exit /b 1
)

echo.
echo STEP 3: Installing project dependencies...
echo =========================================

echo Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)

echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo STEP 4: Setting up environment...
echo ================================

if not exist .env (
    if exist env.example (
        copy env.example .env
        echo [OK] Created .env file from template
    ) else (
        echo [WARNING] env.example file not found
    )
) else (
    echo [OK] .env file already exists
)

echo.
echo STEP 5: Starting Docker services...
echo ===================================

echo Starting PostgreSQL, Redis, and Qdrant...
docker-compose up -d postgres redis qdrant
if %errorlevel% neq 0 (
    echo [WARNING] Failed to start Docker services
    echo Please make sure Docker Desktop is running
) else (
    echo [OK] Docker services started
)

echo.
echo STEP 6: Setting up Ollama (if available)...
echo ===========================================

where ollama >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Ollama found, pulling AI model...
    ollama pull llama3.2:3b-instruct
    if %errorlevel%==0 (
        echo [OK] Ollama model ready
    ) else (
        echo [WARNING] Failed to pull Ollama model
    )
) else (
    echo [INFO] Ollama not installed, skipping
)

echo.
echo ========================================
echo 🎉 SETUP COMPLETE!
echo ========================================
echo.
echo Your BGIN Agent Framework is ready!
echo.
echo To start the application:
echo 1. Run: npm run dev
echo 2. Open: http://localhost:4000
echo.
echo For detailed documentation, see:
echo - BGIN_SETUP_COMPLETE.md
echo - QUICK_START_GUIDE.md
echo.
pause
