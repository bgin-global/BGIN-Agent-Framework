@echo off
echo ========================================
echo BGIN Agent Framework - Project Setup
echo ========================================
echo.

echo Checking if required tools are installed...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required but not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is required but not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is required but not installed
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo [OK] All required tools are installed
echo.

echo Installing project dependencies...
echo.

echo Step 1: Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Step 3: Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Step 4: Setting up environment file...
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
echo Step 5: Starting Docker services...
docker-compose up -d postgres redis qdrant
if %errorlevel% neq 0 (
    echo [WARNING] Failed to start Docker services
    echo Please make sure Docker Desktop is running
) else (
    echo [OK] Docker services started
)

echo.
echo Step 6: Setting up Ollama (if installed)...
where ollama >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Ollama found, pulling required model...
    ollama pull llama3.2:3b-instruct
    if %errorlevel%==0 (
        echo [OK] Ollama model ready
    ) else (
        echo [WARNING] Failed to pull Ollama model
    )
) else (
    echo [INFO] Ollama not installed, skipping model setup
)

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your API keys (if needed)
echo 2. Start the development server: npm run dev
echo 3. Open http://localhost:4000 in your browser
echo.
echo For detailed instructions, see BGIN_SETUP_COMPLETE.md
echo.
pause
