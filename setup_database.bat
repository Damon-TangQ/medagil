@echo off
REM Medagil Database Setup Script
REM This script sets up PostgreSQL database for Medagil project

echo Setting up Medagil database...

REM Set PostgreSQL bin path
set PG_BIN="C:\Program Files\PostgreSQL\15\bin"
set PG_DATA="C:\PostgreSQL\data"

REM Create database
echo Creating database 'medagil'...
%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "CREATE DATABASE medagil;"

REM Create user
echo Creating user 'medagil_user'...
%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "CREATE USER medagil_user WITH PASSWORD 'medagil_password';"

REM Grant privileges
echo Granting privileges...
%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE medagil TO medagil_user;"

REM Run schema
echo Running database schema...
%PG_BIN%\psql.exe -h localhost -U postgres -d medagil -f "f:\project\Medagil\db\schema.sql"

echo Database setup completed!
echo.
echo Connection details:
echo Host: localhost
echo Database: medagil
echo User: medagil_user
echo Password: medagil_password
echo.
pause