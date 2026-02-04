
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import LoggerService from './services/LoggerService';
import DatabaseService from './services/DatabaseService';
import { requestLogger, errorLogger } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const USE_MOCK = process.env.USE_MOCK === 'true';

// 初始化服务
async function initializeServices() {
  try {
    if (!USE_MOCK) {
      // 初始化数据库
      await DatabaseService.initialize();
      LoggerService.info('数据库初始化完成');
    } else {
      LoggerService.info('使用Mock数据模式，跳过数据库初始化');
    }
    LoggerService.info('所有服务初始化完成');
  } catch (error) {
    LoggerService.error('服务初始化失败', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : {
        message: 'Unknown error'
      }
    });
    process.exit(1);
  }
}

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use(requestLogger);

// API路由
app.use('/api', routes);

// 健康检查路由
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // 检查数据库连接（仅在非mock模式下）
    const isDbReady = USE_MOCK ? true : DatabaseService.isReady();
    const poolStatus = USE_MOCK ? { mode: 'mock' } : DatabaseService.getPoolStatus();

    res.status(200).json({
      status: 'ok',
      message: 'Medagil AI平台后端服务运行正常',
      mode: USE_MOCK ? 'mock' : 'database',
      database: isDbReady ? 'connected' : 'disconnected',
      poolStatus
    });
  } catch (error) {
    LoggerService.error('健康检查失败', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : {
        message: 'Unknown error'
      }
    });
    res.status(500).json({
      status: 'error',
      message: '健康检查失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API根路由
app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '欢迎使用Medagil AI平台API',
    version: '1.0.0',
    endpoints: {
      docs: '/api/docs',
      health: '/health'
    }
  });
});

// 404处理
app.use(notFoundHandler);

// 错误日志中间件
app.use(errorLogger);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
async function startServer() {
  await initializeServices();

  app.listen(PORT, () => {
    LoggerService.info(`Medagil AI平台后端服务已启动，运行在端口 ${PORT}`);
  });
}

// 优雅关闭
process.on('SIGTERM', async () => {
  LoggerService.info('收到SIGTERM信号，准备关闭服务器...');
  await DatabaseService.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  LoggerService.info('收到SIGINT信号，准备关闭服务器...');
  await DatabaseService.close();
  process.exit(0);
});

// 启动服务器
startServer().catch(error => {
  LoggerService.error('服务器启动失败', {
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : {
      message: 'Unknown error'
    }
  });
  process.exit(1);
});

export default app;
