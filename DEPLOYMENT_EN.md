好的，已根据您的要求，将这份英文技术文档翻译并优化为一份清晰、可理解、可执行的中文部署指南。翻译过程中，我遵循了技术文档的准确性、清晰性和可操作性原则，并对格式进行了优化，使其更符合中文技术文档的阅读习惯。

---

# Medagil AI 平台 - 部署指南

本文档详细介绍了 Medagil AI 平台的部署步骤，包括环境设置、数据库配置、后端服务部署、前端应用部署、管理后台部署以及小程序配置。

## 目录
1.  #环境准备
2.  #数据库设置
3.  #后端服务部署
4.  #前端应用部署
5.  #管理后台部署
6.  #小程序配置
7.  #常见问题

## 环境准备

### 必需软件
1.  **Node.js** (版本 >= 16.0.0)
    *   下载链接：https://nodejs.org/ （*注：根据您提供的链接内容，此链接访问失败，请确认网络或链接有效性*）
    *   验证安装：在终端执行 `node -v` 和 `npm -v`
2.  **MySQL** (版本 >= 8.0)
    *   下载链接：https://dev.mysql.com/downloads/mysql/
    *   验证安装：在终端执行 `mysql --version`
3.  **Git** (可选，用于版本控制)
    *   下载链接：https://git-scm.com/downloads

### 可选软件
1.  **微信开发者工具** (用于小程序开发)
    *   下载链接：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

## 数据库设置

### 1. 安装 MySQL
根据您的操作系统下载并安装 MySQL：
*   **Windows**：下载 MySQL Installer 并按照向导安装。
*   **macOS**：使用 Homebrew 安装：`brew install mysql`
*   **Linux**：使用包管理器安装，例如 Ubuntu：`sudo apt-get install mysql-server`

### 2. 启动 MySQL 服务
*   **Windows**：在"服务"管理器中启动 MySQL 服务。
*   **macOS**：`brew services start mysql`
*   **Linux**：`sudo systemctl start mysql`

### 3. 创建数据库和用户
```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE medagil_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 创建用户并授权（可选）
CREATE USER 'medagil_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON medagil_platform.* TO 'medagil_user'@'localhost';
FLUSH PRIVILEGES;

# 退出 MySQL
EXIT;
```

### 4. 配置数据库连接
编辑 `backend/.env` 文件，根据您的 MySQL 配置更新以下内容：
```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=medagil_platform
DB_USER=root
DB_PASSWORD=your_mysql_password # 请更改为您的 MySQL 密码
```

## 后端服务部署

### 1. 安装依赖
```bash
cd backend
npm install
```

### 2. 配置环境变量
确保 `backend/.env` 文件存在并包含以下配置：
```bash
# 应用配置
APP_NAME=Medagil AI Platform Backend
APP_VERSION=1.0.0
NODE_ENV=development
PORT=5000

# 数据库配置（需与上述数据库配置一致）
DB_HOST=localhost
DB_PORT=3306
DB_NAME=medagil_platform
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT 配置
JWT_SECRET=your_jwt_secret_key_change_this_in_production # 生产环境请务必更改
JWT_EXPIRE=7d

# 文件上传配置
UPLOAD_DIR=uploads
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf

# 日志配置
LOG_LEVEL=debug
LOG_DIR=logs
```

### 3. 初始化数据库（可选）
```bash
# 运行数据库初始化脚本
npm run db:init

# 运行数据库迁移（如果需要）
npm run db:migrate
```

### 4. 编译 TypeScript 代码
```bash
npm run build
```

### 5. 启动后端服务
**开发模式：**
```bash
npm run dev
```
**生产模式：**
```bash
npm start
```
后端服务将运行在 http://localhost:5000。

## 前端应用部署

### 1. 安装依赖
```bash
cd frontend
npm install
```

