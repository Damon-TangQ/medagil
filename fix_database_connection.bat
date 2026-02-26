@echo off
REM Medagil Database Connection Fix
REM This script helps resolve the 'datlastsysoid' field error when connecting to PostgreSQL 15

echo Medagil Database Connection Fix
echo ================================

REM Check if Docker is running
echo Checking Docker status...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not available. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo Docker is available.

REM Navigate to docker directory
cd /d "%~dp0..\infra\docker"

REM Start database services
echo Starting database services...
docker-compose up -d postgres mongodb redis

REM Wait for PostgreSQL to be ready
echo Waiting for PostgreSQL to be ready...
timeout /t 2 /nobreak >nul
:check_postgres
docker exec medagil_postgres pg_isready -U medagil_user -d medagil >nul 2>&1
if errorlevel 1 (
    echo Still waiting...
    timeout /t 2 /nobreak >nul
    goto check_postgres
)
echo PostgreSQL is ready!

REM Test connection
echo Testing database connection...
docker exec medagil_postgres psql -U medagil_user -d medagil -c "SELECT version();" >nul 2>&1
if errorlevel 1 (
    echo ERROR: Connection test failed.
    pause
    exit /b 1
)
echo Connection successful!

echo.
echo Database Connection Details:
echo Host: localhost
echo Port: 5432
echo Database: medagil
echo User: medagil_user
echo Password: 123456
echo.
echo For GUI tools connection issues:
echo 1. Update your database client to the latest version
echo 2. Use psql command line: docker exec -it medagil_postgres psql -U medagil_user -d medagil
echo 3. Or use connection string: postgresql://medagil_user:123456@localhost:5432/medagil
echo.

pause