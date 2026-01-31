
/**
 * 认证集成测试
 * 测试完整的认证流程
 */

const request = require('supertest');
const app = require('../../src/index');

// 顶层变量声明
let authToken;

describe('认证集成测试', () => {
  describe('用户注册流程', () => {
    test('应该成功注册新用户', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'integration_test_user',
          password: 'password123',
          phone: '13900139999',
          email: 'integration@test.com',
          nickname: '集成测试用户'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('注册成功');
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe('integration_test_user');
      expect(response.body.token).toBeDefined();
      authToken = response.body.token;
    });

    test('应该拒绝已存在的用户名', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'integration_test_user',
          password: 'password123',
          phone: '13900139998',
          email: 'integration2@test.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('已存在');
    });

    test('应该验证必填字段', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: '',
          password: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('用户登录流程', () => {
    test('应该成功登录', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      authToken = response.body.token;
    });

    test('应该拒绝错误的密码', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'wrong_password'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('密码');
    });

    test('应该拒绝不存在的用户', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('受保护的API', () => {
    beforeAll(async () => {
      // 登录获取token
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      authToken = response.body.token;
    });

    test('应该接受有效的token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });

    test('应该拒绝无效的token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('应该拒绝没有token的请求', async () => {
      const response = await request(app)
        .get('/api/user/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('验证码流程', () => {
    test('应该成功发送验证码', async () => {
      const response = await request(app)
        .post('/api/auth/send-code')
        .send({
          target: '13900139999',
          type: 'phone'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.codeId).toBeDefined();
    });

    test('应该验证验证码', async () => {
      const response = await request(app)
        .post('/api/auth/verify-code')
        .send({
          target: '13900139999',
          type: 'phone',
          code: '123456'
        });

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
    });

    test('应该拒绝无效的验证码', async () => {
      const response = await request(app)
        .post('/api/auth/verify-code')
        .send({
          target: '13900139999',
          type: 'phone',
          code: '000000'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Token刷新流程', () => {
    test('应该成功刷新token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.token).not.toBe(authToken);
    });

    test('应该拒绝无效的token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
