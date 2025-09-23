@echo off
echo ========================================
echo  Domicile Harmony Development Server
echo ========================================
echo.

cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo Checking if Node.js is installed...
node --version
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    echo After installing Node.js:
    echo 1. Restart your computer
    echo 2. Run this file again
    echo.
    pause
    exit /b 1
)
echo Node.js is installed!
echo.

echo Checking if npm is available...
npm --version
if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm is not available
    echo Please reinstall Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo npm is available!
echo.

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please check your internet connection and try again
    echo.
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo Starting development server...
echo The application will be available at: http://localhost:8080/
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.
call npm run dev

echo.
echo Server stopped. Press any key to close this window.
pause
