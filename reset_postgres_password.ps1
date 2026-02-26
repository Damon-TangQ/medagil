# Medagil Database Password Reset Script
# This script resets the PostgreSQL superuser password to 'postgres123'

Write-Host "Medagil Database Password Reset" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

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

Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down --volumes --remove-orphans

Write-Host "Starting PostgreSQL with new password..." -ForegroundColor Yellow
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
while ($attempt -lt $maxAttempts) {
    try {
        $result = docker exec medagil_postgres pg_isready -U postgres -d medagil
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

# Test connection with new password
Write-Host "Testing connection with new password..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "postgres123"
    $testQuery = "SELECT version();"
    $result = docker exec -i medagil_postgres psql -U postgres -d medagil -c $testQuery
    Write-Host "Connection successful!" -ForegroundColor Green
    Write-Host "PostgreSQL version info:" -ForegroundColor Cyan
    Write-Host $result
} catch {
    Write-Host "Connection test failed. Password may not be updated correctly." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Database Password Reset Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "New Superuser Credentials:" -ForegroundColor Cyan
Write-Host "Username: postgres"
Write-Host "Password: postgres123"
Write-Host "Database: medagil"
Write-Host ""
Write-Host "Application User Credentials (unchanged):" -ForegroundColor Cyan
Write-Host "Username: medagil_user"
Write-Host "Password: 123456"
Write-Host "Database: medagil"
Write-Host ""

Read-Host "Press Enter to exit"