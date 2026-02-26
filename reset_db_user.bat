@echo off
REM Reset Medagil Database User Password

echo Resetting Medagil database user password...

REM Set PostgreSQL bin path
set PG_BIN="C:\Program Files\PostgreSQL\15\bin"

echo Connecting to PostgreSQL as postgres user...
echo Please enter the postgres password when prompted...

REM Reset the user password
%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "DROP USER IF EXISTS medagil_user;"

%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "CREATE USER medagil_user WITH PASSWORD '123456';"

%PG_BIN%\psql.exe -h localhost -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE medagil TO medagil_user;"

echo.
echo User reset completed!
echo.
echo Connection details:
echo Host: localhost
echo Database: medagil
echo User: medagil_user
echo Password: 123456
echo.

pause