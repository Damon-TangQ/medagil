# Medagil AI平台后端开发指南

## 技术栈

- Node.js
- Express
- TypeScript
- MongoDB (使用Mongoose)
- JWT (身份验证)
- bcryptjs (密码加密)

## 项目结构

```
backend/
├── src/
│   ├── config/        # 配置文件
│   ├── controllers/   # 控制器
│   ├── middlewares/   # 中间件
│   ├── models/        # 数据模型
│   ├── routes/        # 路由
│   ├── services/      # 业务逻辑
│   ├── utils/         # 工具函数
│   ├── types/         # TypeScript类型定义
│   └── index.ts       # 入口文件
├── .env.example       # 环境变量示例
├── package.json       # 项目配置
└── tsconfig.json      # TypeScript配置
```

## 开发指南

### 安装依赖

```bash
cd backend
npm install
```

### 配置环境变量

复制`.env.example`文件为`.env`，并填写相应的配置值。

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## API设计规范

### RESTful API

使用RESTful风格设计API接口：

- GET: 获取资源
- POST: 创建资源
- PUT: 更新资源
- DELETE: 删除资源

### 响应格式

统一使用以下JSON格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

## 数据模型

使用Mongoose定义数据模型，模型文件放在`src/models`目录下。

## 中间件

自定义中间件放在`src/middlewares`目录下，用于处理请求和响应。

## 身份验证

使用JWT进行身份验证，token存储在请求头的Authorization字段中。

## 错误处理

统一的错误处理中间件，捕获所有错误并返回标准化的错误响应。
