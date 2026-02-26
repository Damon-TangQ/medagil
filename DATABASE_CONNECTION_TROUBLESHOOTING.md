# PostgreSQL 连接问题故障排除指南

## 问题描述
使用管理员账号连接数据库时出现以下错误：
```
connection to server at "localhost" (::1), port 5432 failed: 连接被拒绝: 用户 "postgres" 密码验证失败
```

## 可能的原因

### 1. Docker Desktop 问题
当前 Docker Desktop 存在 API 版本兼容性问题，导致容器无法正常启动。

### 2. 本地 PostgreSQL 未运行
本地 PostgreSQL 服务没有启动或安装。

### 3. 密码配置错误
PostgreSQL 用户密码设置不正确。

### 4. 连接配置问题
pg_hba.conf 文件配置不允许密码认证。

## 解决方案

### 方案 1：使用本地 PostgreSQL（推荐）

如果您已经安装了 PostgreSQL，请运行：

**PowerShell：**
```powershell
.\setup_local_postgres.ps1
```

**批处理：**
```cmd
setup_local_postgres.bat
```

### 方案 2：修复 Docker Desktop

1. **重启 Docker Desktop**
   - 完全关闭 Docker Desktop
   - 等待 30 秒
   - 重新启动 Docker Desktop

2. **检查 Docker 版本**
   - 确保 Docker Desktop 是最新版本
   - 检查 Windows 版本兼容性

3. **运行数据库重置脚本**
   ```powershell
   .\reset_postgres_password.ps1
   ```

### 方案 3：手动配置 PostgreSQL

#### 步骤 1：检查 PostgreSQL 安装
```cmd
where psql
```
如果没有找到，请安装 PostgreSQL：https://www.postgresql.org/download/windows/

#### 步骤 2：启动 PostgreSQL 服务
```cmd
net start postgresql-x64-15
```

#### 步骤 3：修改 postgres 用户密码
```cmd
psql -U postgres -d postgres
```
在 psql 提示符下执行：
```sql
ALTER USER postgres PASSWORD 'postgres123';
\q
```

#### 步骤 4：测试连接
```cmd
psql -h localhost -U postgres -d postgres
```

#### 步骤 5：创建数据库和用户
```sql
CREATE DATABASE medagil;
CREATE USER medagil_user WITH PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE medagil TO medagil_user;
```

### 方案 4：修改 pg_hba.conf（如果需要）

如果仍然遇到认证问题，可能需要修改 `pg_hba.conf` 文件：

1. 找到 PostgreSQL 数据目录（通常在 `C:\Program Files\PostgreSQL\15\data\`）
2. 编辑 `pg_hba.conf` 文件
3. 确保有以下行：
   ```
   # TYPE  DATABASE        USER            ADDRESS                 METHOD
   local   all             postgres                                md5
   host    all             postgres        127.0.0.1/32            md5
   host    all             postgres        ::1/128                 md5
   ```
4. 重启 PostgreSQL 服务

## 验证连接

使用以下命令测试连接：

```cmd
set PGPASSWORD=postgres123
psql -h localhost -U postgres -d medagil -c "SELECT version();"
```

## 连接信息

成功配置后，使用以下信息连接：

- **超级管理员：**
  - 用户名：`postgres`
  - 密码：`postgres123`
  - 数据库：`medagil`

- **应用用户：**
  - 用户名：`medagil_user`
  - 密码：`123456`
  - 数据库：`medagil`

## GUI 工具连接

对于 DBeaver、pgAdmin 等工具，使用：
- Host: `localhost`
- Port: `5432`
- Database: `medagil`
- Username: `postgres` 或 `medagil_user`
- Password: `postgres123` 或 `123456`

## 常见问题

### Q: Docker 容器无法启动
A: 重启 Docker Desktop，检查磁盘空间，确保没有端口冲突。

### Q: 本地 PostgreSQL 找不到
A: 确认安装路径，检查 PATH 环境变量。

### Q: 密码验证仍然失败
A: 检查 pg_hba.conf 配置，确保服务已重启。

### Q: 端口 5432 被占用
A: 使用 `netstat -ano | findstr :5432` 查找占用进程，然后停止它。