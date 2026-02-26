# Database Connection Fix

## Problem
When connecting to PostgreSQL 15 database, you may encounter the error:
```
字段"datlastsysoid"不存在 LINE 1: SELECT DISTINCT datlastsysoid FROM pg_database
```

## Root Cause
The `datlastsysoid` field was removed from the `pg_database` system table in PostgreSQL 15. Some older database client tools (like DBeaver, pgAdmin, etc.) still try to query this deprecated field during connection.

## Solutions

### 1. Use the Fix Script (Recommended)
Run the provided fix script to ensure proper database setup:

**PowerShell:**
```powershell
.\fix_database_connection.ps1
```

**Batch:**
```cmd
fix_database_connection.bat
```

### 2. Update Database Client Tools
- **DBeaver**: Update to version 23.0.0 or later
- **pgAdmin**: Update to version 7.0 or later
- **DataGrip**: Update to latest version
- **Other tools**: Check for PostgreSQL 15 compatibility

### 3. Use Command Line Tools
Instead of GUI tools, use `psql` command line:

```bash
# Connect using Docker
docker exec -it medagil_postgres psql -U medagil_user -d medagil

# Or if you have local psql installed
psql -h localhost -p 5432 -U medagil_user -d medagil
```

### 4. Connection String
Use this connection string in compatible tools:
```
postgresql://medagil_user:123456@localhost:5432/medagil
```

## Database Details
- **Host**: localhost
- **Port**: 5432
- **Database**: medagil
- **User**: medagil_user
- **Password**: 123456

## Troubleshooting
If the fix script doesn't work:
1. Ensure Docker Desktop is running
2. Check if ports 5432, 27017, 6379 are available
3. Try restarting Docker Desktop
4. Run `docker system prune` to clean up old containers