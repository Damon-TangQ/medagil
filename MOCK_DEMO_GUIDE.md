# Medagil AI Platform - Mock数据演示指南

## 概述
本指南将帮助您使用Mock数据测试整个Medagil AI平台，包括Web前端、后端服务、管理后台和微信小程序。

## 前置条件
- Node.js (版本 >= 16.0.0)
- npm 或 yarn
- 微信开发者工具（用于测试小程序）

## 快速开始

### 1. 启动所有服务
双击运行 `run-mock-demo.bat` 脚本，这将启动以下服务：
- 后端服务 (端口: 5000)
- 前端应用 (端口: 3000)
- 管理后台 (端口: 5174)

### 2. 测试微信小程序
使用微信开发者工具打开 `miniprogram` 目录。

## 服务测试指南

### 后端服务测试

#### 1. 健康检查
访问: http://localhost:5000/health

预期响应:
```json
{
  "status": "ok",
  "message": "Medagil AI平台后端服务运行正常",
  "mode": "mock",
  "database": "connected",
  "poolStatus": {
    "mode": "mock"
  }
}
```

#### 2. API根路由
访问: http://localhost:5000/api

预期响应:
```json
{
  "success": true,
  "message": "欢迎使用Medagil AI平台API",
  "version": "1.0.0",
  "endpoints": {
    "docs": "/api/docs",
    "health": "/health"
  }
}
```

#### 3. 用户认证测试

##### 用户注册
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com"
  }'
```

##### 用户登录
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

#### 4. 项目管理测试

##### 获取项目列表
```bash
curl http://localhost:5000/api/projects
```

##### 创建项目
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "测试项目",
    "description": "这是一个测试项目",
    "categoryId": "1"
  }'
```

### 前端应用测试

访问: http://localhost:3000

#### 测试步骤:
1. **登录页面**
   - 使用测试账号登录:
     - 用户名: testuser
     - 密码: password123
   - 或使用微信登录（模拟）

2. **首页**
   - 查看项目列表
   - 测试项目搜索和筛选功能

3. **创建项目**
   - 点击"创建项目"按钮
   - 填写项目信息
   - 提交并验证项目创建成功

4. **项目详情**
   - 点击项目卡片查看详情
   - 测试编辑和删除功能

5. **任务管理**
   - 创建新任务
   - 与AI进行对话
   - 查看任务结果

6. **个人中心**
   - 查看个人信息
   - 修改个人资料
   - 查看订阅信息

### 管理后台测试

访问: http://localhost:3001

#### 测试步骤:
1. **登录管理后台**
   - 使用管理员账号登录:
     - 用户名: admin
     - 密码: admin123

2. **用户管理**
   - 查看用户列表
   - 搜索用户
   - 编辑用户信息
   - 禁用/启用用户

3. **项目管理**
   - 查看所有项目
   - 审核项目
   - 管理项目分类

4. **订阅管理**
   - 查看订阅套餐
   - 创建新套餐
   - 修改套餐价格和功能

5. **数据统计**
   - 查看用户增长统计
   - 查看项目使用统计
   - 查看收入统计

### 微信小程序测试

#### 测试步骤:
1. **打开小程序**
   - 使用微信开发者工具打开 `miniprogram` 目录
   - 点击"编译"按钮

2. **首页测试**
   - 查看项目列表
   - 测试下拉刷新
   - 测试项目搜索

3. **项目详情**
   - 点击项目查看详情
   - 查看项目任务
   - 测试点赞功能

4. **个人中心**
   - 查看个人信息
   - 查看我的项目
   - 测试设置功能

5. **AI对话**
   - 创建新对话
   - 发送消息
   - 查看AI回复

## Mock数据说明

### 用户数据
系统预置了以下测试用户:
- 普通用户:
  - 用户名: testuser
  - 密码: password123
  - 邮箱: test@example.com

- 管理员:
  - 用户名: admin
  - 密码: admin123
  - 邮箱: admin@example.com

### 项目数据
系统预置了多个测试项目，包括:
- AI智能对话助手
- 销售数据分析
- 智能客服系统
- 临床论文分析
- 文献分析助手

### 订阅数据
系统预置了订阅套餐:
- 基础套餐: ¥9.90/月
- 高级套餐: ¥29.90/月

## 常见问题

### Q: 如何重置Mock数据？
A: 重启后端服务即可重置所有Mock数据。

### Q: 如何切换到真实数据库？
A: 修改 `backend/.env` 文件，设置 `USE_MOCK=false`，然后重启后端服务。

### Q: 前端页面显示错误？
A: 清除浏览器缓存并刷新页面，或使用隐私模式访问。

### Q: 小程序无法启动？
A: 确保已安装微信开发者工具，并检查 `miniprogram/project.config.json` 配置是否正确。

## 技术支持

如遇到问题，请查看:
- 后端日志: backend/logs/
- 前端控制台: 浏览器开发者工具
- 小程序日志: 微信开发者工具控制台

## 注意事项

1. 本演示使用Mock数据，所有数据存储在内存中，重启服务后数据会丢失
2. 不要在生产环境使用Mock模式
3. 测试完成后，记得关闭所有服务窗口
