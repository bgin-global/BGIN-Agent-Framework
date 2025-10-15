@echo off
echo ========================================
echo BGIN Agent Framework - Node.js Docker Setup
echo ========================================
echo.

echo Pulling Node.js Docker image...
docker pull node:22-alpine

echo.
echo Creating Node.js container and starting shell session...
echo You can now run Node.js commands inside the container.
echo.
echo To verify Node.js version, run: node -v
echo To verify npm version, run: npm -v
echo.
echo To exit the container, type: exit
echo.

docker run -it --rm --entrypoint sh node:22-alpine
