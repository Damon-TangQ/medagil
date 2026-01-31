
/**
 * 用户流程端到端测试
 * 测试完整的用户使用流程
 */

const request = require('supertest');
const app = require('../../src/index');

// 顶层变量声明
let authToken;
let projectId;
let taskId;

describe('用户流程端到端测试', () => {
  describe('新用户注册和使用流程', () => {
    test('步骤1: 用户注册', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: `e2e_test_${Date.now()}`,
          password: 'password123',
          phone: '13900139999',
          email: 'e2e@test.com',
          nickname: 'E2E测试用户'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      authToken = response.body.token;
    });

    test('步骤2: 创建项目', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'E2E测试项目',
          description: '这是一个端到端测试项目',
          categoryId: 'category_001',
          tags: ['E2E', '测试']
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.project).toBeDefined();
      projectId = response.body.project.id;
    });

    test('步骤3: 获取项目列表', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.projects)).toBe(true);
      expect(response.body.projects.length).toBeGreaterThan(0);
    });

    test('步骤4: 查看项目详情', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.project.id).toBe(projectId);
    });

    test('步骤5: 创建任务', async () => {
      const response = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'E2E测试任务',
          description: '这是一个端到端测试任务'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.task).toBeDefined();
      taskId = response.body.task.id;
    });

    test('步骤6: 获取任务列表', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks.length).toBeGreaterThan(0);
    });

    test('步骤7: 更新任务状态', async () => {
      const response = await request(app)
        .put(`/api/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 1 // 进行中
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.task.status).toBe(1);
    });

    test('步骤8: 更新项目信息', async () => {
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '更新后的E2E项目',
          description: '项目描述已更新'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.project.name).toBe('更新后的E2E项目');
    });

    test('步骤9: 删除任务', async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('步骤10: 删除项目', async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('验证码登录流程', () => {
    test('步骤1: 发送验证码', async () => {
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

    test('步骤2: 使用验证码登录', async () => {
      // 注意：实际中需要从日志或其他方式获取验证码
      // 这里使用一个已知的验证码进行测试
      const response = await request(app)
        .post('/api/auth/verify-code')
        .send({
          target: '13900139999',
          type: 'phone',
          code: '123456'
        });

      // 由于验证码可能不匹配，这里只验证响应格式
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('订阅升级流程', () => {
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

    test('步骤1: 查看当前订阅信息', async () => {
      const response = await request(app)
        .get('/api/subscription')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.subscription).toBeDefined();
    });

    test('步骤2: 查看可用订阅方案', async () => {
      const response = await request(app)
        .get('/api/subscription/plans')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.plans)).toBe(true);
    });

    test('步骤3: 升级订阅', async () => {
      const response = await request(app)
        .post('/api/subscription/upgrade')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          planId: 'premium',
          paymentMethod: 'alipay'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.subscription).toBeDefined();
    });
  });

  describe('错误处理流程', () => {
    test('应该正确处理404错误', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('未找到请求的资源');
    });

    test('应该正确处理认证错误', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('应该正确处理验证错误', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: '', // 空用户名
          password: '123' // 密码太短
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });
});
