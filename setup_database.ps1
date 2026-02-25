# Medagil Database Setup Script
# This script sets up PostgreSQL database for Medagil project

Write-Host "Setting up Medagil database..." -ForegroundColor Green

$pgBin = "C:\Program Files\PostgreSQL\15\bin"
$schemaPath = "f:\project\Medagil\db\schema.sql"

# Function to run psql command
function Run-PsqlCommand {
    param([string]$command, [string]$database = "postgres")
    $env:PGPASSWORD = ""
    & "$pgBin\psql.exe" -h localhost -U postgres -d $database -c $command
}

# Create database
Write-Host "Creating database 'medagil'..." -ForegroundColor Yellow
Run-PsqlCommand "CREATE DATABASE medagil;"

# Create user and grant privileges
Write-Host "Creating user 'medagil_user'..." -ForegroundColor Yellow
Run-PsqlCommand "CREATE USER medagil_user WITH PASSWORD 'medagil_password';"
Run-PsqlCommand "GRANT ALL PRIVILEGES ON DATABASE medagil TO medagil_user;"

# Run schema
Write-Host "Running database schema..." -ForegroundColor Yellow
& "$pgBin\psql.exe" -h localhost -U postgres -d medagil -f $schemaPath

Write-Host "Database setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Connection details:" -ForegroundColor Cyan
Write-Host "Host: localhost"
Write-Host "Database: medagil"
Write-Host "User: medagil_user"
Write-Host "Password: medagil_password"
Write-Host ""
Read-Host "Press Enter to exit"