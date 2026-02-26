# 依赖安装和验证指南

本文档说明如何安装和验证项目的依赖项，确保Go和Python项目能够正常编译和运行。

## 前置条件

### Go项目要求
- Go 1.21 或更高版本
- Git（用于下载依赖）

### Python项目要求
- Python 3.10 或更高版本
- pip（Python包管理器）

## 1. Go项目依赖安装

### 1.1 配置Go代理（中国大陆用户）

为了加速依赖下载，建议配置国内Go代理：

```bash
# 配置Go代理为国内镜像
go env -w GOPROXY=https://goproxy.cn,direct

# 验证代理配置
go env GOPROXY
```

**说明**：
- `https://goproxy.cn`：七牛云提供的Go模块代理，速度快且稳定
- `direct`：当代理无法获取时，直接从源码仓库下载
- 此配置适用于中国大陆用户，其他地区用户可跳过此步骤

### 1.2 安装Go依赖

进入api-service目录并安装依赖：

```bash
cd services/api-service

# 清理并整理依赖
go mod tidy

# 下载所有依赖
go mod download

# 验证依赖
go mod verify
```

**说明**：
- `go mod tidy`：分析代码中的import语句，添加缺失的依赖，移除未使用的依赖
- `go mod download`：下载所有依赖到本地缓存
- `go mod verify`：验证依赖的完整性和安全性

### 1.3 验证Go项目编译

```bash
# 编译项目
go build ./cmd/server

# 验证编译结果
./server --help  # Linux/Mac
# 或
server.exe --help  # Windows
```

**预期结果**：
- 编译无错误
- 生成的可执行文件可以正常运行

### 1.4 Go项目依赖说明

api-service项目的主要依赖：

| 依赖包 | 版本 | 用途 |
|--------|------|------|
| github.com/gin-gonic/gin | v1.9.1 | Web框架 |
| github.com/spf13/viper | v1.16.0 | 配置管理 |
| gorm.io/gorm | v1.25.5 | ORM框架 |
| gorm.io/driver/postgres | v1.5.4 | PostgreSQL驱动 |
| gopkg.in/yaml.v3 | v3.0.1 | YAML解析 |

## 2. Python项目依赖安装

### 2.1 创建虚拟环境（推荐）

```bash
cd services/ai-service

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

**说明**：
- 虚拟环境可以隔离项目依赖，避免与系统Python环境冲突
- 推荐为每个项目创建独立的虚拟环境

### 2.2 安装Python依赖

#### 方法1：使用pip安装（推荐）

```bash
cd services/ai-service

# 以可编辑模式安装项目及其依赖
pip install -e .
```

**说明**：
- `-e` 或 `--editable`：以可编辑模式安装，修改代码后无需重新安装
- 此命令会自动安装pyproject.toml中定义的所有依赖

#### 方法2：手动安装依赖

如果方法1失败，可以手动安装核心依赖：

```bash
# 安装核心依赖
pip install psycopg2-binary==2.9.9
pip install fastapi==0.109.0
pip install uvicorn[standard]>=0.27.0
pip install pydantic>=2.0.0
pip install pydantic-settings>=2.0.0
pip install requests>=2.31.0
pip install python-multipart>=0.0.6
```

**说明**：
- `psycopg2-binary`：PostgreSQL数据库驱动
- `fastapi`：现代Web框架
- `uvicorn`：ASGI服务器
- `pydantic`：数据验证和设置管理
- `requests`：HTTP客户端库

### 2.3 验证Python依赖安装

```bash
# 检查已安装的包
pip list

# 验证关键依赖
python -c "import fastapi; print(fastapi.__version__)"
python -c "import psycopg2; print(psycopg2.__version__)"
python -c "import pydantic; print(pydantic.__version__)"
```

**预期结果**：
- 所有依赖包成功安装
- 无ImportError错误
- 显示正确的版本号

### 2.4 验证Python项目启动

```bash
cd services/ai-service

