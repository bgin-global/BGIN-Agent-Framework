@echo off
echo ========================================
echo BGIN Agent Framework - Docker Setup
echo ========================================
echo.

echo Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    echo After installation, restart your computer and run this script again.
    pause
    exit /b 1
)

echo [OK] Docker is installed
docker --version

echo.
echo Checking Docker Compose...
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not available
    echo Please make sure Docker Desktop is running
    pause
    exit /b 1
)

echo [OK] Docker Compose is available
docker-compose --version

echo.
echo Starting BGIN Agent Framework...
echo This will download images and start all services...
echo.

echo Starting core services (PostgreSQL, Redis, Qdrant)...
docker-compose up -d postgres redis qdrant

echo Waiting for database services to start...
timeout /t 10 /nobreak >nul

echo Starting backend and frontend...
docker-compose up -d backend frontend

echo.
echo ========================================
echo 🎉 BGIN Agent Framework is starting!
echo ========================================
echo.
echo Services starting:
echo - PostgreSQL Database (Port 5432)
echo - Redis Cache (Port 6379)  
echo - Qdrant Vector DB (Port 6333)
echo - Backend API (Port 4000)
echo - Frontend App (Port 3000)
echo.
echo Once ready, open your browser to:
echo http://localhost:4000
echo.
echo To view logs:
echo docker-compose logs -f
echo.
echo To stop services:
echo docker-compose down
echo.
pause
