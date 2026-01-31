
/**
 * 错误处理中间件
 */

import { Request, Response, NextFunction } from 'express';

// 自定义错误类
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class BusinessError extends Error {
  constructor(message: string, public code: number = 400) {
    super(message);
    this.name = 'BusinessError';
  }
}

/**
 * 错误处理中间件
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // 认证错误
  if (error instanceof AuthError) {
    res.status(401).json({
      success: false,
      message: error.message,
      code: 401
    });
    return;
  }

  // 验证错误
  if (error instanceof ValidationError) {
    res.status(400).json({
      success: false,
      message: error.message,
      code: 400
    });
    return;
  }

  // 业务错误
  if (error instanceof BusinessError) {
    res.status(error.code).json({
      success: false,
      message: error.message,
      code: error.code
    });
    return;
  }

  // 系统错误
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    code: 500
  });
};

/**
 * 404处理中间件
 */
export const notFoundHandler = (
  req: Request,
  res: Response
): void => {
  res.status(404).json({
    success: false,
    message: '未找到请求的资源',
    code: 404
  });
};
