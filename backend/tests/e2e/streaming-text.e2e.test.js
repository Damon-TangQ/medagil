
/**
 * 流式文本端到端测试
 * 测试完整的流式文本生成和使用流程
 */

const request = require('supertest');
const app = require('../../src/index');

// 顶层变量声明
let authToken;
let streamId;
let pauseStreamId;
let cancelStreamId;
let streamIds = [];
let sseStreamId;

describe('流式文本端到端测试', () => {
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

  describe('完整的流式文本生成流程', () => {
    test('步骤1: 创建流式文本', async () => {
      const response = await request(app)
        .post('/api/streaming/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000,
          metadata: {
            userId: 'admin',
            prompt: '测试提示词'
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stream).toBeDefined();
      expect(response.body.stream.id).toBeDefined();
      expect(response.body.stream.status).toBe('active');
      streamId = response.body.stream.id;
    });

    test('步骤2: 模拟AI生成文本', async () => {
      const chunks = [
        '这是',
        '一个',
        '测试',
        '流式',
        '文本',
        '生成',
        '示例'
      ];

      for (const chunk of chunks) {
        const response = await request(app)
          .post(`/api/streaming/${streamId}/write`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ chunk });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      }
    });

    test('步骤3: 读取完整生成的文本', async () => {
      const response = await request(app)
        .get(`/api/streaming/${streamId}/read`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.text).toBe('这是一个测试流式文本生成示例');
    });

    test('步骤4: 检查流式文本统计', async () => {
      const response = await request(app)
        .get(`/api/streaming/${streamId}/stats`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stats.charCount).toBe(13);
      expect(response.body.stats.chunkCount).toBe(7);
    });

    test('步骤5: 完成流式文本', async () => {
      const response = await request(app)
        .post(`/api/streaming/${streamId}/complete`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stream.status).toBe('completed');
    });
  });

  describe('流式文本暂停和恢复流程', () => {
    test('步骤1: 创建新流', async () => {
      const response = await request(app)
        .post('/api/streaming/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ model: 'gpt-4' });

      expect(response.status).toBe(200);
      pauseStreamId = response.body.stream.id;
    });

    test('步骤2: 开始写入文本', async () => {
      const response = await request(app)
        .post(`/api/streaming/${pauseStreamId}/write`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ chunk: '开始' });

      expect(response.status).toBe(200);
    });

    test('步骤3: 暂停流', async () => {
      const response = await request(app)
        .post(`/api/streaming/${pauseStreamId}/pause`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.stream.status).toBe('paused');
    });

    test('步骤4: 暂停期间拒绝写入', async () => {
      const response = await request(app)
        .post(`/api/streaming/${pauseStreamId}/write`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ chunk: '应该被拒绝' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('未激活');
    });

    test('步骤5: 恢复流', async () => {
      const response = await request(app)
        .post(`/api/streaming/${pauseStreamId}/resume`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.stream.status).toBe('active');
    });

    test('步骤6: 恢复后可以写入', async () => {
      const response = await request(app)
        .post(`/api/streaming/${pauseStreamId}/write`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ chunk: '恢复成功' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('流式文本取消流程', () => {
    test('步骤1: 创建新流', async () => {
      const response = await request(app)
        .post('/api/streaming/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ model: 'gpt-4' });

      expect(response.status).toBe(200);
      cancelStreamId = response.body.stream.id;
    });

    test('步骤2: 写入部分文本', async () => {
      const response = await request(app)
        .post(`/api/streaming/${cancelStreamId}/write`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ chunk: '部分文本' });

      expect(response.status).toBe(200);
    });

    test('步骤3: 取消流', async () => {
      const response = await request(app)
        .post(`/api/streaming/${cancelStreamId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.stream.status).toBe('cancelled');
    });

    test('步骤4: 取消后拒绝写入', async () => {
      const response = await request(app)
        .post(`/api/streaming/${cancelStreamId}/write`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ chunk: '应该被拒绝' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('多流并发测试', () => {
    test('步骤1: 创建多个流', async () => {
      const count = 3;
      for (let i = 0; i < count; i++) {
        const response = await request(app)
          .post('/api/streaming/create')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ model: 'gpt-4' });

        expect(response.status).toBe(200);
        streamIds.push(response.body.stream.id);
      }

      expect(streamIds).toHaveLength(3);
    });

    test('步骤2: 并发写入不同流', async () => {
      const chunks = ['流1', '流2', '流3'];

      for (let i = 0; i < streamIds.length; i++) {
        const response = await request(app)
          .post(`/api/streaming/${streamIds[i]}/write`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ chunk: chunks[i] });

        expect(response.status).toBe(200);
      }
    });

    test('步骤3: 验证各流内容', async () => {
      const expectedTexts = ['流1', '流2', '流3'];

      for (let i = 0; i < streamIds.length; i++) {
        const response = await request(app)
          .get(`/api/streaming/${streamIds[i]}/read`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.text).toBe(expectedTexts[i]);
      }
    });
  });

  describe('SSE事件流测试', () => {
    test('步骤1: 创建流', async () => {
      const response = await request(app)
        .post('/api/streaming/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ model: 'gpt-4' });

      expect(response.status).toBe(200);
      sseStreamId = response.body.stream.id;
    });

    test('步骤2: 订阅SSE事件', async () => {
      const response = await request(app)
        .get(`/api/streaming/${sseStreamId}/events`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'text/event-stream');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/event-stream');
      expect(response.headers['cache-control']).toContain('no-cache');
    });
  });

  describe('错误处理流程', () => {
    test('应该正确处理不存在的流', async () => {
      const response = await request(app)
        .get('/api/streaming/nonexistent/read')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('应该正确处理无效的操作', async () => {
      const response = await request(app)
        .post('/api/streaming/invalid-id/invalid-action')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('应该正确处理没有认证的请求', async () => {
      const response = await request(app)
        .post('/api/streaming/create')
        .send({ model: 'gpt-4' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
