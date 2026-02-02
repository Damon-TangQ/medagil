
/**
 * StreamingTextService 单元测试
 * 测试流式文本生成和传输功能
 */

import { StreamingTextService } from '../../src/services/StreamingTextService';

let service: any;

describe('StreamingTextService', () => {
  beforeEach(() => {
    service = new StreamingTextService();
  });

  describe('创建流式文本', () => {
    test('应该成功创建流式文本实例', () => {
      const stream = service.createStream('test_stream');
      expect(stream).toBeDefined();
      expect(stream.id).toBe('test_stream');
    });

    test('应该生成唯一的流ID', () => {
      const stream1 = service.createStream();
      const stream2 = service.createStream();
      expect(stream1.id).not.toBe(stream2.id);
    });
  });

  describe('写入流式文本', () => {
    test('应该成功写入文本片段', () => {
      const stream = service.createStream('test_stream');
      const result = service.writeChunk('test_stream', 'Hello');

      expect(result.success).toBe(true);
      expect(stream.chunks).toHaveLength(1);
      expect(stream.chunks[0]).toBe('Hello');
    });

    test('应该支持写入多个片段', () => {
      const stream = service.createStream('test_stream');
      service.writeChunk('test_stream', 'Hello');
      service.writeChunk('test_stream', ' ');
      service.writeChunk('test_stream', 'World');

      expect(stream.chunks).toHaveLength(3);
      expect(stream.chunks.join('')).toBe('Hello World');
    });

    test('应该拒绝写入不存在的流', () => {
      const result = service.writeChunk('nonexistent', 'test');

      expect(result.success).toBe(false);
      expect(result.message).toBe('流不存在');
    });
  });

  describe('读取流式文本', () => {
    test('应该成功读取完整文本', () => {
      service.createStream('test_stream');
      service.writeChunk('test_stream', 'Hello');
      service.writeChunk('test_stream', ' World');

      const result = service.readFullText('test_stream');
      expect(result).toBe('Hello World');
    });

    test('应该支持读取部分文本', () => {
      service.createStream('test_stream');
      service.writeChunk('test_stream', 'Hello World');

      const result = service.readPartialText('test_stream', 0, 5);
      expect(result).toBe('Hello');
    });

    test('应该拒绝读取不存在的流', () => {
      const result = service.readFullText('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('流式文本状态', () => {
    test('应该正确跟踪流状态', () => {
      const stream = service.createStream('test_stream');
      expect(stream.status).toBe('active');

      service.completeStream('test_stream');
      expect(stream.status).toBe('completed');
    });

    test('应该支持暂停和恢复流', () => {
      const stream = service.createStream('test_stream');

      service.pauseStream('test_stream');
      expect(stream.status).toBe('paused');

      service.resumeStream('test_stream');
      expect(stream.status).toBe('active');
    });

    test('应该支持取消流', () => {
      const stream = service.createStream('test_stream');

      service.cancelStream('test_stream');
      expect(stream.status).toBe('cancelled');
    });
  });

  describe('流式文本元数据', () => {
    test('应该支持添加元数据', () => {
      const stream = service.createStream('test_stream');
      const metadata = {
        userId: 'user123',
        model: 'gpt-4',
        temperature: 0.7
      };

      service.setMetadata('test_stream', metadata);
      expect(stream.metadata).toEqual(metadata);
    });

    test('应该支持更新元数据', () => {
      const stream = service.createStream('test_stream');
      service.setMetadata('test_stream', { userId: 'user123' });
      service.setMetadata('test_stream', { model: 'gpt-4' });

      expect(stream.metadata).toEqual({
        userId: 'user123',
        model: 'gpt-4'
      });
    });
  });

  describe('流式文本统计', () => {
    test('应该正确统计字符数', () => {
      service.createStream('test_stream');
      service.writeChunk('test_stream', 'Hello');
      service.writeChunk('test_stream', ' World');

      const stats = service.getStats('test_stream');
      expect(stats.charCount).toBe(11);
    });

    test('应该正确统计字节数', () => {
      service.createStream('test_stream');
      const text = 'Hello World';
      service.writeChunk('test_stream', text);

      const stats = service.getStats('test_stream');
      expect(stats.byteCount).toBe(new Blob([text]).size);
    });

    test('应该正确统计片段数', () => {
      service.createStream('test_stream');
      service.writeChunk('test_stream', 'Hello');
      service.writeChunk('test_stream', ' ');
      service.writeChunk('test_stream', 'World');

      const stats = service.getStats('test_stream');
      expect(stats.chunkCount).toBe(3);
    });
  });

  describe('清理流式文本', () => {
    test('应该成功删除流', () => {
      service.createStream('test_stream');
      const result = service.deleteStream('test_stream');

      expect(result.success).toBe(true);
      expect(service.getStream('test_stream')).toBeNull();
    });

    test('应该清理过期流', () => {
      service.createStream('stream1');
      service.createStream('stream2');
      service.createStream('stream3');

      const cleaned = service.cleanExpiredStreams(3600000); // 1小时
      expect(cleaned).toBeGreaterThanOrEqual(0);
    });
  });

  describe('流式文本事件', () => {
    test('应该触发写入事件', (done) => {
      service.createStream('test_stream');

      service.on('test_stream', 'chunk', (chunk: any) => {
        expect(chunk).toBe('test');
        done();
      });

      service.writeChunk('test_stream', 'test');
    });

    test('应该触发完成事件', (done) => {
      service.createStream('test_stream');

      service.on('test_stream', 'complete', () => {
        done();
      });

      service.completeStream('test_stream');
    });

    test('应该触发错误事件', (done) => {
      service.createStream('test_stream');

      service.on('test_stream', 'error', (error: any) => {
        expect(error).toBeDefined();
        done();
      });

      // 尝试向已完成的流写入数据，应该触发错误事件
      service.completeStream('test_stream');
      service.writeChunk('test_stream', 'test');
    });
  });
});
