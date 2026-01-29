@echo off
REM Campus Carbon Footprint Tracker Setup Script

echo.
echo ====================================================
echo Campus Carbon Footprint Tracker - Setup
echo ====================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Node.js detected

REM Install root dependencies
echo.
echo Installing root dependencies...
cd /d "%~dp0"
call npm install --legacy-peer-deps

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd /d "%~dp0server"
call npm install --legacy-peer-deps

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd /d "%~dp0client"
call npm install --legacy-peer-deps

echo.
echo ====================================================
echo Installation Complete!
echo ====================================================
echo.
echo To start the application:
echo.
echo Option 1 - Run both servers:
echo   npm run dev
echo.
echo Option 2 - Run separately:
echo   Terminal 1: cd server && npm start
echo   Terminal 2: cd client && npm start
echo.
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.
pause
