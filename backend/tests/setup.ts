
/**
 * Jest测试设置文件
 * 在所有测试运行前执行
 */

// 设置测试环境变量
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_at_least_32_characters_long';
process.env.JWT_EXPIRE = '1h';

// 模拟控制台输出以减少测试输出
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// 设置全局超时
jest.setTimeout(10000);
