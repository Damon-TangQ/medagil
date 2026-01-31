
/**
 * 统一错误处理中间件
 * 提供标准化的错误处理和响应格式
 */

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/shared/types/common';

// 错误类型枚举
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  AUTH = 'AUTH_ERROR',
  PERMISSION = 'PERMISSION_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  BUSINESS = 'BUSINESS_ERROR',
  SYSTEM = 'SYSTEM_ERROR'
}

// 应用错误类
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// 验证错误类
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorType.VALIDATION, 400, message, details);
    this.name = 'ValidationError';
  }
}

// 认证错误类
export class AuthError extends AppError {
  constructor(message: string = '未授权，请重新登录') {
    super(ErrorType.AUTH, 401, message);
    this.name = 'AuthError';
  }
}

// 权限错误类
export class PermissionError extends AppError {
  constructor(message: string = '没有权限访问') {
    super(ErrorType.PERMISSION, 403, message);
    this.name = 'PermissionError';
  }
}

// 业务错误类
export class BusinessError extends AppError {
  constructor(message: string, statusCode: number = 400, details?: any) {
    super(ErrorType.BUSINESS, statusCode, message, details);
    this.name = 'BusinessError';
  }
}

// 系统错误类
export class SystemError extends AppError {
  constructor(message: string = '系统错误，请稍后重试', details?: any) {
    super(ErrorType.SYSTEM, 500, message, details);
    this.name = 'SystemError';
  }
}

/**
 * 错误处理中间件
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 记录错误日志
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // 如果是应用错误，使用自定义状态码和消息
  if (error instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      message: error.message,
      code: error.statusCode
    };

    // 开发环境返回详细信息
    if (process.env.NODE_ENV === 'development' && error.details) {
      (response as any).details = error.details;
    }

    res.status(error.statusCode).json(response);
    return;
  }

  // 处理其他类型的错误
  let statusCode = 500;
  let message = '服务器内部错误';

  // 根据错误类型设置响应
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = '请求参数错误';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = '未授权，请重新登录';
  } else if (error.name === 'SyntaxError' && (error as any).type === 'entity.parse.failed') {
    statusCode = 400;
    message = '请求格式错误';
  }

  const response: ApiResponse = {
    success: false,
    message,
    code: statusCode
  };

  // 开发环境返回错误堆栈
  if (process.env.NODE_ENV === 'development') {
    (response as any).stack = error.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 异步错误处理包装器
 * 用于捕获异步路由处理函数中的错误
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404处理中间件
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    message: '未找到请求的资源',
    code: 404
  };
  res.status(404).json(response);
};