### 2. 配置环境变量
创建或编辑 `frontend/.env` 文件：
```bash
# 应用配置
VITE_APP_TITLE=Medagil AI Platform
VITE_APP_VERSION=1.0.0
NODE_ENV=development

# API 配置（确保与后端服务地址一致）
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000
VITE_API_RETRY_TIMES=3

# 功能开关
VITE_ENABLE_MOCK=false
VITE_DEBUG=true

# 上传配置
VITE_UPLOAD_MAX_SIZE=5
VITE_UPLOAD_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### 3. 启动开发服务器
```bash
npm run dev
```
前端应用将运行在 http://localhost:3000。

### 4. 构建生产版本（可选）
```bash
npm run build
```
构建后的文件将输出到 `dist` 目录。

## 管理后台部署

### 1. 安装依赖
```bash
cd admin
npm install
```

### 2. 配置环境变量
创建或编辑 `admin/.env` 文件：
```bash
# 应用配置
VITE_APP_TITLE=Medagil AI Platform Admin
VITE_APP_VERSION=1.0.0
NODE_ENV=development

# API 配置
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# 功能开关
VITE_ENABLE_MOCK=false
VITE_DEBUG=true
```

### 3. 启动开发服务器
```bash
npm run dev
```
管理后台将运行在 http://localhost:5174。

### 4. 构建生产版本（可选）
```bash
npm run build
```
构建后的文件将输出到 `dist` 目录。

## 小程序配置

### 1. 安装微信开发者工具
下载并安装微信开发者工具。

### 2. 配置小程序
1.  使用微信开发者工具打开 `miniprogram` 目录。
2.  从微信小程序后台获取 AppID。
3.  编辑 `miniprogram/project.config.json` 配置 AppID：
    ```json
    {
      "appid": "your_appid_here",
      "projectname": "Medagil Mini Program",
      "description": "Medagil AI Platform Mini Program",
      ...
    }
    ```
4.  编辑 `miniprogram/config.js` 配置 API 地址：
    ```javascript
    module.exports = {
      apiBaseUrl: 'http://localhost:5000/api', // 配置您的后端 API 地址
      // 其他配置...
    }
    ```

### 3. 编译与运行
点击微信开发者工具中的"编译"按钮，预览小程序。

## 常见问题

### 1. 数据库连接失败
**问题**：后端服务启动失败，报数据库连接错误。
**解决方案**：
*   确保 MySQL 服务正在运行。
*   检查 `backend/.env` 中的数据库配置。
*   确认数据库 `medagil_platform` 已创建。
*   检查数据库用户权限。

### 2. 端口被占用
**问题**：服务启动失败，报端口已被占用。
**解决方案**：
*   查找占用端口的进程：
    *   Windows: `netstat -ano | findstr :端口号`
    *   macOS/Linux: `lsof -i :端口号`
*   终止该进程或修改配置文件中的端口号。

### 3. 依赖安装失败
**问题**：执行 `npm install` 时出错。
**解决方案**：
*   清除 npm 缓存：`npm cache clean --force`
*   删除 `node_modules` 目录和 `package-lock.json` 文件。
*   重新运行 `npm install`。
*   如果在中国大陆，可考虑使用淘宝镜像：`npm config set registry https://registry.npmmirror.com`

### 4. TypeScript 编译错误
**问题**：编译时出现 TypeScript 类型错误。
**解决方案**：
*   确保所有依赖已安装：`npm install`
*   检查 TypeScript 版本是否满足项目要求。
*   根据错误信息修复类型问题。

### 5. CORS 错误
**问题**：前端调用 API 失败，报 CORS 错误。
**解决方案**：
*   确保后端已配置 CORS 中间件。
*   检查前端配置的 API 地址是否正确。
*   开发环境下，可使用 Vite 配置的代理。

## 生产环境部署建议

### 1. 后端服务
*   使用 PM2 进行进程管理：`npm install -g pm2`
*   配置 PM2 启动脚本。
*   设置环境变量 `NODE_ENV=production`。
*   使用反向代理（如 Nginx）处理静态文件和负载均衡。

### 2. 前端应用
*   构建生产版本：`npm run build`。
*   将构建产物部署至 CDN 或静态文件服务器。
*   配置 Nginx 进行路由。

### 3. 数据库
*   定期进行数据库备份。
*   配置数据库复制以实现高可用。
*   优化数据库查询和索引。

### 4. 安全性
*   使用 HTTPS。
*   配置防火墙规则。
*   定期更新依赖。
*   使用环境变量管理敏感信息。

## 技术支持
如果您有任何问题或需要帮助，请联系项目维护者或查阅项目文档。

---

希望这份中文文档能帮助您顺利完成部署。请注意，文档中提到的 `your_mysql_password`, `your_jwt_secret_key` 等占位符，在实际部署时需要替换为您自己的安全值。