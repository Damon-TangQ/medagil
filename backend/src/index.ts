import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import DatabaseService from './services/DatabaseService';
import LoggerService from './services/LoggerService';

// 加载环境变量
dotenv.config();

// 初始化数据库
DatabaseService.initialize().catch(error => {
  LoggerService.error('数据库初始化失败', {
    error: error instanceof Error ? error.message : 'Unknown error'
  });
  process.exit(1);
});

const app: Application = express();
const PORT = process.env.PORT || 5000;

// 通用速率限制配置
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP最多100个请求
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 登录接口严格速率限制
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 每个IP最多5次登录尝试
  message: {
    success: false,
    message: '登录尝试次数过多，请15分钟后再试'
  },
  skipSuccessfulRequests: true
});

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use(requestLogger);

// 应用速率限制
app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/phone', authLimiter);

// API路由
app.use('/api', routes);

// 健康检查路由
app.get('/health', async (req: Request, res: Response) => {
  try {
    // 检查服务状态
    res.status(200).json({
      status: 'ok',
      message: 'Medagil AI平台后端服务运行正常',
      database: 'mock' // 使用模拟数据
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '服务错误',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API路由
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    message: '欢迎使用Medagil AI平台API',
    version: '1.0.0'
  });
});

// 404处理
app.use(notFoundHandler);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const server = app.listen(PORT, () => {
  LoggerService.info(`Medagil AI平台后端服务已启动，运行在端口 ${PORT}`);
});

// 优雅关闭
process.on('SIGTERM', async () => {
  LoggerService.info('收到SIGTERM信号，开始关闭服务...');
  server.close(async () => {
    await DatabaseService.close();
    LoggerService.info('服务已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  LoggerService.info('收到SIGINT信号，开始关闭服务...');
  server.close(async () => {
    await DatabaseService.close();
    LoggerService.info('服务已关闭');
    process.exit(0);
  });
});

export default app;
