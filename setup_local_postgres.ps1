# Medagil Database Setup - Local PostgreSQL
# This script sets up PostgreSQL database using local installation

Write-Host "Medagil Database Setup - Local PostgreSQL" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Check if local PostgreSQL is installed
$pgPaths = @(
    "C:\Program Files\PostgreSQL\15\bin",
    "C:\Program Files\PostgreSQL\14\bin",
    "C:\Program Files\PostgreSQL\13\bin",
    "C:\Program Files\PostgreSQL\16\bin"
)

$psqlPath = $null
foreach ($path in $pgPaths) {
    if (Test-Path "$path\psql.exe") {
        $psqlPath = "$path\psql.exe"
        break
    }
}

if (-not $psqlPath) {
    Write-Host "Local PostgreSQL installation not found." -ForegroundColor Red
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "Or use Docker Desktop (after fixing the API issues)." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found PostgreSQL at: $psqlPath" -ForegroundColor Green

# Function to run psql command
function Run-PsqlCommand {
    param([string]$command, [string]$database = "postgres")
    $env:PGPASSWORD = "postgres123"
    & $psqlPath -h localhost -U postgres -d $database -c $command
}

# Check if PostgreSQL service is running
Write-Host "Checking PostgreSQL service status..." -ForegroundColor Yellow
$service = Get-Service -Name "postgresql-x64-15" -ErrorAction SilentlyContinue
if (-not $service) {
    $service = Get-Service | Where-Object {$_.Name -like "*postgres*"} | Select-Object -First 1
}

if ($service) {
    if ($service.Status -ne "Running") {
        Write-Host "Starting PostgreSQL service..." -ForegroundColor Yellow
        Start-Service $service.Name
        Start-Sleep -Seconds 5
    }
    Write-Host "PostgreSQL service is running." -ForegroundColor Green
} else {
    Write-Host "PostgreSQL service not found. Please start it manually." -ForegroundColor Red
    Write-Host "You can start it from Services.msc or pg_ctl command." -ForegroundColor Yellow
    exit 1
}

# Test connection
Write-Host "Testing connection to PostgreSQL..." -ForegroundColor Yellow
try {
    $result = Run-PsqlCommand "SELECT version();"
    Write-Host "Connection successful!" -ForegroundColor Green
    Write-Host "PostgreSQL version: $result" -ForegroundColor Cyan
} catch {
    Write-Host "Connection failed. Please check PostgreSQL configuration." -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Create database if it doesn't exist
Write-Host "Creating database 'medagil' if it doesn't exist..." -ForegroundColor Yellow
try {
    Run-PsqlCommand "CREATE DATABASE medagil;" "postgres"
    Write-Host "Database 'medagil' created." -ForegroundColor Green
} catch {
    if ($_.Exception.Message -contains "already exists") {
        Write-Host "Database 'medagil' already exists." -ForegroundColor Cyan
    } else {
        Write-Host "Failed to create database: $_" -ForegroundColor Red
        exit 1
    }
}

# Create application user
Write-Host "Creating application user 'medagil_user'..." -ForegroundColor Yellow
try {
    Run-PsqlCommand "CREATE USER medagil_user WITH PASSWORD '123456';" "postgres"
    Run-PsqlCommand "GRANT ALL PRIVILEGES ON DATABASE medagil TO medagil_user;" "postgres"
    Write-Host "User 'medagil_user' created and granted privileges." -ForegroundColor Green
} catch {
    if ($_.Exception.Message -contains "already exists") {
        Write-Host "User 'medagil_user' already exists." -ForegroundColor Cyan
    } else {
        Write-Host "Failed to create user: $_" -ForegroundColor Red
        exit 1
    }
}

# Run schema
$schemaPath = "F:\project\Medagil\db\schema.sql"
if (Test-Path $schemaPath) {
    Write-Host "Running database schema..." -ForegroundColor Yellow
    try {
        & $psqlPath -h localhost -U postgres -d medagil -f $schemaPath
        Write-Host "Database schema applied successfully." -ForegroundColor Green
    } catch {
        Write-Host "Failed to apply schema: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Schema file not found at: $schemaPath" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Database Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Connection Details:" -ForegroundColor Cyan
Write-Host "Host: localhost"
Write-Host "Port: 5432"
Write-Host "Superuser - Username: postgres, Password: postgres123"
Write-Host "Application - Username: medagil_user, Password: 123456"
Write-Host "Database: medagil"
Write-Host ""

Read-Host "Press Enter to exit"