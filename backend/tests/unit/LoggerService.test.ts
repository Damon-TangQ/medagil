
/**
 * LoggerService 单元测试
 * 测试日志记录和持久化功能
 */

import LoggerService from '../src/services/LoggerService';

// Mock文件系统
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  appendFileSync: jest.fn(),
  statSync: jest.fn(),
  renameSync: jest.fn(),
  readdirSync: jest.fn(),
  unlinkSync: jest.fn(),
  writeFileSync: jest.fn()
}));

describe('LoggerService', () => {
  beforeEach(() => {
    // 重置所有mock
    jest.clearAllMocks();

    // 默认返回值
    mockFs.existsSync.mockReturnValue(true);
    mockFs.statSync.mockReturnValue({ size: 100 });
  });

  describe('记录日志', () => {
    test('应该记录调试日志', () => {
      LoggerService.debug('调试信息');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        expect.stringContaining('调试信息')
      );
    });

    test('应该记录信息日志', () => {
      LoggerService.info('信息内容');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.stringContaining('信息内容')
      );
    });

    test('应该记录警告日志', () => {
      LoggerService.warn('警告内容');
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        expect.stringContaining('警告内容')
      );
    });

    test('应该记录错误日志', () => {
      LoggerService.error('错误内容');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.stringContaining('错误内容')
      );
    });

    test('应该支持上下文信息', () => {
      const context = { userId: '123', path: '/api/test' };
      LoggerService.info('信息内容', context);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.stringContaining('信息内容'),
        expect.any(Object)
      );
    });
  });

  describe('HTTP请求日志', () => {
    test('应该记录成功请求', () => {
      LoggerService.logRequest('GET', '/api/test', 200, 100);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.stringContaining('HTTP Request'),
        expect.any(Object)
      );
    });

    test('应该记录失败请求', () => {
      LoggerService.logRequest('GET', '/api/test', 500, 100);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.stringContaining('HTTP Request'),
        expect.any(Object)
      );
    });

    test('应该记录警告请求', () => {
      LoggerService.logRequest('GET', '/api/test', 400, 100);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        expect.stringContaining('HTTP Request'),
        expect.any(Object)
      );
    });
  });

  describe('错误日志', () => {
    test('应该记录错误对象', () => {
      const error = new Error('测试错误');
      LoggerService.logError(error);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.stringContaining('测试错误'),
        expect.any(Object)
      );
    });

    test('应该包含错误堆栈', () => {
      const error = new Error('测试错误');
      LoggerService.logError(error);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.stringContaining('测试错误'),
        expect.any(Object)
      );
    });
  });

  describe('日志格式', () => {
    test('应该包含时间戳', () => {
      LoggerService.info('测试信息');

      const call = (console.log as jest.Mock).mock.calls[0][0];
      expect(call[0]).toMatch(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}\.\d{3}\]/);
    });

    test('应该包含日志级别', () => {
      LoggerService.info('测试信息');

      const call = (console.log as jest.Mock).mock.calls[0][0];
      expect(call[0]).toContain('[INFO]');
    });

    test('应该包含消息内容', () => {
      LoggerService.info('测试信息');

      const call = (console.log as jest.Mock).mock.calls[0][0];
      expect(call[0]).toContain('测试信息');
    });
  });

  describe('文件日志', () => {
    test('应该写入日志文件', () => {
      LoggerService.info('测试信息');

      expect(mockFs.existsSync).toHaveBeenCalled();
      expect(mockFs.statSync).toHaveBeenCalled();
      expect(mockFs.appendFileSync).toHaveBeenCalled();
    });

    test('应该在文件过大时轮转', () => {
      mockFs.statSync.mockReturnValue({ size: 10 * 1024 * 1024 + 1 });

      LoggerService.info('测试信息');

      expect(mockFs.renameSync).toHaveBeenCalled();
    });
  });

  describe('清理旧日志', () => {
    test('应该删除过期的日志文件', () => {
      const oldDate = new Date('2023-01-01');
      const recentDate = new Date();

      mockFs.readdirSync.mockReturnValue([
        { name: 'old.log', mtime: oldDate },
        { name: 'recent.log', mtime: recentDate }
      ]);

      LoggerService['cleanOldLogs']();

      expect(mockFs.unlinkSync).toHaveBeenCalledWith(
        expect.stringContaining('old.log')
      );
    });

    test('应该保留最近的日志文件', () => {
      const recentDate = new Date();

      mockFs.readdirSync.mockReturnValue([
        { name: 'recent.log', mtime: recentDate }
      ]);

      LoggerService['cleanOldLogs']();

      expect(mockFs.unlinkSync).not.toHaveBeenCalled();
    });
  });
});
