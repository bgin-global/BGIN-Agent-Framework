@echo off
echo Installing Node.js portable version...

REM Download Node.js portable
echo Downloading Node.js...
powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-win-x64.zip' -OutFile '%TEMP%\node-portable.zip'"

REM Extract Node.js
echo Extracting Node.js...
powershell -Command "Expand-Archive -Path '%TEMP%\node-portable.zip' -DestinationPath '%TEMP%\node-portable' -Force"

REM Add to PATH for this session
set PATH=%TEMP%\node-portable\node-v20.10.0-win-x64;%PATH%

REM Test Node.js
echo Testing Node.js installation...
node --version
npm --version

echo Node.js portable installation complete!
echo You can now run the project setup.
