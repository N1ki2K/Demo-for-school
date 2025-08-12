@echo off
echo Starting School CMS System...
echo.

echo Setting up backend...
cd backend

REM Copy .env if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)

echo Starting backend server on port 3001...
start cmd /k "npx ts-node src/index.ts"

echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

cd..

echo.
echo Backend should now be running on http://localhost:3001

REM Setup frontend environment
if not exist .env (
    echo Creating frontend .env file...
    copy .env.example .env
)

echo.
echo To start the frontend:
echo 1. Open a new terminal
echo 2. Run: npm run dev
echo 3. Open http://localhost:5173
echo 4. Login with admin/admin123
echo.

echo Backend is running in the background window.
echo Press any key to exit...
pause > nul