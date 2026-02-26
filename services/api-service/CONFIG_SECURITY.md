# 配置安全说明

## 概述

本文档详细说明Medagil API服务的配置管理，包括环境变量使用、配置文件管理和安全最佳实践。

## 配置文件

### 文件结构

```
api-service/
├── config.yaml          # 默认配置文件（不提交到版本控制）
├── config.dev.yaml     # 开发环境配置
├── config.prod.yaml    # 生产环境配置
└── .gitignore         # 忽略敏感配置文件
```

### 配置文件说明

#### config.yaml（默认配置）

**用途**: 默认配置文件，用于本地开发

**特点**:
- 包含所有配置项
- 使用环境变量默认值
- 不包含敏感信息

**安全建议**:
- 不要包含真实密码
- 使用环境变量默认值
- 可以提交到版本控制

#### config.dev.yaml（开发环境）

**用途**: 开发环境专用配置

**特点**:
- 包含开发环境的特定配置
- 使用开发环境的默认值
- 数据库名称使用 `_dev` 后缀

**配置项**:
```yaml
database:
  host: ${DB_HOST:localhost}
  port: ${DB_PORT:5432}
  user: ${DB_USER:postgres}
  password: ${DB_PASSWORD:123456}
  dbname: ${DB_NAME:medagil_dev}
  sslmode: ${DB_SSLMODE:disable}
  max_open_conns: ${DB_MAX_OPEN_CONNS:10}
  max_idle_conns: ${DB_MAX_IDLE_CONNS:5}
  conn_max_lifetime: ${DB_CONN_MAX_LIFETIME:300}

server:
  port: ${SERVER_PORT:8080}
  read_timeout: ${SERVER_READ_TIMEOUT:30s}
  write_timeout: ${SERVER_WRITE_TIMEOUT:30s}
  mode: ${GIN_MODE:debug}

admin:
  token: ${ADMIN_TOKEN:admin_dev_token_2024}

log:
  level: ${LOG_LEVEL:debug}
  format: ${LOG_FORMAT:text}
  output: ${LOG_OUTPUT:stdout}

other:
  env: ${ENV:development}
  timezone: ${TZ:Asia/Shanghai}
```

#### config.prod.yaml（生产环境）

**用途**: 生产环境专用配置

**特点**:
- 包含生产环境的特定配置
- 敏感信息必须通过环境变量设置
- 数据库名称使用 `_prod` 后缀

**配置项**:
```yaml
database:
  host: ${DB_HOST}
  port: ${DB_PORT:5432}
  user: ${DB_USER}
  password: ${DB_PASSWORD}
  dbname: ${DB_NAME}
  sslmode: ${DB_SSLMODE:require}
  max_open_conns: ${DB_MAX_OPEN_CONNS:50}
  max_idle_conns: ${DB_MAX_IDLE_CONNS:20}
  conn_max_lifetime: ${DB_CONN_MAX_LIFETIME:3600}

server:
  port: ${SERVER_PORT:8080}
  read_timeout: ${SERVER_READ_TIMEOUT:15s}
  write_timeout: ${SERVER_WRITE_TIMEOUT:15s}
  mode: ${GIN_MODE:release}

admin:
  token: ${ADMIN_TOKEN}

log:
  level: ${LOG_LEVEL:info}
  format: ${LOG_FORMAT:json}
  output: ${LOG_OUTPUT:/var/log/medagil/api-service.log}

other:
  env: ${ENV:production}
  timezone: ${TZ:Asia/Shanghai}
  rate_limit: ${RATE_LIMIT:1000/hour}
```

## 环境变量

### 必需环境变量（生产环境）

| 变量名 | 说明 | 示例 | 开发环境 |
|---------|------|------|----------|
| DB_HOST | 数据库主机地址 | prod-db-server | localhost |
| DB_USER | 数据库用户名 | medagil_user | postgres |
| DB_PASSWORD | 数据库密码 | secure_password_123 | 123456 |
| DB_NAME | 数据库名称 | medagil_prod | medagil_dev |
| ADMIN_TOKEN | 管理员token | secure_token_2024 | admin_dev_token_2024 |
| LOG_LEVEL | 日志级别 | info | debug |

### 可选环境变量

| 变量名 | 说明 | 默认值 |
|---------|------|--------|
| DB_PORT | 数据库端口 | 5432 |
| DB_SSLMODE | SSL模式 | disable（dev）/ require（prod） |
| DB_MAX_OPEN_CONNS | 最大打开连接数 | 20（dev）/ 50（prod） |
| DB_MAX_IDLE_CONNS | 最大空闲连接数 | 10（dev）/ 20（prod） |
| DB_CONN_MAX_LIFETIME | 连接最大生命周期（秒） | 300（dev）/ 3600（prod） |
| SERVER_PORT | 服务端口 | 8080 |
| SERVER_READ_TIMEOUT | 读取超时 | 15s |
| SERVER_WRITE_TIMEOUT | 写入超时 | 15s |
| GIN_MODE | 运行模式 | debug（dev）/ release（prod） |
| LOG_FORMAT | 日志格式 | text（dev）/ json（prod） |
| LOG_OUTPUT | 日志输出位置 | stdout（dev）/ 文件路径（prod） |
| ENV | 环境标识 | development / production |
| TZ | 时区 | Asia/Shanghai |
| RATE_LIMIT | 请求速率限制 | 1000/hour |

## 使用方法

### 1. 开发环境

#### Windows

