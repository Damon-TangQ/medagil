# PostgreSQL pg_hba.conf Restore Script
# Restores normal md5 authentication after password reset

Write-Host "PostgreSQL pg_hba.conf Restore Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

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
    Write-Host "Could not find pg_hba.conf file." -ForegroundColor Red
    exit 1
}

Write-Host "Found data directory: $dataDir" -ForegroundColor Green

$hbaPath = "$dataDir\pg_hba.conf"
$backupPath = "$dataDir\pg_hba.conf.backup"

if (-not (Test-Path $backupPath)) {
    Write-Host "Backup file not found. Cannot restore." -ForegroundColor Red
    exit 1
}

# Read current content
$content = Get-Content $hbaPath -Raw

# Remove the temporary trust lines
$lines = $content -split "`n"
$filteredLines = $lines | Where-Object {
    $_ -notmatch "# Temporary trust authentication" -and
    $_ -notmatch "local\s+all\s+postgres\s+trust" -and
    $_ -notmatch "host\s+all\s+postgres\s+127\.0\.0\.1/32\s+trust" -and
    $_ -notmatch "host\s+all\s+postgres\s+::1/128\s+trust"
}

# Change trust to md5 for postgres user
$finalLines = $filteredLines | ForEach-Object {
    if ($_ -match "local\s+all\s+postgres" -and $_ -match "trust") {
        $_ -replace "trust", "md5"
    } elseif ($_ -match "host\s+all\s+postgres\s+127\.0\.0\.1/32" -and $_ -match "trust") {
        $_ -replace "trust", "md5"
    } elseif ($_ -match "host\s+all\s+postgres\s+::1/128" -and $_ -match "trust") {
        $_ -replace "trust", "md5"
    } else {
        $_
    }
}

# Write back to file
Write-Host "Restoring normal authentication..." -ForegroundColor Yellow
$finalLines -join "`n" | Set-Content $hbaPath -Encoding UTF8

Write-Host "pg_hba.conf restored successfully!" -ForegroundColor Green

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

# Test the password authentication
Write-Host "Testing password authentication..." -ForegroundColor Yellow
$env:PGPASSWORD = "postgres123"
$psqlPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"

if (Test-Path $psqlPath) {
    try {
        $result = & $psqlPath -h localhost -U postgres -d postgres -c "SELECT 'Authentication working!' as status;" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Authentication test successful!" -ForegroundColor Green
        } else {
            Write-Host "Authentication test failed." -ForegroundColor Red
        }
    } catch {
        Write-Host "Authentication test failed: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Configuration restored to normal password authentication." -ForegroundColor Green
Write-Host "You can now connect with: psql -h localhost -U postgres -d postgres" -ForegroundColor White
Write-Host "Password: postgres123" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"