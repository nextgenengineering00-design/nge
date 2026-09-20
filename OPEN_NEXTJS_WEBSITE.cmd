@echo off
setlocal
cd /d "%~dp0"

powershell.exe -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing http://localhost:3000/ -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }"
if errorlevel 1 (
  if not exist ".next\BUILD_ID" call npm run build
  start "NGE Next.js" /min cmd.exe /c "npm run start"
  timeout /t 4 /nobreak >nul
)

start "" "http://localhost:3000/"
endlocal
