# PostgreSQL pg_hba.conf Fix Script
# Temporarily enables trust authentication to reset postgres password

Write-Host "PostgreSQL pg_hba.conf Fix Script" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Find PostgreSQL data directory
Write-Host "Finding PostgreSQL data directory..." -ForegroundColor Yellow

$dataDir = $null
$possiblePaths = @(
    "C:\Program Files\PostgreSQL\15\data",
    "C:\Program Files\PostgreSQL\14\data",
    "C:\Program Files\PostgreSQL\16\data",
    "C:\Program Files\PostgreSQL\13\data"
)

foreach ($path in $possiblePaths) {
    if (Test-Path "$path\pg_hba.conf") {
        $dataDir = $path
        break
    }
}

if (-not $dataDir) {
    Write-Host "Could not find pg_hba.conf file. Please locate it manually." -ForegroundColor Red
    Write-Host "Common locations:" -ForegroundColor Yellow
    $possiblePaths | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
    exit 1
}

Write-Host "Found data directory: $dataDir" -ForegroundColor Green

$hbaPath = "$dataDir\pg_hba.conf"
$backupPath = "$dataDir\pg_hba.conf.backup"

# Backup original file
Write-Host "Creating backup of pg_hba.conf..." -ForegroundColor Yellow
Copy-Item $hbaPath $backupPath -Force

# Read current content
$content = Get-Content $hbaPath -Raw

# Add trust authentication lines at the top
$trustLines = @"
# Temporary trust authentication for password reset - added by Medagil script
local   all             postgres                                trust
host    all             postgres        127.0.0.1/32            trust
host    all             postgres        ::1/128                 trust

"@

$newContent = $trustLines + $content

# Write back to file
Write-Host "Updating pg_hba.conf with trust authentication..." -ForegroundColor Yellow
$newContent | Set-Content $hbaPath -Encoding UTF8

Write-Host "pg_hba.conf updated successfully!" -ForegroundColor Green

# Restart PostgreSQL service
Write-Host "Restarting PostgreSQL service..." -ForegroundColor Yellow
$serviceName = "postgresql-x64-15"
if (-not (Get-Service $serviceName -ErrorAction SilentlyContinue)) {
    $serviceName = Get-Service | Where-Object {$_.Name -like "*postgres*"} | Select-Object -First 1 -ExpandProperty Name
}

if ($serviceName) {
    Restart-Service $serviceName -Force
    Write-Host "PostgreSQL service restarted." -ForegroundColor Green
} else {
    Write-Host "Could not find PostgreSQL service. Please restart it manually." -ForegroundColor Red
}

# Wait a moment for service to start
Start-Sleep -Seconds 3

# Now try to set the password
Write-Host "Setting postgres user password..." -ForegroundColor Yellow
$env:PGPASSWORD = ""
$psqlPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"

if (Test-Path $psqlPath) {
    try {
        & $psqlPath -h localhost -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres123';"
        Write-Host "Password set successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to set password: $_" -ForegroundColor Red
    }
} else {
    Write-Host "psql.exe not found. Please run manually:" -ForegroundColor Yellow
    Write-Host "psql -U postgres -d postgres -c \"ALTER USER postgres PASSWORD 'postgres123';\"" -ForegroundColor Cyan
}

# Test the new password
Write-Host "Testing new password..." -ForegroundColor Yellow
$env:PGPASSWORD = "postgres123"
try {
    $result = & $psqlPath -h localhost -U postgres -d postgres -c "SELECT 'Connection successful!' as status;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Password test successful!" -ForegroundColor Green
    } else {
        Write-Host "Password test failed." -ForegroundColor Red
    }
} catch {
    Write-Host "Password test failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Test connection: psql -h localhost -U postgres -d postgres" -ForegroundColor White
Write-Host "2. Password: postgres123" -ForegroundColor White
Write-Host "3. Run the restore script to restore normal authentication: .\restore_pg_hba.ps1" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"