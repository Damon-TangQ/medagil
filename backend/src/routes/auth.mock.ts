/**
 * 认证路由
 * 实现用户认证相关的接口
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import MockUserService, { WechatLoginData, LoginData } from '../services/MockUserService';
import VerificationCodeService from '../services/VerificationCodeService';
import type { ApiResponse } from '@/shared/types/common';

const router = Router();

// 验证结果处理中间件
const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '参数验证失败',
      errors: errors.array()
    });
  }
  next();
};

/**
 * 微信登录接口
 * POST /auth/wechat
 */
router.post('/wechat',
  [
    body('openid').notEmpty().withMessage('openid 不能为空'),
    body('unionid').optional().isString(),
    body('nickname').optional().isLength({ min: 1, max: 50 }).withMessage('昵称长度必须在1-50之间'),
    body('avatar').optional().isURL().withMessage('头像必须是有效的URL')
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
  try {
    const { openid, unionid, nickname, avatar } = req.body;

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
router.post('/phone',
  [
    body('phone').notEmpty().withMessage('手机号不能为空')
      .matches(/^1[3-9]\d{9}$/).withMessage('手机号格式不正确'),
    body('password').notEmpty().withMessage('密码不能为空')
      .isLength({ min: 8 }).withMessage('密码长度至少8位'),
    body('code').optional().isLength({ min: 4, max: 6 }).withMessage('验证码长度必须在4-6位之间')
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
  try {
    const { phone, password, code } = req.body;

    // 验证验证码
    if (code) {
      const verifyResult = await VerificationCodeService.verifyCode(phone, 'phone', code);
      if (!verifyResult.success) {
        const response: ApiResponse = {
          success: false,
          message: verifyResult.message,
          code: 400
        };
        return res.status(400).json(response);
      }

      // 验证成功后删除该手机号的所有验证码
      await VerificationCodeService.deleteCode(phone, 'phone');
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
 * 发送手机验证码接口
 * POST /auth/send-code
 */
router.post('/send-code',
  [
    body('phone').notEmpty().withMessage('手机号不能为空')
      .matches(/^1[3-9]\d{9}$/).withMessage('手机号格式不正确')
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { phone } = req.body;

      // 发送验证码
      const result = await VerificationCodeService.sendCode(phone, 'phone');

      if (result.success) {
        const response: ApiResponse = {
          success: true,
          message: result.message
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
      console.error('发送验证码错误:', error);
      const response: ApiResponse = {
        success: false,
        message: '发送验证码失败',
        code: 500
      };
      return res.status(500).json(response);
    }
  }
);

/**
 * 用户名/邮箱登录接口
 * POST /auth/login
 */
router.post('/login',
  [
    body('username').optional().isLength({ min: 4, max: 20 }).withMessage('用户名长度必须在4-20之间')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字和下划线'),
    body('email').optional().isEmail().withMessage('邮箱格式不正确'),
    body('password').notEmpty().withMessage('密码不能为空')
      .isLength({ min: 8 }).withMessage('密码长度至少8位')
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

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
router.post('/register',
  [
    body('username').notEmpty().withMessage('用户名不能为空')
      .isLength({ min: 4, max: 20 }).withMessage('用户名长度必须在4-20之间')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字和下划线'),
    body('password').notEmpty().withMessage('密码不能为空')
      .isLength({ min: 8 }).withMessage('密码长度至少8位')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('密码必须包含大小写字母和数字'),
    body('phone').optional().matches(/^1[3-9]\d{9}$/).withMessage('手机号格式不正确'),
    body('email').optional().isEmail().withMessage('邮箱格式不正确'),
    body('nickname').optional().isLength({ min: 1, max: 50 }).withMessage('昵称长度必须在1-50之间')
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
  try {
    const { username, password, phone, email, nickname } = req.body;

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
