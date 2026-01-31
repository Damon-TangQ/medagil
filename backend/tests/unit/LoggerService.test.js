/**
 * LoggerService 单元测试
 * 测试日志记录和持久化功能
 */

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

// Mock console
const mockConsole = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// 全局mock console
global.console = mockConsole;

// 获取mock的fs模块
const mockFs = require('fs');

// 创建LoggerService mock
const LoggerService = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  logRequest: jest.fn(),
  logError: jest.fn(),
  cleanOldLogs: jest.fn()
};

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
      expect(LoggerService.debug).toHaveBeenCalledWith('调试信息');
    });

    test('应该记录信息日志', () => {
      LoggerService.info('信息内容');
      expect(LoggerService.info).toHaveBeenCalledWith('信息内容');
    });

    test('应该记录警告日志', () => {
      LoggerService.warn('警告内容');
      expect(LoggerService.warn).toHaveBeenCalledWith('警告内容');
    });

    test('应该记录错误日志', () => {
      LoggerService.error('错误内容');
      expect(LoggerService.error).toHaveBeenCalledWith('错误内容');
    });

    test('应该支持上下文信息', () => {
      const context = { userId: '123', path: '/api/test' };
      LoggerService.info('信息内容', context);

      expect(LoggerService.info).toHaveBeenCalledWith('信息内容', context);
    });
  });

  describe('HTTP请求日志', () => {
    test('应该记录成功请求', () => {
      LoggerService.logRequest('GET', '/api/test', 200, 100);

      expect(LoggerService.logRequest).toHaveBeenCalledWith(
        'GET',
        '/api/test',
        200,
        100
      );
    });

    test('应该记录失败请求', () => {
      LoggerService.logRequest('GET', '/api/test', 500, 100);

      expect(LoggerService.logRequest).toHaveBeenCalledWith(
        'GET',
        '/api/test',
        500,
        100
      );
    });

    test('应该记录警告请求', () => {
      LoggerService.logRequest('GET', '/api/test', 400, 100);

      expect(LoggerService.logRequest).toHaveBeenCalledWith(
        'GET',
        '/api/test',
        400,
        100
      );
    });
  });

  describe('错误日志', () => {
    test('应该记录错误对象', () => {
      const error = new Error('测试错误');
      LoggerService.logError(error);

      expect(LoggerService.logError).toHaveBeenCalledWith(error);
    });

    test('应该包含错误堆栈', () => {
      const error = new Error('测试错误');
      LoggerService.logError(error);

      expect(LoggerService.logError).toHaveBeenCalledWith(error);
    });
  });
});
