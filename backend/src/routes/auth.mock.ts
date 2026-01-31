/**
 * 认证路由
 * 实现用户认证相关的接口
 */

import { Router, Request, Response } from 'express';
import MockUserService, { WechatLoginData, LoginData } from '../services/MockUserService';

const router = Router();

// 统一响应格式接口
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: number;
}

/**
 * 微信登录接口
 * POST /auth/wechat
 */
router.post('/wechat', async (req: Request, res: Response) => {
  try {
    const { openid, unionid, nickname, avatar } = req.body;

    // 参数验证
    if (!openid) {
      const response: ApiResponse = {
        success: false,
        message: '缺少必要参数: openid',
        code: 400
      };
      return res.status(400).json(response);
    }

    // 微信登录
    const wechatLoginData: WechatLoginData = {
      openid,
      unionid,
      nickname,
      avatar
    };

    const result = await MockUserService.wechatLogin(wechatLoginData);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token,
          isNewUser: result.isNewUser
        }
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message,
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('微信登录错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '服务器内部错误',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 手机号登录接口
 * POST /auth/phone
 */
router.post('/phone', async (req: Request, res: Response) => {
  try {
    const { phone, password, code } = req.body;

    // 参数验证
    if (!phone || !password) {
      const response: ApiResponse = {
        success: false,
        message: '缺少必要参数: phone 或 password',
        code: 400
      };
      return res.status(400).json(response);
    }

    // 验证验证码（实际开发中需要实现验证码验证逻辑）
    if (code) {
      // 这里可以添加验证码验证逻辑
      // 例如：验证验证码是否正确、是否过期等
    }

    // 手机号登录
    const loginData: LoginData = {
      phone,
      password
    };

    const result = await MockUserService.login(loginData, req.ip);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message,
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('手机号登录错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '服务器内部错误',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 用户名/邮箱登录接口
 * POST /auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 参数验证
    if ((!username && !email) || !password) {
      const response: ApiResponse = {
        success: false,
        message: '缺少必要参数: username/email 或 password',
        code: 400
      };
      return res.status(400).json(response);
    }

    // 用户名/邮箱登录
    const loginData: LoginData = {
      username,
      email,
      password
    };

    const result = await MockUserService.login(loginData, req.ip);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message,
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('登录错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '服务器内部错误',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 用户注册接口
 * POST /auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, phone, email, nickname } = req.body;

    // 参数验证
    if (!username || !password) {
      const response: ApiResponse = {
        success: false,
        message: '缺少必要参数: username 或 password',
        code: 400
      };
      return res.status(400).json(response);
    }

    // 用户注册
    const registerData = {
      username,
      password,
      phone,
      email,
      nickname
    };

    const result = await MockUserService.register(registerData);

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      };
      return res.status(201).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message,
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('注册错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '服务器内部错误',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 获取用户信息接口
 * GET /auth/user
 */
router.get('/user', async (req: Request, res: Response) => {
  try {
    // 从请求头获取token
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: '未提供认证令牌',
        code: 401
      };
      return res.status(401).json(response);
    }

    // 验证token
    const payload = MockUserService.verifyToken(token);

    if (!payload) {
      const response: ApiResponse = {
        success: false,
        message: '认证令牌无效或已过期',
        code: 401
      };
      return res.status(401).json(response);
    }

    // 获取用户信息
    const user = await MockUserService.getUserById(payload.userId);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: '用户不存在',
        code: 404
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: '获取用户信息成功',
      data: {
        user,
        token
      }
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '服务器内部错误',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 更新用户信息接口
 * PUT /auth/user
 */
router.put('/user', async (req: Request, res: Response) => {
  try {
    // 从请求头获取token
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: '未提供认证令牌',
        code: 401
      };
      return res.status(401).json(response);
    }

    // 验证token
    const payload = MockUserService.verifyToken(token);

    if (!payload) {
      const response: ApiResponse = {
        success: false,
        message: '认证令牌无效或已过期',
        code: 401
      };
      return res.status(401).json(response);
    }

    // 更新用户信息
    const { nickname, avatar, phone, email } = req.body;
    const result = await MockUserService.updateUser(payload.userId, {
      nickname,
      avatar,
      phone,
      email
    });

    if (result.success) {
      const response: ApiResponse = {
        success: true,
        message: result.message,
        data: {
          user: result.user
        }
      };
      return res.status(200).json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        message: result.message,
        code: 400
      };
      return res.status(400).json(response);
    }
  } catch (error) {
    console.error('更新用户信息错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '服务器内部错误',
      code: 500
    };
    return res.status(500).json(response);
  }
});

/**
 * 刷新token接口
 * POST /auth/refresh
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    // 从请求头获取token
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: '未提供认证令牌',
        code: 401
      };
      return res.status(401).json(response);
    }

    // 验证token
    const payload = MockUserService.verifyToken(token);

    if (!payload) {
      const response: ApiResponse = {
        success: false,
        message: '认证令牌无效或已过期',
        code: 401
      };
      return res.status(401).json(response);
    }

    // 获取用户信息
    const user = await MockUserService.getUserById(payload.userId);

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: '用户不存在',
        code: 404
      };
      return res.status(404).json(response);
    }

    // 生成新token
    const newToken = MockUserService.generateToken({
      userId: user.id,
      username: user.username,
      subscriptionLevel: user.subscriptionLevel
    });

    const response: ApiResponse = {
      success: true,
      message: '刷新令牌成功',
      data: {
        token: newToken,
        user
      }
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error('刷新令牌错误:', error);
    const response: ApiResponse = {
      success: false,
      message: '服务器内部错误',
      code: 500
    };
    return res.status(500).json(response);
  }
});

export default router;
