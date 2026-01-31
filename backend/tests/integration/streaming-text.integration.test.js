
/**
 * 流式文本集成测试
 * 测试完整的流式文本生成和传输流程
 */

const request = require('supertest');
const app = require('../../src/index');

// 顶层变量声明
let authToken;
let streamId;

describe('流式文本集成测试', () => {
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

  describe('创建流式文本', () => {
    test('应该成功创建流式文本', async () => {
      const response = await request(app)
        .post('/api/streaming/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stream).toBeDefined();
      expect(response.body.stream.id).toBeDefined();
      streamId = response.body.stream.id;
    });

    test('应该拒绝没有认证的请求', async () => {
      const response = await request(app)
        .post('/api/streaming/create')
        .send({
          model: 'gpt-4'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('应该验证模型参数', async () => {
      const response = await request(app)
        .post('/api/streaming/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          model: 'invalid-model'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('写入流式文本', () => {
    test('应该成功写入文本片段', async () => {
      const response = await request(app)
        .post(`/api/streaming/${streamId}/write`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          chunk: 'Hello, World!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('应该支持写入多个片段', async () => {
      const chunks = ['Hello', ', ', 'World', '!'];

      for (const chunk of chunks) {
        const response = await request(app)
          .post(`/api/streaming/${streamId}/write`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ chunk });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      }
    });

    test('应该拒绝写入不存在的流', async () => {
      const response = await request(app)
        .post('/api/streaming/nonexistent/write')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          chunk: 'test'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('读取流式文本', () => {
    test('应该成功读取完整文本', async () => {
      // 先写入一些文本
      await request(app)
        .post(`/api/streaming/${streamId}/write`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ chunk: 'Hello, World!' });

      // 读取完整文本
      const response = await request(app)
        .get(`/api/streaming/${streamId}/read`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.text).toContain('Hello, World!');
    });

    test('应该支持读取部分文本', async () => {
      const response = await request(app)
        .get(`/api/streaming/${streamId}/read?start=0&end=5`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.text.length).toBeLessThanOrEqual(5);
    });
  });

  describe('控制流式文本', () => {
    test('应该成功暂停流', async () => {
      const response = await request(app)
        .post(`/api/streaming/${streamId}/pause`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stream.status).toBe('paused');
    });

    test('应该成功恢复流', async () => {
      // 先暂停
      await request(app)
        .post(`/api/streaming/${streamId}/pause`)
        .set('Authorization', `Bearer ${authToken}`);

      // 恢复
      const response = await request(app)
        .post(`/api/streaming/${streamId}/resume`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stream.status).toBe('active');
    });

    test('应该成功取消流', async () => {
      const response = await request(app)
        .post(`/api/streaming/${streamId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stream.status).toBe('cancelled');
    });
  });

  describe('流式文本统计', () => {
    test('应该返回正确的统计信息', async () => {
      // 创建新流
      const createResponse = await request(app)
        .post('/api/streaming/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ model: 'gpt-4' });

      const newStreamId = createResponse.body.stream.id;

      // 写入一些文本
      await request(app)
        .post(`/api/streaming/${newStreamId}/write`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ chunk: 'Hello, World!' });

      // 获取统计信息
      const response = await request(app)
        .get(`/api/streaming/${newStreamId}/stats`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stats).toBeDefined();
      expect(response.body.stats.charCount).toBeGreaterThan(0);
      expect(response.body.stats.chunkCount).toBeGreaterThan(0);
    });
  });

  describe('流式文本事件', () => {
    test('应该支持SSE事件流', async () => {
      const response = await request(app)
        .get(`/api/streaming/${streamId}/events`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/event-stream');
      expect(response.headers['cache-control']).toContain('no-cache');
    });
  });

  describe('流式文本清理', () => {
    test('应该成功删除流', async () => {
      // 创建新流
      const createResponse = await request(app)
        .post('/api/streaming/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ model: 'gpt-4' });

      const newStreamId = createResponse.body.stream.id;

      // 删除流
      const response = await request(app)
        .delete(`/api/streaming/${newStreamId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
