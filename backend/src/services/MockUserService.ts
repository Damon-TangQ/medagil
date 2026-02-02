/**
 * 模拟用户数据服务
 * 用于开发和测试阶段的用户数据操作
 */

import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// 用户接口定义
export interface User {
  id: string;
  username: string;
  password: string;
  phone?: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  wechatOpenId?: string;
  wechatUnionId?: string;
  subscriptionLevel: number;
  subscriptionExpireTime?: Date;
  status: number;
  lastLoginTime?: Date;
  lastLoginIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 注册接口
export interface RegisterData {
  username: string;
  password: string;
  phone?: string;
  email?: string;
  nickname?: string;
}

// 登录接口
export interface LoginData {
  username?: string;
  phone?: string;
  email?: string;
  password: string;
}

// 微信登录接口
export interface WechatLoginData {
  openid: string;
  unionid?: string;
  nickname?: string;
  avatar?: string;
}

// JWT载荷接口
export interface JwtPayload {
  userId: string;
  username: string;
  subscriptionLevel: number;
}

class MockUserService {
  // 内存中存储的用户数据
  private users: Map<string, User> = new Map();

  // JWT密钥
  private readonly jwtSecret: string = process.env.JWT_SECRET || 'medagil_jwt_secret_key';

  // JWT过期时间
  private readonly jwtExpire: string = process.env.JWT_EXPIRE || '7d';

  constructor() {
    // 初始化5个测试用户数据
    this.initMockUsers();
  }

  /**
   * 初始化测试用户数据
   */
  private initMockUsers(): void {
    const testUsers: User[] = [
      {
        id: 'user_000',
        username: 'testuser',
        password: this.hashPassword('password123'),
        phone: '13800138000',
        email: 'test@example.com',
        nickname: '测试用户',
        subscriptionLevel: 1,
        subscriptionExpireTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 1,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'user_001',
        username: 'admin',
        password: this.hashPassword('admin123'),
        phone: '13800138001',
        email: 'admin@medagil.com',
        nickname: '管理员',
        subscriptionLevel: 2,
        status: 1,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'user_002',
        username: 'user1',
        password: this.hashPassword('user123'),
        phone: '13800138002',
        email: 'user1@medagil.com',
        nickname: '测试用户1',
        subscriptionLevel: 1,
        subscriptionExpireTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 1,
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date('2023-02-01')
      },
      {
        id: 'user_003',
        username: 'user2',
        password: this.hashPassword('user123'),
        phone: '13800138003',
        email: 'user2@medagil.com',
        nickname: '测试用户2',
        subscriptionLevel: 0,
        status: 1,
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date('2023-03-01')
      },
      {
        id: 'user_004',
        username: 'user3',
        password: this.hashPassword('user123'),
        phone: '13800138004',
        email: 'user3@medagil.com',
        nickname: '测试用户3',
        subscriptionLevel: 1,
        subscriptionExpireTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 1,
        createdAt: new Date('2023-04-01'),
        updatedAt: new Date('2023-04-01')
      },
      {
        id: 'user_005',
        username: 'user4',
        password: this.hashPassword('user123'),
        phone: '13800138005',
        email: 'user4@medagil.com',
        nickname: '测试用户4',
        subscriptionLevel: 0,
        status: 0, // 禁用状态
        createdAt: new Date('2023-05-01'),
        updatedAt: new Date('2023-05-01')
      }
    ];

    // 将测试用户添加到内存存储
    testUsers.forEach(user => {
      this.users.set(user.id, user);
    });
  }

  /**
   * 密码加密
   */
  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
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
    // @ts-ignore
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpire });
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
      subscriptionLevel: 0,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
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
    let user: User | undefined;

    if (data.username) {
      user = Array.from(this.users.values()).find(u => u.username === data.username);
    } else if (data.phone) {
      user = Array.from(this.users.values()).find(u => u.phone === data.phone);
    } else if (data.email) {
      user = Array.from(this.users.values()).find(u => u.email === data.email);
    }

    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    // 检查用户状态
    if (user.status !== 1) {
      return {
        success: false,
        message: '账户已被禁用'
      };
    }

    // 验证密码
    if (!this.verifyPassword(data.password, user.password)) {
      return {
        success: false,
        message: '密码错误'
      };
    }

    // 更新登录信息
    user.lastLoginTime = new Date();
    user.lastLoginIp = ip;
    user.updatedAt = new Date();
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
      user.updatedAt = new Date();
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
      subscriptionLevel: 0,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
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
      updatedAt: new Date()
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