# 启动AI服务
python app/main.py
```

**预期结果**：
- 服务正常启动，无ImportError
- 显示类似以下输出：
  ```
  INFO:     Started server process [xxxx]
  INFO:     Waiting for application startup.
  INFO:     Application startup complete.
  INFO:     Uvicorn running on http://0.0.0.0:8000
  ```

### 2.5 Python项目依赖说明

ai-service项目的主要依赖：

| 依赖包 | 版本要求 | 用途 |
|--------|----------|------|
| fastapi | >=0.109.0 | Web框架 |
| uvicorn | >=0.27.0 | ASGI服务器 |
| pydantic | >=2.0.0 | 数据验证 |
| pydantic-settings | >=2.0.0 | 配置管理 |
| requests | >=2.31.0 | HTTP客户端 |
| psycopg2-binary | >=2.9.0 | PostgreSQL驱动 |
| python-multipart | >=0.0.6 | 文件上传支持 |

## 3. 常见问题排查

### 3.1 Go项目问题

**问题1：依赖下载失败**
```bash
# 解决方案：配置国内代理
go env -w GOPROXY=https://goproxy.cn,direct
go mod tidy
```

**问题2：编译错误**
```bash
# 解决方案：清理缓存后重新编译
go clean -cache
go build ./cmd/server
```

**问题3：版本冲突**
```bash
# 解决方案：查看依赖关系
go mod graph | grep <package-name>
# 然后调整go.mod中的版本要求
```

### 3.2 Python项目问题

**问题1：pip install失败**
```bash
# 解决方案1：使用国内镜像
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple <package-name>

# 解决方案2：升级pip
python -m pip install --upgrade pip
```

**问题2：psycopg2-binary安装失败**
```bash
# 解决方案：先安装系统依赖
# Ubuntu/Debian:
sudo apt-get install libpq-dev
# CentOS/RHEL:
sudo yum install postgresql-devel
# Windows: 通常不需要额外安装

# 然后重新安装
pip install psycopg2-binary==2.9.9
```

**问题3：ImportError**
```bash
# 解决方案：检查Python路径
python -c "import sys; print(sys.path)"

# 确认虚拟环境已激活
which python  # Linux/Mac
where python  # Windows
```

## 4. 自动化安装脚本

### 4.1 Go项目安装脚本（Windows）

创建 `install_go_deps.bat`：

```batch
@echo off
echo Configuring Go proxy...
go env -w GOPROXY=https://goproxy.cn,direct

echo Installing Go dependencies...
cd services/api-service
go mod tidy
go mod download

echo Verifying dependencies...
go mod verify

echo Building project...
go build ./cmd/server

echo Done!
```

### 4.2 Python项目安装脚本（Windows）

创建 `install_python_deps.bat`：

```batch
@echo off
echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -e .

echo Verifying installation...
python -c "import fastapi; print(f'FastAPI: {fastapi.__version__}')"
python -c "import psycopg2; print(f'psycopg2: {psycopg2.__version__}')"

echo Done!
```

## 5. 验证清单

完成依赖安装后，请验证以下项目：

### Go项目验证清单
- [ ] Go代理配置成功
- [ ] `go mod tidy` 无错误
- [ ] `go mod download` 无错误
- [ ] `go mod verify` 验证通过
- [ ] 项目编译成功
- [ ] 可执行文件可以运行

### Python项目验证清单
- [ ] 虚拟环境创建成功
- [ ] `pip install -e .` 无错误
- [ ] 所有依赖包安装成功
- [ ] `import` 测试无ImportError
- [ ] 项目可以正常启动
- [ ] 服务可以响应HTTP请求

## 6. 后续维护

### Go项目
定期更新依赖：
```bash
# 查看可更新的依赖
go list -u -m all

# 更新所有依赖
go get -u ./...
go mod tidy
```

### Python项目
定期更新依赖：
```bash
# 查看过期的包
pip list --outdated

# 更新所有包
pip install --upgrade -r requirements.txt
```

## 7. 联系支持

如果遇到本文档未涵盖的问题，请：
1. 查看项目README.md
2. 检查GitHub Issues
3. 联系项目维护团队
