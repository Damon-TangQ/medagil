@echo off
REM PostgreSQL Service Restart Script
REM Run this as Administrator to restart PostgreSQL service

echo Restarting PostgreSQL service...
echo.

net stop postgresql-x64-15
if %errorlevel% neq 0 (
    echo Failed to stop service. You may need to run as Administrator.
    pause
    exit /b 1
)

net start postgresql-x64-15
if %errorlevel% neq 0 (
    echo Failed to start service.
    pause
    exit /b 1
)

echo.
echo PostgreSQL service restarted successfully!
echo.
echo Now you can set the password by running:
echo psql -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres123';"
echo.

pause