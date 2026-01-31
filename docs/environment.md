# 环境变量配置文档

## 概述

本文档说明了 Medagil AI 平台各模块的环境变量配置，包括前端、后端、管理端和小程序的配置说明。

## 目录结构

```
medagil-platform/
├── frontend/
│   └── .env.example          # 前端环境变量示例
├── backend/
│   └── .env.example          # 后端环境变量示例
├── admin/
│   └── .env.example          # 管理端环境变量示例
├── miniprogram/
│   ├── config.js             # 小程序配置文件
│   └── project.config.example.json  # 小程序项目配置示例
└── shared/
    └── constants/
        └── index.ts          # 共享常量配置
```

## 前端环境变量

### 配置文件位置
- 示例文件：`frontend/.env.example`
- 实际文件：`frontend/.env` 或 `frontend/.env.local`

### 主要配置项

#### 应用配置
```bash
VITE_APP_TITLE=Medagil AI平台      # 应用标题
VITE_APP_VERSION=1.0.0             # 应用版本
NODE_ENV=development                # 应用环境
```

#### API配置
```bash
VITE_API_BASE_URL=http://localhost:5000/api  # API基础URL
VITE_API_TIMEOUT=30000                      # API超时时间(毫秒)
VITE_API_RETRY_TIMES=3                       # API重试次数
```

#### 功能开关
```bash
VITE_ENABLE_MOCK=true    # 是否启用Mock数据
VITE_DEBUG=true          # 是否启用调试模式
```

#### 上传配置
```bash
VITE_UPLOAD_MAX_SIZE=5    # 上传文件大小限制(MB)
VITE_UPLOAD_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### 使用方式

```typescript
// 在代码中使用环境变量
const apiUrl = import.meta.env.VITE_API_BASE_URL
const isDebug = import.meta.env.VITE_DEBUG === 'true'
```

## 后端环境变量

### 配置文件位置
- 示例文件：`backend/.env.example`
- 实际文件：`backend/.env`

### 主要配置项

#### 应用配置
```bash
APP_NAME=Medagil AI平台后端服务
APP_VERSION=1.0.0
NODE_ENV=development
PORT=5000
```

#### 数据库配置
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=medagil_platform
DB_USER=root
DB_PASSWORD=your_password
```

#### JWT配置
```bash
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

#### 文件上传配置
```bash
UPLOAD_PATH=./uploads
UPLOAD_MAX_SIZE=10
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif
```

### 使用方式

```typescript
// 在代码中使用环境变量
const port = process.env.PORT || 5000
const jwtSecret = process.env.JWT_SECRET
```

## 管理端环境变量

### 配置文件位置
- 示例文件：`admin/.env.example`
- 实际文件：`admin/.env` 或 `admin/.env.local`

### 主要配置项

#### 应用配置
```bash
VITE_APP_TITLE=Medagil AI管理后台
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

#### API配置
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000
```

#### 权限配置
```bash
VITE_ENABLE_PERMISSION=true
VITE_DEFAULT_PERMISSIONS=dashboard,user,project,task,subscription
```

#### 表格配置
```bash
VITE_TABLE_PAGE_SIZE=10
VITE_TABLE_PAGE_SIZES=10,20,50,100
```

## 小程序配置

### 配置文件位置
- 配置文件：`miniprogram/config.js`
- 项目配置：`miniprogram/project.config.example.json`

### 主要配置项

#### API配置
```javascript
const API_CONFIG = {
  development: {
    baseUrl: 'http://localhost:5000/api',
    timeout: 30000
  },
  production: {
    baseUrl: 'https://api.medagil.com/api',
    timeout: 30000
  }
}
```

#### 应用配置
```javascript
const APP_CONFIG = {
  appName: 'Medagil AI',
  version: '1.0.0',
  pageSize: 10,
  maxPageSize: 50
}
```

### 使用方式

```javascript
// 在代码中使用配置
const config = require('../../config.js')
const apiUrl = config.ENV_CONFIG.getConfig().baseUrl
```

## 共享常量配置

### 配置文件位置
- 配置文件：`shared/constants/index.ts`

### 主要配置项

#### 应用配置
```typescript
export const APP_CONFIG = {
  APP_NAME: 'Medagil AI平台',
  APP_VERSION: '1.0.0',
  API_VERSION: 'v1',
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100
}
```

#### 订阅等级
```typescript
export const SUBSCRIPTION_LEVEL = {
  FREE: 0,
  BASIC: 1,
  PREMIUM: 2
}
```

#### 项目状态
```typescript
export const PROJECT_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1
}
```

## 环境变量最佳实践

### 1. 安全性
- 不要将 `.env` 文件提交到版本控制
- 使用 `.env.example` 作为模板
- 生产环境使用强密钥和密码
- 敏感信息使用环境变量，不要硬编码

### 2. 环境区分
- 开发环境：`development`
- 测试环境：`test`
- 生产环境：`production`

### 3. 配置优先级
- `.env.local` (最高优先级)
- `.env`
- `.env.example` (最低优先级)

### 4. 类型安全
- TypeScript 项目应定义环境变量类型
- 使用类型检查避免拼写错误

## 配置验证

### 前端配置验证
```typescript
// frontend/src/config/env.ts
const requiredEnvVars = ['VITE_API_BASE_URL']
requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})
```

### 后端配置验证
```typescript
// backend/src/config/env.ts
const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'JWT_SECRET']
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})
```

## 常见问题

### Q1: 如何切换开发/生产环境？
**A:** 修改 `NODE_ENV` 环境变量的值：
- 开发环境：`development`
- 生产环境：`production`

### Q2: 如何添加新的环境变量？
**A:** 
1. 在对应的 `.env.example` 文件中添加配置项
2. 在实际使用的 `.env` 文件中设置值
3. 在代码中通过 `import.meta.env` (前端) 或 `process.env` (后端) 访问

### Q3: 如何处理敏感信息？
**A:**
1. 使用环境变量存储敏感信息
2. 不要将 `.env` 文件提交到版本控制
3. 使用 `.gitignore` 排除 `.env` 文件
4. 生产环境使用密钥管理服务

### Q4: 如何在 Docker 中使用环境变量？
**A:** 在 `docker-compose.yml` 中配置：
```yaml
services:
  backend:
    environment:
      - DB_HOST=${DB_HOST}
      - DB_NAME=${DB_NAME}
      - DB_PASSWORD=${DB_PASSWORD}
```

## 更新日志

### v1.0.0 (2023-09-15)
- 初始化环境变量配置
- 添加前端、后端、管理端配置示例
- 添加小程序配置
- 添加共享常量配置
- 完善配置文档
