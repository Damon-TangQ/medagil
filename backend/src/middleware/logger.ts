
/**
 * 请求日志中间件
 * 记录所有API请求和响应
 */

import { Request, Response, NextFunction } from 'express';
import LoggerService from '../services/LoggerService';
import PerformanceMonitor from '../services/PerformanceMonitor';

/**
 * 请求日志中间件
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // 监听响应完成事件
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const userId = (req as any).user?.id;

    // 记录到日志服务
    LoggerService.logRequest(
      req.method,
      req.path,
      statusCode,
      duration,
      userId,
      req.ip
    );

    // 记录性能指标
    PerformanceMonitor.recordHttpRequest(
      req.path,
      req.method,
      statusCode,
      duration
    );
  });

  next();
};

/**
 * 错误日志记录器
 */
export const errorLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 记录到日志服务
  LoggerService.logError(error, {
    path: req.path,
    method: req.method,
    userId: (req as any).user?.id,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  next(error);
};
