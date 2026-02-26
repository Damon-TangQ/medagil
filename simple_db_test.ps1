# Simple Database Connection Test
Write-Host "Database Connection Test" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

$server = "localhost"
$database = "medagil"
$user = "medagil_user"
$password = "123456"

Write-Host "Testing connection..." -ForegroundColor Yellow
Write-Host "Server: $server" -ForegroundColor Cyan
Write-Host "Database: $database" -ForegroundColor Cyan
Write-Host "User: $user" -ForegroundColor Cyan

# Set password environment variable
$env:PGPASSWORD = $password

# Try psql if available
try {
    $psqlPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
    if (Test-Path $psqlPath) {
        Write-Host "Using psql command..." -ForegroundColor Yellow
        $result = & $psqlPath -h $server -U $user -d $database -c "SELECT version();" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Connection successful!" -ForegroundColor Green
            Write-Host "Version:" -ForegroundColor Cyan
            Write-Host $result
        } else {
            Write-Host "✗ Connection failed!" -ForegroundColor Red
            Write-Host "Error:" -ForegroundColor Red
            Write-Host $result
        }
    } else {
        Write-Host "psql not found. Please install PostgreSQL or use a GUI client." -ForegroundColor Yellow
        Write-Host "Connection string: postgresql://$user`:$password@$server`:$database" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "If using GUI tools, make sure to use:" -ForegroundColor Yellow
Write-Host "- Host: $server"
Write-Host "- Port: 5432"
Write-Host "- Database: $database"
Write-Host "- User: $user"
Write-Host "- Password: $password"
Write-Host ""

Read-Host "Press Enter to exit"