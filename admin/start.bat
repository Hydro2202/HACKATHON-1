@echo off
echo Starting Domicile Harmony...
echo.

cd /d "%~dp0"
echo Current directory: %CD%

echo.
echo Checking Node.js...
node --version
if errorlevel 1 (
    echo Node.js not found! Please install from https://nodejs.org/
    pause
    exit
)

echo.
echo Installing dependencies...
npm install

echo.
echo Starting server...
echo Open your browser and go to: http://localhost:8080/
echo.
npm run dev

pause
