import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from '../database/connection';
import routes from './routes';

// 加载环境变量
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API路由
app.use('/api', routes);

// 健康检查路由
app.get('/health', async (req: Request, res: Response) => {
  try {
    // 检查数据库连接
    await pool.getConnection();
    res.status(200).json({ 
      status: 'ok', 
      message: 'Medagil AI平台后端服务运行正常',
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: '数据库连接失败',
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
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: '未找到请求的资源' });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Medagil AI平台后端服务已启动，运行在端口 ${PORT}`);
});

export default app;
