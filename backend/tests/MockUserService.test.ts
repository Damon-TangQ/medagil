/**
 * MockUserService 单元测试
 * 测试用户注册、登录、JWT token生成和验证等功能
 */

import { MockUserService, User } from '../src/services/MockUserService';

describe('MockUserService', () => {
  let userService: MockUserService;

  beforeEach(() => {
    // 每个测试前创建新的服务实例
    userService = new MockUserService();
  });

  describe('用户注册功能', () => {
    test('应该成功注册新用户', async () => {
      const registerData = {
        username: 'newuser',
        password: 'password123',
        phone: '13900139001',
        email: 'newuser@test.com',
        nickname: '新用户'
      };

      const result = await userService.register(registerData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('注册成功');
      expect(result.user).toBeDefined();
      expect(result.user?.username).toBe(registerData.username);
      expect(result.user?.phone).toBe(registerData.phone);
      expect(result.user?.email).toBe(registerData.email);
      expect(result.user?.nickname).toBe(registerData.nickname);
      expect(result.user?.password).toBeUndefined(); // 密码不应该返回
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    test('应该拒绝已存在的用户名', async () => {
      const registerData = {
        username: 'admin', // 已存在的用户名
        password: 'password123',
        phone: '13900139002',
        email: 'admin2@test.com'
      };

      const result = await userService.register(registerData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('用户名已存在');
      expect(result.user).toBeUndefined();
      expect(result.token).toBeUndefined();
    });

    test('应该拒绝已存在的手机号', async () => {
      const registerData = {
        username: 'newuser',
        password: 'password123',
        phone: '13800138001', // 已存在的手机号
        email: 'newuser@test.com'
      };

      const result = await userService.register(registerData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('手机号已被注册');
      expect(result.user).toBeUndefined();
      expect(result.token).toBeUndefined();
    });

    test('应该拒绝已存在的邮箱', async () => {
      const registerData = {
        username: 'newuser',
        password: 'password123',
        phone: '13900139003',
        email: 'admin@medagil.com' // 已存在的邮箱
      };

      const result = await userService.register(registerData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('邮箱已被注册');
      expect(result.user).toBeUndefined();
      expect(result.token).toBeUndefined();
    });

    test('应该使用用户名作为默认昵称', async () => {
      const registerData = {
        username: 'testuser',
        password: 'password123'
      };

      const result = await userService.register(registerData);

      expect(result.success).toBe(true);
      expect(result.user?.nickname).toBe('testuser');
    });

    test('新用户应该有默认的订阅等级和积分', async () => {
      const registerData = {
        username: 'testuser',
        password: 'password123'
      };

      const result = await userService.register(registerData);

      expect(result.success).toBe(true);
      expect(result.user?.subscriptionLevel).toBe(0); // 免费用户
      expect(result.user?.points).toBe(0); // 初始积分为0
      expect(result.user?.status).toBe(1); // 正常状态
    });
  });

  describe('用户登录功能', () => {
    test('应该能够使用用户名登录', async () => {
      const loginData = {
        username: 'admin',
        password: 'admin123'
      };

      const result = await userService.login(loginData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('登录成功');
      expect(result.user).toBeDefined();
      expect(result.user?.username).toBe('admin');
      expect(result.user?.password).toBeUndefined();
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    test('应该能够使用手机号登录', async () => {
      const loginData = {
        phone: '13800138001',
        password: 'admin123'
      };

      const result = await userService.login(loginData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('登录成功');
      expect(result.user).toBeDefined();
      expect(result.user?.phone).toBe('13800138001');
      expect(result.token).toBeDefined();
    });

    test('应该能够使用邮箱登录', async () => {
      const loginData = {
        email: 'admin@medagil.com',
        password: 'admin123'
      };

      const result = await userService.login(loginData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('登录成功');
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('admin@medagil.com');
      expect(result.token).toBeDefined();
    });

    test('应该拒绝不存在的用户', async () => {
      const loginData = {
        username: 'nonexistent',
        password: 'password123'
      };

      const result = await userService.login(loginData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('用户不存在');
      expect(result.user).toBeUndefined();
      expect(result.token).toBeUndefined();
    });

    test('应该拒绝错误的密码', async () => {
      const loginData = {
        username: 'admin',
        password: 'wrongpassword'
      };

      const result = await userService.login(loginData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('密码错误');
      expect(result.user).toBeUndefined();
      expect(result.token).toBeUndefined();
    });

    test('应该拒绝被禁用的用户', async () => {
      const loginData = {
        username: 'user4', // user4的状态为0（禁用）
        password: 'user123'
      };

      const result = await userService.login(loginData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('账户已被禁用');
      expect(result.user).toBeUndefined();
      expect(result.token).toBeUndefined();
    });

    test('登录成功后应该更新登录时间和IP', async () => {
      const loginData = {
        username: 'admin',
        password: 'admin123'
      };

      const ip = '192.168.1.1';
      const result = await userService.login(loginData, ip);

      expect(result.success).toBe(true);
      expect(result.user?.lastLoginTime).toBeDefined();
      expect(result.user?.lastLoginIp).toBe(ip);
    });
  });

  describe('JWT Token功能', () => {
    test('应该生成有效的JWT token', async () => {
      const registerData = {
        username: 'testuser',
        password: 'password123'
      };

      const result = await userService.register(registerData);

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(result.token?.length).toBeGreaterThan(0);
    });

    test('应该能够验证有效的token', async () => {
      const registerData = {
        username: 'testuser',
        password: 'password123'
      };

      const registerResult = await userService.register(registerData);
      const token = registerResult.token!;

      const payload = userService.verifyToken(token);

      expect(payload).toBeDefined();
      expect(payload?.userId).toBe(registerResult.user?.id);
      expect(payload?.username).toBe(registerResult.user?.username);
      expect(payload?.subscriptionLevel).toBe(registerResult.user?.subscriptionLevel);
    });

    test('应该拒绝无效的token', () => {
      const invalidToken = 'invalid.token.string';

      const payload = userService.verifyToken(invalidToken);

      expect(payload).toBeNull();
    });

    test('应该拒绝过期的token', () => {
      // 生成一个过期的token
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEyMyIsInVzZXJuYW1lIjoidGVzdCIsInN1YnNjcmlwdGlvbkxldmVsIjowLCJpYXQiOjE1MDAwMDAwMDAsImV4cCI6MTUwMDAwMDAwMH0.invalid';

      const payload = userService.verifyToken(expiredToken);

      expect(payload).toBeNull();
    });

    test('登录和注册的token应该包含正确的用户信息', async () => {
      const registerData = {
        username: 'testuser',
        password: 'password123'
      };

      const registerResult = await userService.register(registerData);
      const registerPayload = userService.verifyToken(registerResult.token!);

      const loginData = {
        username: 'admin',
        password: 'admin123'
      };

      const loginResult = await userService.login(loginData);
      const loginPayload = userService.verifyToken(loginResult.token!);

      expect(registerPayload?.username).toBe('testuser');
      expect(loginPayload?.username).toBe('admin');
      expect(registerPayload?.subscriptionLevel).toBe(0);
      expect(loginPayload?.subscriptionLevel).toBe(2);
    });
  });

  describe('微信登录功能', () => {
    test('应该能够使用微信openid登录已存在的用户', async () => {
      // 首先创建一个微信用户
      const wechatData = {
        openid: 'wx_test_openid',
        nickname: '微信用户',
        avatar: 'https://example.com/avatar.jpg'
      };

      const firstResult = await userService.wechatLogin(wechatData);
      expect(firstResult.success).toBe(true);
      expect(firstResult.isNewUser).toBe(true);

      // 使用相同的openid再次登录
      const secondResult = await userService.wechatLogin(wechatData);
      expect(secondResult.success).toBe(true);
      expect(secondResult.isNewUser).toBe(false);
      expect(secondResult.user?.wechatOpenId).toBe(wechatData.openid);
    });

    test('应该创建新的微信用户', async () => {
      const wechatData = {
        openid: 'wx_new_openid',
        nickname: '新微信用户',
        avatar: 'https://example.com/newavatar.jpg'
      };

      const result = await userService.wechatLogin(wechatData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('登录成功');
      expect(result.isNewUser).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.wechatOpenId).toBe(wechatData.openid);
      expect(result.user?.nickname).toBe(wechatData.nickname);
      expect(result.user?.avatar).toBe(wechatData.avatar);
      expect(result.token).toBeDefined();
    });

    test('应该更新已存在微信用户的信息', async () => {
      const wechatData = {
        openid: 'wx_update_openid',
        nickname: '原始昵称',
        avatar: 'https://example.com/original.jpg'
      };

      await userService.wechatLogin(wechatData);

      // 更新用户信息
      const updatedData = {
        openid: 'wx_update_openid',
        unionid: 'wx_unionid_123',
        nickname: '更新昵称',
        avatar: 'https://example.com/updated.jpg'
      };

      const result = await userService.wechatLogin(updatedData);

      expect(result.success).toBe(true);
      expect(result.isNewUser).toBe(false);
      expect(result.user?.wechatUnionId).toBe(updatedData.unionid);
      expect(result.user?.nickname).toBe(updatedData.nickname);
      expect(result.user?.avatar).toBe(updatedData.avatar);
    });
  });

  describe('用户查询功能', () => {
    test('应该能够通过ID获取用户', async () => {
      const user = await userService.getUserById('user_001');

      expect(user).toBeDefined();
      expect(user?.id).toBe('user_001');
      expect(user?.username).toBe('admin');
      expect(user?.password).toBeUndefined();
    });

    test('应该返回null当用户ID不存在', async () => {
      const user = await userService.getUserById('nonexistent_id');

      expect(user).toBeNull();
    });

    test('应该能够通过用户名获取用户', async () => {
      const user = await userService.getUserByUsername('admin');

      expect(user).toBeDefined();
      expect(user?.username).toBe('admin');
      expect(user?.password).toBeUndefined();
    });

    test('应该能够通过手机号获取用户', async () => {
      const user = await userService.getUserByPhone('13800138001');

      expect(user).toBeDefined();
      expect(user?.phone).toBe('13800138001');
      expect(user?.password).toBeUndefined();
    });

    test('应该能够获取所有用户', async () => {
      const users = await userService.getAllUsers();

      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      // 确保所有用户都不包含密码
      users.forEach(user => {
        expect(user.password).toBeUndefined();
      });
    });
  });

  describe('用户更新功能', () => {
    test('应该能够更新用户信息', async () => {
      const updateData = {
        nickname: '更新后的昵称',
        email: 'updated@test.com'
      };

      const result = await userService.updateUser('user_001', updateData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('更新成功');
      expect(result.user?.nickname).toBe(updateData.nickname);
      expect(result.user?.email).toBe(updateData.email);
    });

    test('应该拒绝更新不存在的用户', async () => {
      const updateData = {
        nickname: '新昵称'
      };

      const result = await userService.updateUser('nonexistent_id', updateData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('用户不存在');
    });

    test('不应该允许更新用户ID', async () => {
      const updateData = {
        id: 'new_id',
        nickname: '新昵称'
      };

      const result = await userService.updateUser('user_001', updateData);

      expect(result.success).toBe(true);
      expect(result.user?.id).toBe('user_001'); // ID应该保持不变
    });
  });

  describe('订阅管理功能', () => {
    test('应该能够更新用户订阅', async () => {
      const expireTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const result = await userService.updateSubscription('user_003', 1, expireTime);

      expect(result.success).toBe(true);
      expect(result.user?.subscriptionLevel).toBe(1);
      expect(result.user?.subscriptionExpireTime).toEqual(expireTime);
    });

    test('应该能够检查订阅是否有效', async () => {
      // 免费用户应该总是有效
      const freeUserValid = await userService.isSubscriptionValid('user_003');
      expect(freeUserValid).toBe(true);

      // 有有效订阅的用户
      const premiumUserValid = await userService.isSubscriptionValid('user_001');
      expect(premiumUserValid).toBe(true);
    });
  });

  describe('积分管理功能', () => {
    test('应该能够增加用户积分', async () => {
      const result = await userService.addPoints('user_003', 100);

      expect(result.success).toBe(true);
      expect(result.message).toBe('积分更新成功');
      expect(result.newPoints).toBe(200); // 初始100 + 100
    });

    test('应该能够减少用户积分', async () => {
      const result = await userService.deductPoints('user_003', 50);

      expect(result.success).toBe(true);
      expect(result.message).toBe('积分更新成功');
      expect(result.newPoints).toBe(50); // 初始100 - 50
    });

    test('应该拒绝积分不足的扣减', async () => {
      const result = await userService.deductPoints('user_003', 200);

      expect(result.success).toBe(false);
      expect(result.message).toBe('积分不足');
    });

    test('应该能够获取用户积分', async () => {
      const result = await userService.getPoints('user_003');

      expect(result.success).toBe(true);
      expect(result.message).toBe('获取成功');
      expect(result.points).toBe(100);
    });

    test('应该拒绝不存在的用户的积分操作', async () => {
      const addResult = await userService.addPoints('nonexistent', 100);
      expect(addResult.success).toBe(false);
      expect(addResult.message).toBe('用户不存在');

      const deductResult = await userService.deductPoints('nonexistent', 100);
      expect(deductResult.success).toBe(false);
      expect(deductResult.message).toBe('用户不存在');

      const getResult = await userService.getPoints('nonexistent');
      expect(getResult.success).toBe(false);
      expect(getResult.message).toBe('用户不存在');
    });
  });
});
