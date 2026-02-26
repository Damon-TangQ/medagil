@echo off
REM Simple PostgreSQL Password Setup
REM Sets postgres user password to 'postgres123'

echo Setting PostgreSQL postgres user password...

set PG_BIN="C:\Program Files\PostgreSQL\15\bin"

REM Try to change password (may prompt for current password)
echo Attempting to set password...
echo If prompted for password, just press Enter (no password) or enter current password.

%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres123';"

if %errorlevel% neq 0 (
    echo Password change failed. Trying alternative method...
    REM If that fails, try creating a temporary superuser or using trust authentication
    echo Please manually run the following in psql:
    echo ALTER USER postgres PASSWORD 'postgres123';
    echo.
    echo Or edit pg_hba.conf to use 'trust' for local connections temporarily.
) else (
    echo Password set successfully!
)

REM Test the new password
echo Testing new password...
set PGPASSWORD=postgres123
%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "SELECT 'Password test successful!' as result;"

if %errorlevel% neq 0 (
    echo Password test failed.
) else (
    echo Password verification successful!
)

echo.
echo Connection test:
echo psql -h localhost -U postgres -d postgres
echo Password: postgres123
echo.

pause