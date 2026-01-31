
# Medagil平台功能实现指南

本文档说明了新实现的功能及其使用方法。

## 目录

1. [验证码服务](#验证码服务)
2. [性能监控](#性能监控)
3. [日志持久化](#日志持久化)
4. [数据库连接](#数据库连接)
5. [API文档](#api文档)

---

## 验证码服务

### 功能说明

验证码服务（VerificationCodeService）提供了完整的验证码生成、发送和验证功能，支持手机号和邮箱验证码。

### 主要特性

- 生成6位数字验证码
- 验证码有效期5分钟
- 防止频繁发送（60秒间隔）
- 自动清理过期验证码
- 内存存储（可扩展为Redis）

### 使用方法

#### 发送验证码

```typescript
import VerificationCodeService from '../services/VerificationCodeService';

// 发送手机验证码
const result = await VerificationCodeService.sendCode('13800138000', 'phone');
console.log(result.message); // "验证码已发送"
```

#### 验证验证码

```typescript
// 验证手机验证码
const result = await VerificationCodeService.verifyCode('13800138000', 'phone', '123456');
if (result.success) {
  console.log('验证成功');
} else {
  console.log(result.message); // "验证码无效或已过期"
}
```

#### API端点

- `POST /api/auth/send-code` - 发送手机验证码
  ```json
  {
    "phone": "13800138000"
  }
  ```

- `POST /api/auth/phone` - 手机号登录（带验证码）
  ```json
  {
    "phone": "13800138000",
    "password": "your_password",
    "code": "123456"
  }
  ```

### 生产环境配置

在生产环境中，需要实现实际的短信/邮件发送功能：

1. 编辑 `VerificationCodeService.ts`
2. 在 `sendCode` 方法中替换 TODO 部分
3. 集成短信服务（如阿里云、腾讯云）或邮件服务

---

## 性能监控

### 功能说明

性能监控服务（PerformanceMonitor）用于收集和分析系统性能指标，帮助识别性能瓶颈。

### 监控指标

- HTTP请求性能（按路径、方法、状态码）
- 数据库查询性能（按操作、表）
- 外部API调用性能（按服务、端点）

### 使用方法

#### 记录自定义指标

```typescript
import PerformanceMonitor from '../services/PerformanceMonitor';

// 记录自定义性能指标
PerformanceMonitor.record('custom.metric', 123, {
  tag1: 'value1',
  tag2: 'value2'
});
```

#### 获取性能统计

```typescript
// 获取特定指标的统计信息
const stats = PerformanceMonitor.getStats('http.request.get./api/projects');

console.log(stats);
// {
//   count: 100,
//   min: 10,
//   max: 500,
//   avg: 120,
//   p95: 200,
//   p99: 300
// }
```

#### 获取性能报告

```typescript
// 获取所有指标的统计报告
const report = PerformanceMonitor.getReport();
console.log(report);
```

### 配置

在 `.env` 文件中配置：

```bash
ENABLE_PERFORMANCE_MONITOR=true
```

---

## 日志持久化

### 功能说明

日志服务（LoggerService）提供完整的日志管理功能，支持文件持久化和日志轮转。

### 日志级别

- DEBUG: 调试信息
- INFO: 一般信息
- WARN: 警告信息
- ERROR: 错误信息

### 使用方法

#### 记录日志

```typescript
import LoggerService from '../services/LoggerService';

// 记录不同级别的日志
LoggerService.debug('调试信息', { context: 'value' });
LoggerService.info('一般信息');
LoggerService.warn('警告信息');
LoggerService.error('错误信息');

// 记录HTTP请求
LoggerService.logRequest('GET', '/api/projects', 200, 123, 'user123', '127.0.0.1');

// 记录错误
LoggerService.logError(new Error('Something went wrong'), {
  path: '/api/projects',
  method: 'GET'
});
```

### 日志文件

日志文件存储在 `logs` 目录下：

- `debug.log` - 调试日志
- `info.log` - 信息日志
- `warn.log` - 警告日志
- `error.log` - 错误日志

### 配置

在 `.env` 文件中配置：

```bash
ENABLE_FILE_LOG=true
LOG_LEVEL=info
```

### 日志轮转

当日志文件超过10MB时自动轮转，保留最近7天的日志。

---

## 数据库连接

### 功能说明

数据库服务（DatabaseService）提供MySQL数据库连接池和操作接口。

### 主要功能

- 连接池管理
- 自动重连
- 事务支持
- 连接状态监控
- 自动表初始化

### 使用方法

#### 执行查询

```typescript
import DatabaseService from '../services/DatabaseService';

// 简单查询
const users = await DatabaseService.query(
  'SELECT * FROM users WHERE status = ?',
  [1]
);

// 带参数的查询
const project = await DatabaseService.query(
  'SELECT * FROM projects WHERE id = ? AND user_id = ?',
  [projectId, userId]
);
```

#### 执行事务

```typescript
// 执行事务
const result = await DatabaseService.executeTransaction(async (connection) => {
  // 在事务中执行多个操作
  await connection.execute('UPDATE users SET points = points - ? WHERE id = ?', [points, userId]);
  await connection.execute('INSERT INTO orders (...) VALUES (...)', [orderData]);

  return { success: true };
});
```

### 配置

在 `.env` 文件中配置：

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medagil
```

### 表结构

服务会自动创建以下表：

- users - 用户表
- projects - 项目表
- tasks - 任务表
- subscriptions - 订阅记录表

### 监控

```typescript
// 检查连接状态
if (DatabaseService.isReady()) {
  console.log('数据库已连接');
}

// 获取连接池状态
const status = DatabaseService.getPoolStatus();
console.log(status);
// {
//   totalConnections: 10,
//   activeConnections: 3,
//   idleConnections: 7
// }
```

---

## API文档

### 功能说明

API文档服务（ApiDocsService）自动生成OpenAPI规范的API文档。

### 访问文档

启动服务后，可以通过以下URL访问文档：

- Swagger UI: `http://localhost:5000/api/docs`
- OpenAPI JSON: `http://localhost:5000/api/docs/openapi.json`
- Markdown文档: `http://localhost:5000/api/docs/markdown`

### 文档特性

- 交互式API测试
- 完整的请求/响应示例
- 认证说明
- 参数详细说明
- 响应状态码说明

### 注册API端点

```typescript
import ApiDocsService from '../services/ApiDocsService';

// 注册API端点
ApiDocsService.register({
  path: '/api/projects',
  method: 'POST',
  description: '创建新项目',
  tags: ['项目'],
  auth: true,
  parameters: [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: '项目名称',
      example: '我的项目'
    }
  ],
  responses: [
    {
      code: 200,
      description: '创建成功'
    },
    {
      code: 400,
      description: '参数错误'
    }
  ]
});
```

### 配置

在 `.env` 文件中配置：

```bash
API_BASE_URL=http://localhost:5000
```

---

## 部署建议

### 开发环境

1. 使用Mock数据（当前默认）
2. 启用文件日志
3. 启用性能监控
4. 使用内存存储验证码

### 生产环境

1. 使用真实数据库
2. 使用Redis存储验证码
3. 配置日志服务（如ELK、Splunk）
4. 配置性能监控（如Prometheus、Grafana）
5. 使用HTTPS
6. 配置CORS白名单
7. 实现实际的短信/邮件发送
8. 配置速率限制
9. 启用请求日志
10. 配置健康检查端点

---

## 监控和维护

### 健康检查

访问 `/health` 端点检查服务状态：

```bash
curl http://localhost:5000/health
```

响应示例：

```json
{
  "status": "ok",
  "message": "Medagil AI平台后端服务运行正常",
  "database": "connected"
}
```

### 日志查看

```bash
# 查看错误日志
tail -f logs/error.log

# 查看所有日志
tail -f logs/*.log
```

### 性能分析

```bash
# 获取性能报告
curl http://localhost:5000/api/performance/report
```

---

## 故障排查

### 数据库连接失败

1. 检查 `.env` 配置
2. 确认MySQL服务运行
3. 检查防火墙设置
4. 查看错误日志

### 验证码发送失败

1. 检查短信/邮件服务配置
2. 确认账户余额充足
3. 查看API密钥是否正确
4. 检查网络连接

### 性能问题

1. 查看性能报告
2. 检查慢查询日志
3. 分析数据库连接池状态
4. 检查服务器资源使用情况

---

## 更多信息

- [API文档](./api.md)
- [数据库文档](./database.md)
- [环境变量配置](./environment.md)
