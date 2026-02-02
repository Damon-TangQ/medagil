
/**
 * 日志中间件
 */

import { Request, Response, NextFunction } from 'express';
import LoggerService from '../services/LoggerService';
import PerformanceMonitor from '../services/PerformanceMonitor';

// 扩展Request接口以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        subscriptionLevel: number;
      };
    }
  }
}

/**
 * HTTP请求日志中间件
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // 记录请求开始
  LoggerService.debug('Request started', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // 监听响应完成
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // 记录请求日志
    LoggerService.logRequest(
      req.method,
      req.path,
      res.statusCode,
      duration,
      req.user?.id,
      req.ip
    );

    // 记录性能指标
    PerformanceMonitor.recordHttpRequest(
      req.path,
      req.method,
      res.statusCode,
      duration
    );
  });

  next();
};

/**
 * 错误日志中间件
 */
export const errorLogger = (
  error: Error,
  req: Request,
  _res: Response,
  _next: NextFunction
): void => {
  LoggerService.logError(error, {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    userId: req.user?.id,
    ip: req.ip
  });

  _next(error);
};
