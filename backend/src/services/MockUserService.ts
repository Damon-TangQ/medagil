/**
 * 模拟用户数据服务
 * 用于开发和测试阶段的用户数据操作
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { USER_STATUS, SUBSCRIPTION_LEVEL } from '@/shared/constants';
import type { User, RegisterData, LoginData, WechatLoginData, JwtPayload } from '@/shared/types/common';

// 内部用户接口（包含密码字段）
interface InternalUser extends User {
  password: string;
}

class MockUserService {
  // 内存中存储的用户数据（使用内部类型）
  private users: Map<string, InternalUser> = new Map();

  // 用户索引
  private usernameIndex: Map<string, string> = new Map(); // username -> userId
  private phoneIndex: Map<string, string> = new Map(); // phone -> userId
  private emailIndex: Map<string, string> = new Map(); // email -> userId

  // JWT密钥
  private readonly jwtSecret: string = (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    if (secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }
    return secret;
  })();

  // JWT过期时间
  private readonly jwtExpire: string = process.env.JWT_EXPIRE || '7d';

  // 登录失败记录（用于防暴力破解）
  private loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15分钟

  /**
   * 格式化日期为 ISO 8601 字符串
   */
  private formatDate(date: Date): string {
    return date.toISOString();
  }

  constructor() {
    // 初始化5个测试用户数据
    this.initMockUsers();
  }

  /**
   * 初始化测试用户数据
   */
  private initMockUsers(): void {
    const testUsers: InternalUser[] = [
      {
        id: 'user_001',
        username: 'admin',
        password: this.hashPassword('admin123'),
        phone: '13800138001',
        email: 'admin@medagil.com',
        nickname: '管理员',
        subscriptionLevel: SUBSCRIPTION_LEVEL.PREMIUM,
        points: 1000,
        status: USER_STATUS.NORMAL,
        createdAt: this.formatDate(new Date('2023-01-01')),
        updatedAt: this.formatDate(new Date('2023-01-01'))
      },
      {
        id: 'user_002',
        username: 'user1',
        password: this.hashPassword('user123'),
        phone: '13800138002',
        email: 'user1@medagil.com',
        nickname: '测试用户1',
        subscriptionLevel: SUBSCRIPTION_LEVEL.BASIC,
        subscriptionExpireTime: this.formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        points: 500,
        status: USER_STATUS.NORMAL,
        createdAt: this.formatDate(new Date('2023-02-01')),
        updatedAt: this.formatDate(new Date('2023-02-01'))
      },
      {
        id: 'user_003',
        username: 'user2',
        password: this.hashPassword('user123'),
        phone: '13800138003',
        email: 'user2@medagil.com',
        nickname: '测试用户2',
        subscriptionLevel: SUBSCRIPTION_LEVEL.FREE,
        points: 100,
        status: USER_STATUS.NORMAL,
        createdAt: this.formatDate(new Date('2023-03-01')),
        updatedAt: this.formatDate(new Date('2023-03-01'))
      },
      {
        id: 'user_004',
        username: 'user3',
        password: this.hashPassword('user123'),
        phone: '13800138004',
        email: 'user3@medagil.com',
        nickname: '测试用户3',
        subscriptionLevel: SUBSCRIPTION_LEVEL.BASIC,
        subscriptionExpireTime: this.formatDate(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
        points: 200,
        status: USER_STATUS.NORMAL,
        createdAt: this.formatDate(new Date('2023-04-01')),
        updatedAt: this.formatDate(new Date('2023-04-01'))
      },
      {
        id: 'user_005',
        username: 'user4',
        password: this.hashPassword('user123'),
        phone: '13800138005',
        email: 'user4@medagil.com',
        nickname: '测试用户4',
        subscriptionLevel: SUBSCRIPTION_LEVEL.FREE,
        points: 50,
        status: USER_STATUS.DISABLED, // 禁用状态
        createdAt: this.formatDate(new Date('2023-05-01')),
        updatedAt: this.formatDate(new Date('2023-05-01'))
      }
    ];

    // 将测试用户添加到内存存储
    testUsers.forEach(user => {
      this.users.set(user.id, user);
      // 建立索引
      this.usernameIndex.set(user.username, user.id);
      if (user.phone) {
        this.phoneIndex.set(user.phone, user.id);
      }
      if (user.email) {
        this.emailIndex.set(user.email, user.id);
      }
    });
  }

  /**
   * 密码加密（使用随机盐值）
   */
  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, 12); // 增加盐值轮次以提高安全性
  }

  /**
   * 验证密码
   */
  private verifyPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  /**
   * 生成JWT token
   */
  generateToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      this.jwtSecret as jwt.Secret,
      { expiresIn: this.jwtExpire as string | number }
    );
  }

  /**
   * 验证JWT token
   */
  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * 用户注册
   */
  async register(data: RegisterData): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
    // 检查用户名是否已存在
    const existingUser = Array.from(this.users.values()).find(
      user => user.username === data.username
    );

    if (existingUser) {
      return {
        success: false,
        message: '用户名已存在'
      };
    }

    // 检查手机号是否已存在
    if (data.phone) {
      const existingPhone = Array.from(this.users.values()).find(
        user => user.phone === data.phone
      );

      if (existingPhone) {
        return {
          success: false,
          message: '手机号已被注册'
        };
      }
    }

    // 检查邮箱是否已存在
    if (data.email) {
      const existingEmail = Array.from(this.users.values()).find(
        user => user.email === data.email
      );

      if (existingEmail) {
        return {
          success: false,
          message: '邮箱已被注册'
        };
      }
    }

    // 创建新用户
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: data.username,
      password: this.hashPassword(data.password),
      phone: data.phone,
      email: data.email,
      nickname: data.nickname || data.username,
      subscriptionLevel: SUBSCRIPTION_LEVEL.FREE,
      points: 0,
      status: USER_STATUS.NORMAL,
      createdAt: this.formatDate(new Date()),
      updatedAt: this.formatDate(new Date())
    };

    // 保存用户
    this.users.set(newUser.id, newUser);

    // 生成token
    const token = this.generateToken({
      userId: newUser.id,
      username: newUser.username,
      subscriptionLevel: newUser.subscriptionLevel
    });

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = newUser;

    return {
      success: true,
      message: '注册成功',
      user: userWithoutPassword as User,
      token
    };
  }

  /**
   * 用户登录
   */
  async login(data: LoginData, ip?: string): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
    // 查找用户
    let userId: string | undefined;
    let loginKey: string | undefined;

    if (data.username) {
      userId = this.usernameIndex.get(data.username);
      loginKey = `username:${data.username}`;
    } else if (data.phone) {
      userId = this.phoneIndex.get(data.phone);
      loginKey = `phone:${data.phone}`;
    } else if (data.email) {
      userId = this.emailIndex.get(data.email);
      loginKey = `email:${data.email}`;
    }

    if (!userId || !loginKey) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    const user = this.users.get(userId);
    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    // 检查登录尝试次数
    const attempts = this.loginAttempts.get(loginKey);
    if (attempts && 
        attempts.count >= this.MAX_LOGIN_ATTEMPTS && 
        Date.now() - attempts.lastAttempt < this.LOGIN_ATTEMPT_WINDOW) {
      return {
        success: false,
        message: '登录失败次数过多，请15分钟后再试'
      };
    }

    // 检查用户状态
    if (user.status !== USER_STATUS.NORMAL) {
      return {
        success: false,
        message: '账户已被禁用'
      };
    }

    // 验证密码
    if (!this.verifyPassword(data.password, user.password)) {
      // 记录失败尝试
      const currentAttempts = this.loginAttempts.get(loginKey) || { count: 0, lastAttempt: 0 };
      this.loginAttempts.set(loginKey, {
        count: currentAttempts.count + 1,
        lastAttempt: Date.now()
      });

      // 延迟响应以防止暴力破解
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: false,
        message: '密码错误'
      };
    }

    // 登录成功，清除失败记录
    this.loginAttempts.delete(loginKey);

    // 更新登录信息
    user.lastLoginTime = this.formatDate(new Date());
    user.lastLoginIp = ip;
    user.updatedAt = this.formatDate(new Date());
    this.users.set(user.id, user);

    // 生成token
    const token = this.generateToken({
      userId: user.id,
      username: user.username,
      subscriptionLevel: user.subscriptionLevel
    });

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      message: '登录成功',
      user: userWithoutPassword as User,
      token
    };
  }

  /**
   * 微信登录
   */
  async wechatLogin(data: WechatLoginData): Promise<{ success: boolean; message: string; user?: User; token?: string; isNewUser?: boolean }> {
    // 查找用户
    let user = Array.from(this.users.values()).find(
      u => u.wechatOpenId === data.openid
    );

    if (user) {
      // 更新用户信息
      if (data.unionid) {
        user.wechatUnionId = data.unionid;
      }
      if (data.nickname) {
        user.nickname = data.nickname;
      }
      if (data.avatar) {
        user.avatar = data.avatar;
      }
      user.updatedAt = this.formatDate(new Date());
      this.users.set(user.id, user);

      // 生成token
      const token = this.generateToken({
        userId: user.id,
        username: user.username,
        subscriptionLevel: user.subscriptionLevel
      });

      // 返回用户信息（不包含密码）
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        message: '登录成功',
        user: userWithoutPassword as User,
        token,
        isNewUser: false
      };
    }

    // 创建新用户
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: `wx_${data.openid.substring(0, 8)}`,
      password: this.hashPassword(Math.random().toString(36).substring(2)),
      wechatOpenId: data.openid,
      wechatUnionId: data.unionid,
      nickname: data.nickname || '微信用户',
      avatar: data.avatar,
      subscriptionLevel: SUBSCRIPTION_LEVEL.FREE,
      points: 0,
      status: USER_STATUS.NORMAL,
      createdAt: this.formatDate(new Date()),
      updatedAt: this.formatDate(new Date())
    };

    // 保存用户
    this.users.set(newUser.id, newUser);

    // 生成token
    const token = this.generateToken({
      userId: newUser.id,
      username: newUser.username,
      subscriptionLevel: newUser.subscriptionLevel
    });

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = newUser;

    return {
      success: true,
      message: '登录成功',
      user: userWithoutPassword as User,
      token,
      isNewUser: true
    };
  }

  /**
   * 根据ID获取用户
   */
  async getUserById(userId: string): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) {
      return null;
    }

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * 根据用户名获取用户
   */
  async getUserByUsername(username: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.username === username);
    if (!user) {
      return null;
    }

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * 根据手机号获取用户
   */
  async getUserByPhone(phone: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.phone === phone);
    if (!user) {
      return null;
    }

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * 更新用户信息
   */
  async updateUser(userId: string, data: Partial<User>): Promise<{ success: boolean; message: string; user?: User }> {
    const user = this.users.get(userId);
    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    // 更新用户信息
    const updatedUser = {
      ...user,
      ...data,
      id: userId, // 确保ID不被修改
      updatedAt: this.formatDate(new Date())
    };

    this.users.set(userId, updatedUser);

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = updatedUser;

    return {
      success: true,
      message: '更新成功',
      user: userWithoutPassword as User
    };
  }

  /**
   * 更新用户订阅信息
   */
  async updateSubscription(userId: string, level: number, expireTime?: Date): Promise<{ success: boolean; message: string; user?: User }> {
    return this.updateUser(userId, {
      subscriptionLevel: level,
      subscriptionExpireTime: expireTime
    });
  }

  /**
   * 检查用户订阅是否有效
   */
  async isSubscriptionValid(userId: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) {
      return false;
    }

    // 免费用户
    if (user.subscriptionLevel === 0) {
      return true;
    }

    // 检查订阅是否过期
    if (user.subscriptionExpireTime) {
      return new Date(user.subscriptionExpireTime) > new Date();
    }

    return false;
  }

  /**
   * 增加用户积分
   * @param userId 用户ID
   * @param points 要增加的积分
   * @returns 操作结果
   */
  async addPoints(userId: string, points: number): Promise<{ success: boolean; message: string; user?: User; newPoints?: number }> {
    const user = this.users.get(userId);
    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    // 更新积分
    user.points += points;
    user.updatedAt = this.formatDate(new Date());
    this.users.set(userId, user);

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      message: '积分更新成功',
      user: userWithoutPassword as User,
      newPoints: user.points
    };
  }

  /**
   * 减少用户积分
   * @param userId 用户ID
   * @param points 要减少的积分
   * @returns 操作结果
   */
  async deductPoints(userId: string, points: number): Promise<{ success: boolean; message: string; user?: User; newPoints?: number }> {
    const user = this.users.get(userId);
    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    // 检查积分是否足够
    if (user.points < points) {
      return {
        success: false,
        message: '积分不足'
      };
    }

    // 更新积分
    user.points -= points;
    user.updatedAt = this.formatDate(new Date());
    this.users.set(userId, user);

    // 返回用户信息（不包含密码）
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      message: '积分更新成功',
      user: userWithoutPassword as User,
      newPoints: user.points
    };
  }

  /**
   * 获取用户积分
   * @param userId 用户ID
   * @returns 用户积分
   */
  async getPoints(userId: string): Promise<{ success: boolean; message: string; points?: number }> {
    const user = this.users.get(userId);
    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    return {
      success: true,
      message: '获取成功',
      points: user.points
    };
  }

  /**
   * 获取所有用户
   */
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });
  }
}

// 导出单例
export default new MockUserService();
