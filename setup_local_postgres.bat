@echo off
REM Medagil Database Setup - Local PostgreSQL
REM This script sets up PostgreSQL database using local installation

echo Medagil Database Setup - Local PostgreSQL
echo ==========================================

REM Check for PostgreSQL installation
set PG_FOUND=0
set PG_BIN=

if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" (
    set PG_BIN="C:\Program Files\PostgreSQL\15\bin"
    set PG_FOUND=1
    echo Found PostgreSQL 15
) else if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" (
    set PG_BIN="C:\Program Files\PostgreSQL\14\bin"
    set PG_FOUND=1
    echo Found PostgreSQL 14
) else if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" (
    set PG_BIN="C:\Program Files\PostgreSQL\16\bin"
    set PG_FOUND=1
    echo Found PostgreSQL 16
) else (
    echo PostgreSQL not found in standard locations.
    echo Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    echo Or fix Docker Desktop issues and use Docker containers.
    pause
    exit /b 1
)

echo Using PostgreSQL at: %PG_BIN%

REM Check if PostgreSQL service is running
echo Checking PostgreSQL service...
sc query postgresql-x64-15 >nul 2>&1
if %errorlevel% neq 0 (
    sc query | findstr /i postgres >nul 2>&1
    if %errorlevel% neq 0 (
        echo PostgreSQL service not found. Please start PostgreSQL service manually.
        echo You can start it from Services.msc or use pg_ctl command.
        pause
        exit /b 1
    )
)

REM Try to start the service if it's not running
sc query postgresql-x64-15 | findstr "RUNNING" >nul 2>&1
if %errorlevel% neq 0 (
    echo Starting PostgreSQL service...
    net start postgresql-x64-15 >nul 2>&1
    if %errorlevel% neq 0 (
        echo Failed to start PostgreSQL service. Please start it manually.
        pause
        exit /b 1
    )
    timeout /t 5 /nobreak >nul
)

echo PostgreSQL service is running.

REM Test connection and change password
echo Setting postgres user password to 'postgres123'...
set PGPASSWORD=postgres123

REM Try to connect and change password
%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres123';" >nul 2>&1
if %errorlevel% neq 0 (
    echo Failed to change password. Trying with default/no password...
    set PGPASSWORD=
    %PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres123';" >nul 2>&1
    if %errorlevel% neq 0 (
        echo Still failed. Please check PostgreSQL configuration.
        echo You may need to edit pg_hba.conf to allow password authentication.
        pause
        exit /b 1
    )
)

REM Test new password
echo Testing new password...
%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "SELECT version();" >nul 2>&1
if %errorlevel% neq 0 (
    echo Password test failed. Please check PostgreSQL logs.
    pause
    exit /b 1
)

echo Password updated successfully!

REM Create database
echo Creating database 'medagil'...
%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "CREATE DATABASE medagil;" >nul 2>&1
if %errorlevel% neq 0 (
    echo Database 'medagil' may already exist or creation failed.
)

REM Create application user
echo Creating application user 'medagil_user'...
%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "CREATE USER medagil_user WITH PASSWORD '123456';" >nul 2>&1
%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE medagil TO medagil_user;" >nul 2>&1

REM Run schema if it exists
if exist "F:\project\Medagil\db\schema.sql" (
    echo Running database schema...
    %PG_BIN%\psql.exe -h localhost -U postgres -d medagil -f "F:\project\Medagil\db\schema.sql" >nul 2>&1
    if %errorlevel% neq 0 (
        echo Schema application may have failed. Please check manually.
    ) else (
        echo Schema applied successfully.
    )
)

echo.
echo Database Setup Complete!
echo.
echo Connection Details:
echo Host: localhost
echo Port: 5432
echo Superuser - Username: postgres, Password: postgres123
echo Application - Username: medagil_user, Password: 123456
echo Database: medagil
echo.
echo You can now connect using:
echo psql -h localhost -U postgres -d medagil
echo.

pause