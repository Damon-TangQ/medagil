
/**
 * 项目管理集成测试
 * 测试完整的项目管理流程
 */

const request = require('supertest');
const app = require('../../src/index');

// 顶层变量声明
let authToken;
let projectId;
let taskId;

describe('项目管理集成测试', () => {
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

  describe('项目创建', () => {
    test('应该成功创建项目', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '集成测试项目',
          description: '这是一个集成测试项目',
          categoryId: 'category_001',
          tags: ['集成', '测试']
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.project).toBeDefined();
      expect(response.body.project.id).toBeDefined();
      projectId = response.body.project.id;
    });

    test('应该验证必填字段', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test('应该拒绝没有认证的请求', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          name: '测试项目'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('项目查询', () => {
    test('应该成功获取项目列表', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.projects)).toBe(true);
      expect(response.body.projects.length).toBeGreaterThan(0);
    });

    test('应该成功获取项目详情', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.project).toBeDefined();
      expect(response.body.project.id).toBe(projectId);
    });

    test('应该支持分页查询', async () => {
      const response = await request(app)
        .get('/api/projects?page=1&pageSize=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.projects).toBeDefined();
      expect(response.body.pagination).toBeDefined();
    });

    test('应该支持搜索', async () => {
      const response = await request(app)
        .get('/api/projects?search=测试')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.projects).toBeDefined();
    });
  });

  describe('项目更新', () => {
    test('应该成功更新项目', async () => {
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '更新后的项目',
          description: '项目描述已更新'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.project.name).toBe('更新后的项目');
      expect(response.body.project.description).toBe('项目描述已更新');
    });

    test('应该验证更新权限', async () => {
      // 创建另一个用户
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'another_user',
          password: 'password123',
          phone: '13900139997',
          email: 'another@test.com'
        });

      // 登录另一个用户
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'another_user',
          password: 'password123'
        });

      const anotherToken = loginResponse.body.token;

      // 尝试更新其他用户的项目
      const response = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({
          name: '尝试更新'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('项目删除', () => {
    test('应该成功删除项目', async () => {
      // 创建临时项目
      const createResponse = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '待删除项目'
        });

      const tempProjectId = createResponse.body.project.id;

      // 删除项目
      const response = await request(app)
        .delete(`/api/projects/${tempProjectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('应该验证删除权限', async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('任务管理', () => {
    test('应该成功创建任务', async () => {
      const response = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '集成测试任务',
          description: '这是一个集成测试任务'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.task).toBeDefined();
      expect(response.body.task.id).toBeDefined();
      taskId = response.body.task.id;
    });

    test('应该成功获取任务列表', async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks.length).toBeGreaterThan(0);
    });

    test('应该成功更新任务状态', async () => {
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

    test('应该成功删除任务', async () => {
      // 创建临时任务
      const createResponse = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '待删除任务'
        });

      const tempTaskId = createResponse.body.task.id;

      // 删除任务
      const response = await request(app)
        .delete(`/api/projects/${projectId}/tasks/${tempTaskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
