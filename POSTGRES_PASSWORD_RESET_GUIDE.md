# PostgreSQL 密码重置完整指南

## 当前问题
PostgreSQL 需要当前密码才能更改密码，而且可能配置为不允许密码认证。

## 解决方案步骤

### 步骤 1：修改 pg_hba.conf（临时信任认证）

1. 找到 PostgreSQL 数据目录：
   - 通常是：`C:\Program Files\PostgreSQL\15\data\`
   - 或运行：`psql -U postgres -c "SHOW data_directory;"`

2. 编辑 `pg_hba.conf` 文件，添加以下行到文件顶部：
   ```
   # Temporary trust authentication for password reset
   local   all             postgres                                trust
   host    all             postgres        127.0.0.1/32            trust
   host    all             postgres        ::1/128                 trust
   ```

3. 保存文件并重启 PostgreSQL 服务：
   ```cmd
   net stop postgresql-x64-15
   net start postgresql-x64-15
   ```

### 步骤 2：设置新密码

运行以下命令设置密码：
```cmd
psql -U postgres -d postgres -c "ALTER USER postgres PASSWORD 'postgres123';"
```

### 步骤 3：恢复 pg_hba.conf 配置

将之前添加的 `trust` 行改为 `md5`：
```
local   all             postgres                                md5
host    all             postgres        127.0.0.1/32            md5
host    all             postgres        ::1/128                 md5
```

### 步骤 4：重启服务并测试

```cmd
net stop postgresql-x64-15
net start postgresql-x64-15
```

测试连接：
```cmd
set PGPASSWORD=postgres123
psql -h localhost -U postgres -d postgres -c "SELECT version();"
```

## 自动脚本

如果您想使用脚本，请运行：

```cmd
.\fix_pg_hba.ps1
```

## 替代方案：使用其他用户

如果无法修改 postgres 密码，可以：

1. 使用 Windows 管理员权限运行：
   ```cmd
   runas /user:Administrator "psql -U postgres -d postgres"
   ```

2. 或临时使用 `trust` 认证连接后立即更改密码。

## 验证成功

成功后，您应该能够使用以下命令连接：
- 用户名：`postgres`
- 密码：`postgres123`
- 数据库：`postgres` 或 `medagil`