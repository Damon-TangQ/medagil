# Medagil Database Connection Fix
# This script helps resolve the 'datlastsysoid' field error when connecting to PostgreSQL 15

Write-Host "Medagil Database Connection Fix" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "Docker is available: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker is not available. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Navigate to docker directory
$dockerDir = Split-Path $PSScriptRoot -Parent
$dockerDir = Join-Path $dockerDir "infra\docker"
Set-Location $dockerDir

# Start database services
Write-Host "Starting database services..." -ForegroundColor Yellow
docker-compose up -d postgres mongodb redis

# Wait for services to be ready
Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
while ($attempt -lt $maxAttempts) {
    try {
        $result = docker exec medagil_postgres pg_isready -U medagil_user -d medagil
        if ($LASTEXITCODE -eq 0) {
            Write-Host "PostgreSQL is ready!" -ForegroundColor Green
            break
        }
    } catch {
        # Ignore errors and continue waiting
    }
    Start-Sleep -Seconds 2
    $attempt++
}

if ($attempt -eq $maxAttempts) {
    Write-Host "PostgreSQL failed to start within expected time." -ForegroundColor Red
    exit 1
}

# Test connection using psql
Write-Host "Testing database connection..." -ForegroundColor Yellow
try {
    $testQuery = "SELECT version();"
    $result = docker exec -i medagil_postgres psql -U medagil_user -d medagil -c $testQuery
    Write-Host "Connection successful!" -ForegroundColor Green
    Write-Host "PostgreSQL version info:" -ForegroundColor Cyan
    Write-Host $result
} catch {
    Write-Host "Connection test failed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Database Connection Details:" -ForegroundColor Cyan
Write-Host "Host: localhost"
Write-Host "Port: 5432"
Write-Host "Database: medagil"
Write-Host "User: medagil_user"
Write-Host "Password: 123456"
Write-Host ""
Write-Host "For GUI tools connection issues:" -ForegroundColor Yellow
Write-Host "1. Update your database client to the latest version"
Write-Host "2. Use psql command line: docker exec -it medagil_postgres psql -U medagil_user -d medagil"
Write-Host "3. Or use connection string: postgresql://medagil_user:123456@localhost:5432/medagil"
Write-Host ""

Read-Host "Press Enter to exit"