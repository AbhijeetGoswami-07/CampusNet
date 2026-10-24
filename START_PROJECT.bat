@echo off
title CampusNet - Student Living Platform
cd /d "%~dp0"

echo ===================================================
echo           CampusNet - Starting Project...
echo ===================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b
)

:: 2. Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [INFO] First time setup: Installing node_modules...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install encountered an error.
        pause
        exit /b
    )
)

:: 3. Launch browser and development server
echo [INFO] Starting development server...
echo [INFO] Opening http://localhost:5173 in your default browser...
echo.
echo ===================================================
echo  CampusNet is now running!
echo  URL: http://localhost:5173
echo.
echo  Keep this window open while using CampusNet.
echo  To STOP the server, press Ctrl + C or close this window.
echo ===================================================
echo.

call npm run dev -- --open --host

pause
