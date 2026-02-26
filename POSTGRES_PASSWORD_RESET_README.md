# PostgreSQL 超级管理员密码重置

## 问题描述
需要将 PostgreSQL 超级管理员（postgres）用户的密码更改为 `postgres123`。

## 解决方案

### 方法 1：使用自动化脚本（推荐）

运行提供的重置脚本：

**PowerShell 脚本：**
```powershell
.\reset_postgres_password.ps1
```

**批处理脚本：**
```cmd
reset_postgres_password.bat
```

### 方法 2：手动执行

如果自动化脚本无法正常工作，可以手动执行以下步骤：

1. **停止数据库容器：**
```bash
cd infra/docker
docker-compose down --volumes --remove-orphans
```

2. **重新启动数据库：**
```bash
docker-compose up -d postgres
```

3. **等待数据库就绪：**
```bash
docker exec medagil_postgres pg_isready -U postgres -d medagil
```

4. **测试新密码：**
```bash
set PGPASSWORD=postgres123
docker exec -i medagil_postgres psql -U postgres -d medagil -c "SELECT version();"
```

## 更新后的凭据

### 超级管理员账号
- **用户名：** `postgres`
- **密码：** `postgres123`
- **数据库：** `medagil`

### 应用用户账号（保持不变）
- **用户名：** `medagil_user`
- **密码：** `123456`
- **数据库：** `medagil`

## 配置文件更新

已更新以下文件：
- `infra/docker/.env` - 设置新的超级管理员密码
- `infra/docker/.env.example` - 更新示例配置

## 注意事项

1. 密码更改后，所有使用 postgres 用户连接数据库的应用都需要更新连接字符串
2. 应用代码使用 `medagil_user` 账号，不受此更改影响
3. 如果遇到 Docker API 版本问题，请重启 Docker Desktop 或更新到最新版本

## 故障排除

如果脚本执行失败：
1. 确保 Docker Desktop 正在运行
2. 检查是否有足够的磁盘空间
3. 查看 Docker Desktop 的日志以获取更多错误信息
4. 尝试重启 Docker Desktop 服务