```batch
REM 设置环境变量
set DB_PASSWORD=your_dev_password
set ADMIN_TOKEN=your_dev_token

REM 启动服务
bin\server.exe --config config.dev.yaml
```

#### Linux/Mac

```bash
# 设置环境变量
export DB_PASSWORD=your_dev_password
export ADMIN_TOKEN=your_dev_token

# 启动服务
./server --config config.dev.yaml
```

### 2. 生产环境

#### Windows

```batch
REM 设置环境变量
set DB_HOST=prod-db-server
set DB_USER=medagil_user
set DB_PASSWORD=your_secure_password
set DB_NAME=medagil_prod
set ADMIN_TOKEN=your_secure_token
set LOG_LEVEL=info

REM 启动服务
bin\server.exe --config config.prod.yaml
```

#### Linux/Mac

```bash
# 设置环境变量
export DB_HOST=prod-db-server
export DB_USER=medagil_user
export DB_PASSWORD=your_secure_password
export DB_NAME=medagil_prod
export ADMIN_TOKEN=your_secure_token
export LOG_LEVEL=info

# 启动服务
./server --config config.prod.yaml
```

### 3. 使用配置文件

```bash
# 指定配置文件启动
./server --config config.dev.yaml    # 开发环境
./server --config config.prod.yaml   # 生产环境

# 如果不指定，使用默认config.yaml
./server
```

## 验证方法

### 1. 验证开发环境配置

#### 批处理脚本

```bash
verify_config.bat dev
```

#### PowerShell脚本

```powershell
powershell -ExecutionPolicy Bypass -File Verify-Config.ps1 -Action dev
```

### 2. 验证生产环境配置

#### 批处理脚本

```bash
verify_config.bat prod
```

#### PowerShell脚本

```powershell
powershell -ExecutionPolicy Bypass -File Verify-Config.ps1 -Action prod
```

### 3. 验证环境变量覆盖

#### 批处理脚本

```bash
verify_config.bat env
```

#### PowerShell脚本

```powershell
powershell -ExecutionPolicy Bypass -File Verify-Config.ps1 -Action env
```

## 安全最佳实践

### 1. 密码管理

**原则**:
- 不要在配置文件中硬编码密码
- 使用强密码（至少12位，包含大小写字母、数字和特殊字符）
- 定期轮换密码（建议每3-6个月）
- 使用密码管理工具（如KeePass、LastPass等）

**示例**:
```bash
# 好的密码示例
# Xk9#mP2$vL8@nQ5（16位，包含大小写、数字和特殊字符）

# 不好的密码示例
# 123456（太简单）
# password（常见密码）
# admin（常见密码）
```

### 2. Token管理

**原则**:
- 不要在配置文件中硬编码token
- 使用强token（至少32位随机字符串）
- 定期轮换token（建议每1-3个月）
- 使用不同的token用于不同环境

**生成强token**:
```bash
# Linux/Mac（使用openssl）
openssl rand -hex 32

# Windows（使用PowerShell）
$token = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 3. 文件权限

**原则**:
- 限制配置文件的访问权限
- 仅允许所有者读写
- 定期检查文件权限

**设置文件权限**:
```bash
# Linux/Mac
chmod 600 config.prod.yaml

# 验证权限
ls -l config.prod.yaml
# 应显示: -rw------- (600)
```

### 4. 版本控制

**原则**:
- 不要将敏感配置提交到版本控制
- 使用.gitignore忽略敏感文件
- 使用示例配置文件作为模板

**.gitignore示例**:
```
# 敏感配置文件
config.prod.yaml
config.local.yaml

# 环境变量文件
.env
.env.local
.env.production

# 日志文件
*.log
logs/
```

### 5. 环境隔离

**原则**:
- 使用不同的数据库用于不同环境
- 使用不同的配置文件
- 使用不同的服务端口
- 使用不同的日志级别

**环境对比**:

| 配置项 | 开发环境 | 生产环境 |
|--------|----------|----------|
| 数据库名称 | medagil_dev | medagil_prod |
| 服务端口 | 8080 | 8080（或不同） |
| 运行模式 | debug | release |
| 日志级别 | debug | info |
| SSL模式 | disable | require |
| 日志输出 | stdout | 文件 |

## 故障排查

### 问题1: 配置文件未找到

**症状**:
- 启动时报错 "config file not found"

**解决方案**:
1. 检查配置文件路径是否正确
2. 确认配置文件存在
3. 检查文件权限

### 问题2: 环境变量未生效

**症状**:
- 设置环境变量后，仍然使用默认值

**解决方案**:
1. 确认环境变量名称正确
2. 重启服务使环境变量生效
3. 检查环境变量作用域

### 问题3: 数据库连接失败

**症状**:
- 启动时报错 "failed to connect to database"

**解决方案**:
1. 检查数据库配置是否正确
2. 确认数据库服务是否运行
3. 验证数据库凭证是否正确
4. 检查网络连接

### 问题4: 端口被占用

**症状**:
- 启动时报错 "address already in use"

**解决方案**:
1. 检查端口是否被其他进程占用
2. 修改配置文件中的端口号
3. 通过环境变量设置不同的端口

## 相关文档

- [Viper配置管理](https://github.com/spf13/viper)
- [环境变量最佳实践](https://12factor.net/)
- [密码安全指南](https://owasp.org/www-community/password-storage-cheat-sheet)

## 更新日志

- 2024-01-XX: 初始版本，实现配置文件和环境变量管理
