# Simple Database Connection Test
# This script tests connection to PostgreSQL without Docker

Write-Host "Simple Database Connection Test" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# Database connection details
$host = "localhost"
$port = "5432"
$db = "medagil"
$user = "medagil_user"
$password = "123456"

Write-Host "Testing connection to PostgreSQL..." -ForegroundColor Yellow
Write-Host "Host: $host" -ForegroundColor Cyan
Write-Host "Port: $port" -ForegroundColor Cyan
Write-Host "Database: $db" -ForegroundColor Cyan
Write-Host "User: $user" -ForegroundColor Cyan

# Try to connect using .NET PostgreSQL client if available
try {
    Add-Type -Path "C:\Program Files\PostgreSQL\15\bin\Npgsql.dll" -ErrorAction Stop
    $connectionString = "Host=$host;Port=$port;Database=$db;Username=$user;Password=$password;"
    $connection = New-Object Npgsql.NpgsqlConnection($connectionString)
    $connection.Open()
    Write-Host "Connection successful!" -ForegroundColor Green

    # Test query
    $command = $connection.CreateCommand()
    $command.CommandText = "SELECT version();"
    $result = $command.ExecuteScalar()
    Write-Host "PostgreSQL Version: $result" -ForegroundColor Green

    $connection.Close()
} catch {
    Write-Host "Direct .NET connection failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative connection methods:" -ForegroundColor Yellow
    Write-Host "1. Use psql command line tool if installed" -ForegroundColor Cyan
    Write-Host "2. Use a modern database GUI client" -ForegroundColor Cyan
    Write-Host "3. Check if PostgreSQL service is running" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "If you're getting 'datlastsysoid' errors:" -ForegroundColor Yellow
Write-Host "- Update your database client to latest version" -ForegroundColor Cyan
Write-Host "- Use PostgreSQL 15 compatible tools" -ForegroundColor Cyan
Write-Host "- Avoid using deprecated system table queries" -ForegroundColor Cyan

Read-Host "Press Enter to exit"