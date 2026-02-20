@echo off
echo ===================================================
echo       FinSight 2.0 - System Startup Script
echo ===================================================

echo [1/3] Starting Backend Server (FastAPI)...
start "FinSight Backend" cmd /k "cd backend && (if exist venv\Scripts\activate (call venv\Scripts\activate && pip install -r requirements.txt -q) else if exist .venv\Scripts\activate (call .venv\Scripts\activate && pip install -r requirements.txt -q)) && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo [2/3] Starting Frontend Server (Next.js)...
start "FinSight Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo [3/3] Opening Dashboard...
timeout /t 5 >nul
start http://localhost:3000

echo ===================================================
echo       System is running! 🚀
echo ===================================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause
