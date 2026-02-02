
/**
 * 认证和授权中间件
 */

import { Request, Response, NextFunction } from 'express';
import MockUserService from '../services/MockUserService';

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
 * 认证中间件 - 验证JWT令牌
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: '缺少认证令牌',
        code: 401
      });
      return;
    }

    const payload = MockUserService.verifyToken(token);
    if (!payload) {
      res.status(401).json({
        success: false,
        message: '认证令牌无效或已过期',
        code: 401
      });
      return;
    }

    req.user = {
      id: payload.userId,
      username: payload.username,
      subscriptionLevel: payload.subscriptionLevel
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: '认证失败',
      code: 401
    });
  }
};

/**
 * 可选认证中间件 - 如果有令牌则验证，没有则继续
 */
export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const payload = MockUserService.verifyToken(token);
      if (payload) {
        req.user = {
          id: payload.userId,
          username: payload.username,
          subscriptionLevel: payload.subscriptionLevel
        };
      }
    }

    next();
  } catch (error) {
    // 可选认证失败不影响请求
    next();
  }
};

/**
 * 订阅级别中间件 - 检查用户订阅级别
 */
export const requireSubscriptionLevel = (minLevel: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: '需要登录',
        code: 401
      });
      return;
    }

    if (req.user.subscriptionLevel < minLevel) {
      res.status(401).json({
        success: false,
        message: '订阅级别不足',
        code: 401
      });
      return;
    }

    next();
  };
};

/**
 * 管理员中间件 - 检查是否为管理员
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: '需要登录',
      code: 401
    });
    return;
  }

  if (req.user.subscriptionLevel !== 3) {
    res.status(401).json({
      success: false,
      message: '需要管理员权限',
      code: 401
    });
    return;
  }

  next();
};
