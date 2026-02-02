# Medagil AI Platform - Mock数据演示

## 快速开始

### 方法一：使用启动脚本（推荐）
双击运行 `run-mock-demo.bat` 脚本，这将自动启动所有服务：
- 后端服务 (端口: 5000)
- 前端应用 (端口: 3000)
- 管理后台 (端口: 3001)

### 方法二：手动启动
1. 启动后端服务：
   ```bash
   cd backend
   npm run dev
   ```

2. 启动前端应用：
   ```bash
   cd frontend
   npm run dev
   ```

3. 启动管理后台：
   ```bash
   cd admin
   npm run dev
   ```

4. 启动微信小程序：
   使用微信开发者工具打开 `miniprogram` 目录

## 访问地址

- **后端API**: http://localhost:5000
- **前端应用**: http://localhost:3000
- **管理后台**: http://localhost:3001

## 测试账号

### 普通用户
- 用户名: testuser
- 密码: password123

### 管理员
- 用户名: admin
- 密码: admin123

## Mock数据说明

本演示使用Mock数据，无需MySQL数据库。所有数据存储在内存中，重启服务后数据会丢失。

### 配置文件
- 后端配置: `backend/.env` (已设置 USE_MOCK=true)
- 前端配置: `frontend/.env`

## 详细测试指南

请查看 `MOCK_DEMO_GUIDE.md` 获取详细的测试指南。

## 注意事项

1. 本演示使用Mock数据，不要在生产环境使用
2. 测试完成后，记得关闭所有服务窗口
3. 如需切换到真实数据库，修改 `backend/.env` 文件，设置 `USE_MOCK=false`

## 技术支持

如遇到问题，请查看:
- 后端日志: backend/logs/
- 前端控制台: 浏览器开发者工具
- 小程序日志: 微信开发者工具控制台
