
/**
 * VerificationCodeService 单元测试
 * 测试验证码生成、发送、验证等功能
 */

import VerificationCodeService from '../../src/services/VerificationCodeService';

let service: any;

describe('VerificationCodeService', () => {
  beforeEach(() => {
    // 每个测试前清理所有验证码
    service = VerificationCodeService;
    service.clear();
  });

  describe('验证码生成', () => {
    test('应该生成6位数字验证码', () => {
      const code = service['generateCode']();
      expect(code).toBeDefined();
      expect(code).toHaveLength(6);
      expect(/^\d{6}$/.test(code)).toBe(true);
    });

    test('应该生成不同的验证码', () => {
      const code1 = service['generateCode']();
      const code2 = service['generateCode']();
      expect(code1).not.toBe(code2);
    });
  });

  describe('发送验证码', () => {
    test('应该成功发送手机验证码', async () => {
      const result = await service.sendCode('13800138000', 'phone');

      expect(result.success).toBe(true);
      expect(result.message).toBe('验证码已发送');
      expect(result.codeId).toBeDefined();
    });

    test('应该成功发送邮箱验证码', async () => {
      const result = await service.sendCode('test@example.com', 'email');

      expect(result.success).toBe(true);
      expect(result.message).toBe('验证码已发送');
      expect(result.codeId).toBeDefined();
    });

    test('应该拒绝无效的手机号', async () => {
      const result = await service.sendCode('1234567890', 'phone');

      expect(result.success).toBe(false);
      expect(result.message).toBe('手机号格式不正确');
      expect(result.codeId).toBeUndefined();
    });

    test('应该拒绝无效的邮箱', async () => {
      const result = await service.sendCode('invalid-email', 'email');

      expect(result.success).toBe(false);
      expect(result.message).toBe('邮箱格式不正确');
      expect(result.codeId).toBeUndefined();
    });

    test('应该防止频繁发送', async () => {
      const phone = '13800138000';

      // 第一次发送应该成功
      const result1 = await service.sendCode(phone, 'phone');
      expect(result1.success).toBe(true);

      // 立即再次发送应该失败
      const result2 = await service.sendCode(phone, 'phone');
      expect(result2.success).toBe(false);
      expect(result2.message).toBe('验证码发送过于频繁，请稍后再试');
    });
  });

  describe('验证验证码', () => {
    test('应该成功验证正确的验证码', async () => {
      const phone = '13800138000';

      // 发送验证码
      const sendResult = await service.sendCode(phone, 'phone');
      expect(sendResult.success).toBe(true);

      // 获取验证码（实际中需要从日志或其他方式获取）
      const code = service['generateCode']();

      // 验证验证码
      const verifyResult = await service.verifyCode(phone, 'phone', code);
      expect(verifyResult.success).toBe(true);
      expect(verifyResult.message).toBe('验证码验证成功');
    });

    test('应该拒绝错误的验证码', async () => {
      const phone = '13800138000';
      const code = '000000';

      const result = await service.verifyCode(phone, 'phone', code);
      expect(result.success).toBe(false);
      expect(result.message).toBe('验证码无效或已过期');
    });

    test('应该拒绝过期的验证码', async () => {
      const phone = '13800138000';

      // 发送验证码
      await service.sendCode(phone, 'phone');

      // 清理过期验证码
      service['cleanExpiredCodes']();

      // 尝试验证
      const code = service['generateCode']();
      const result = await service.verifyCode(phone, 'phone', code);
      expect(result.success).toBe(false);
      expect(result.message).toBe('验证码无效或已过期');
    });
  });

  describe('删除验证码', () => {
    test('应该成功删除指定目标的验证码', async () => {
      const phone = '13800138000';

      // 发送验证码
      await service.sendCode(phone, 'phone');

      // 删除验证码
      await service.deleteCode(phone, 'phone');

      // 验证应该失败
      const code = service['generateCode']();
      const result = await service.verifyCode(phone, 'phone', code);
      expect(result.success).toBe(false);
    });
  });

  describe('清理过期验证码', () => {
    test('应该成功清理过期验证码', async () => {
      // 发送多个验证码
      await service.sendCode('13800138001', 'phone');
      await service.sendCode('13800138002', 'phone');
      await service.sendCode('13800138003', 'phone');

      // 清理过期验证码
      service['cleanExpiredCodes']();

      // 检查统计
      const stats = service.getStats();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.expired).toBe(0);
    });
  });

  describe('获取统计信息', () => {
    test('应该返回正确的统计信息', async () => {
      // 发送一些验证码
      await service.sendCode('13800138001', 'phone');
      await service.sendCode('13800138002', 'phone');

      // 获取统计
      const stats = service.getStats();

      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThanOrEqual(2);
      expect(stats.active).toBeGreaterThanOrEqual(2);
      expect(stats.expired).toBe(0);
      expect(stats.used).toBe(0);
    });
  });
});
