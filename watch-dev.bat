@echo off
echo.
echo ====================================
echo   Recycling App - Watch Mode
echo ====================================
echo.
echo This will:
echo 1. Keep frontend dev server running
echo 2. Auto-rebuild when files change
echo.
cd /d "C:\Users\Gamer\Documents\Reciclaje\frontend"

REM Keep watching for changes
:loop
cls
echo [%date% %time%] Watching for changes...
echo Press Ctrl+C to stop.
echo.

REM Watch src directory and rebuild on changes
for /r src %%A in (*.tsx *.ts *.css) do (
    setlocal enabledelayedexpansion
    set "file=%%A"
    set "lastmod=!lastmod!"
    for /F "tokens=*" %%B in ('powershell -Command "(Get-ItemProperty -Path '%%A' -Name LastWriteTime).lastWriteTime"') do (
        if not "%%B"=="!lastmod!" (
            echo [%time%] Change detected: %%~nxA
            echo Running: npm run build
            call npm run build
            echo Build complete. Refresh browser in http://127.0.0.1:5173
            echo.
            set "lastmod=%%B"
        )
    )
    endlocal
)

timeout /t 1 /nobreak >nul
goto loop
