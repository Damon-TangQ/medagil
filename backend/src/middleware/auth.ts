
/**
 * 认证中间件
 * 用于验证JWT令牌和用户权限
 */

import { Request, Response, NextFunction } from 'express';
import MockUserService from '../services/MockUserService';
import { AuthError } from './errorHandler';

/**
 * 扩展Request接口，添加用户信息
 */
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
 * 认证中间件
 * 验证JWT令牌并将用户信息添加到请求对象
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthError('未提供认证令牌');
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀

    // 验证token
    const payload = MockUserService.verifyToken(token);
    if (!payload) {
      throw new AuthError('认证令牌无效或已过期');
    }

    // 将用户信息添加到请求对象
    req.user = {
      id: payload.userId,
      username: payload.username,
      subscriptionLevel: payload.subscriptionLevel
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 可选认证中间件
 * 如果提供了token则验证，否则继续处理请求
 */
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
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
    // 可选认证失败不中断请求
    next();
  }
};

/**
 * 权限检查中间件
 * 检查用户是否具有指定的订阅级别
 */
export const requireSubscriptionLevel = (minLevel: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AuthError('需要登录'));
      return;
    }

    if (req.user.subscriptionLevel < minLevel) {
      next(new AuthError('您的订阅级别不足以访问此功能'));
      return;
    }

    next();
  };
};

/**
 * 管理员权限中间件
 * 检查用户是否为管理员
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    next(new AuthError('需要登录'));
    return;
  }

  // 假设管理员订阅级别为3（PREMIUM）
  if (req.user.subscriptionLevel < 3) {
    next(new AuthError('需要管理员权限'));
    return;
  }

  next();
};
