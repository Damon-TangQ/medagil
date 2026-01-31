
# Medagil平台快速启动指南

本文档提供了快速启动和部署Medagil平台的指南。

## 目录

1. [环境要求](#环境要求)
2. [快速启动](#快速启动)
3. [服务管理](#服务管理)
4. [Git操作](#git操作)
5. [常见问题](#常见问题)

---

## 环境要求

### 必需软件

- **Node.js**: >= 16.x
- **npm**: >= 8.x
- **Git**: >= 2.x

### 可选软件

- **MySQL**: >= 5.7（用于生产环境）
- **Redis**: >= 6.x（用于生产环境）

### 检查环境

打开命令提示符或PowerShell，运行：

```bash
# 检查Node.js版本
node --version

# 检查npm版本
npm --version

# 检查Git版本
git --version
```

---

## 快速启动

### 方法一：使用启动脚本（推荐）

1. 双击运行 `start-services.bat`
2. 选择要启动的服务：
   - 选项1：启动所有服务
   - 选项2：仅启动后端
   - 选项3：仅启动前端
   - 选项4：启动所有服务并打开浏览器
3. 等待服务启动完成

### 方法二：手动启动

#### 启动后端服务

```bash
cd backend
npm install
npm run dev
```

后端服务将在 `http://localhost:5000` 启动

#### 启动前端服务

```bash
cd frontend
npm install
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

### 访问应用

服务启动后，可以通过以下URL访问：

- **前端应用**: http://localhost:5173
- **后端API**: http://localhost:5000
- **API文档**: http://localhost:5000/api/docs

---

## 服务管理

### 启动服务

使用 `start-services.bat` 脚本：

```bash
# Windows
start-services.bat
```

### 停止服务

使用 `stop-services.bat` 脚本：

```bash
# Windows
stop-services.bat
```

### 手动停止

如果需要手动停止服务：

1. 找到运行中的服务窗口
2. 关闭对应窗口
3. 或使用任务管理器结束node.exe进程

---

## Git操作

### 初始化Git仓库

```bash
git init
git add .
git commit -m "初始化项目"
```

### 添加远程仓库

```bash
git remote add origin <your-repository-url>
```

### 提交更改

使用 `git-push.bat` 脚本：

```bash
# Windows
git-push.bat
```

或手动执行：

```bash
git add .
git commit -m "提交信息"
git push
```

### 查看状态

```bash
git status
```

### 拉取最新代码

```bash
git pull
```

---

## 常见问题

### Q: 端口已被占用

**A**: 修改端口配置

1. 后端端口：编辑 `backend/.env` 中的 `PORT`
2. 前端端口：编辑 `frontend/.env` 中的 `VITE_PORT`

### Q: npm install 失败

**A**: 尝试以下解决方案

1. 清除npm缓存
   ```bash
   npm cache clean --force
   ```

2. 删除node_modules和package-lock.json
   ```bash
   rm -rf node_modules package-lock.json
   ```

3. 使用淘宝镜像
   ```bash
   npm config set registry https://registry.npmmirror.com
   ```

### Q: 数据库连接失败

**A**: 检查以下配置

1. MySQL服务是否运行
2. `backend/.env` 中的数据库配置是否正确
3. 防火墙是否允许连接
4. 数据库用户权限是否足够

### Q: 验证码发送失败

**A**: 检查以下配置

1. 短信/邮件服务配置是否正确
2. API密钥是否有效
3. 账户余额是否充足
4. 网络连接是否正常

### Q: 前端无法连接后端

**A**: 检查以下配置

1. 后端服务是否正常运行
2. 前端API地址配置是否正确
3. CORS配置是否允许前端域名
4. 防火墙是否阻止连接

---

## 开发建议

### 代码编辑器

推荐使用以下编辑器：

- **VS Code**: [下载链接](https://code.visualstudio.com/)
  - 推荐插件：
    - ESLint
    - Prettier
    - GitLens
    - Vue - Official
    - TypeScript Vue Plugin (Volar)

### 浏览器

推荐使用以下浏览器进行开发：

- Chrome
- Firefox
- Edge

### 调试工具

- Chrome DevTools
- Vue DevTools
- Redux DevTools（如使用状态管理）

---

## 更多信息

- [实现指南](./implementation-guide.md)
- [API文档](./api.md)
- [数据库文档](./database.md)
- [环境变量配置](./environment.md)

---

## 技术支持

如遇到问题，请：

1. 查看本文档的常见问题部分
2. 查看日志文件（`backend/logs/`）
3. 检查服务控制台输出
4. 联系技术支持团队
