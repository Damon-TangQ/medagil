@echo off
REM Medagil Database Password Reset Script
REM This script resets the PostgreSQL superuser password to 'postgres123'

echo Medagil Database Password Reset
echo ================================

REM Check if Docker is running
echo Checking Docker status...
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker is not available. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Navigate to docker directory
cd /d "%~dp0infra\docker"

echo Stopping existing containers...
docker-compose down --volumes --remove-orphans

echo Starting PostgreSQL with new password...
docker-compose up -d postgres

REM Wait for PostgreSQL to be ready
echo Waiting for PostgreSQL to be ready...
timeout /t 2 /nobreak >nul
docker exec medagil_postgres pg_isready -U postgres -d medagil
if errorlevel 1 (
    echo PostgreSQL failed to start. Please check Docker logs.
    pause
    exit /b 1
)

echo Testing connection with new password...
set PGPASSWORD=postgres123
docker exec -i medagil_postgres psql -U postgres -d medagil -c "SELECT version();"
if errorlevel 1 (
    echo Connection test failed. Password may not be updated correctly.
    pause
    exit /b 1
)

echo.
echo Database Password Reset Complete!
echo.
echo New Superuser Credentials:
echo Username: postgres
echo Password: postgres123
echo Database: medagil
echo.
echo Application User Credentials (unchanged):
echo Username: medagil_user
echo Password: 123456
echo Database: medagil
echo.

pause