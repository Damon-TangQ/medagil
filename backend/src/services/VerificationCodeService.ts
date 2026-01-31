
/**
 * 验证码服务
 * 负责生成、验证和管理验证码
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * 验证码接口
 */
interface VerificationCode {
  id: string;
  code: string;
  target: string; // 手机号或邮箱
  type: 'phone' | 'email';
  expiresAt: number; // 过期时间戳
  used: boolean;
  createdAt: number;
}

class VerificationCodeService {
  // 内存中存储的验证码（生产环境应使用Redis）
  private codes: Map<string, VerificationCode> = new Map();

  // 验证码有效期（5分钟）
  private readonly CODE_EXPIRE_TIME = 5 * 60 * 1000;

  // 验证码长度
  private readonly CODE_LENGTH = 6;

  // 验证码重发间隔（60秒）
  private readonly RESEND_INTERVAL = 60 * 1000;

  /**
   * 生成随机数字验证码
   */
  private generateCode(): string {
    return Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(this.CODE_LENGTH, '0');
  }

  /**
   * 发送验证码
   */
  async sendCode(
    target: string,
    type: 'phone' | 'email'
  ): Promise<{ success: boolean; message: string; codeId?: string }> {
    // 验证目标格式
    if (type === 'phone') {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(target)) {
        return {
          success: false,
          message: '手机号格式不正确'
        };
      }
    } else if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(target)) {
        return {
          success: false,
          message: '邮箱格式不正确'
        };
      }
    }

    // 检查是否在重发间隔内
    const existingCode = Array.from(this.codes.values()).find(
      c => c.target === target && 
           c.type === type && 
           !c.used && 
           Date.now() - c.createdAt < this.RESEND_INTERVAL
    );

    if (existingCode) {
      return {
        success: false,
        message: '验证码发送过于频繁，请稍后再试'
      };
    }

    // 生成新验证码
    const code = this.generateCode();
    const codeId = uuidv4();
    const now = Date.now();

    const verificationCode: VerificationCode = {
      id: codeId,
      code,
      target,
      type,
      expiresAt: now + this.CODE_EXPIRE_TIME,
      used: false,
      createdAt: now
    };

    // 保存验证码
    this.codes.set(codeId, verificationCode);

    // TODO: 实际发送验证码
    // - 手机号：调用短信服务API
    // - 邮箱：发送邮件
    // 开发环境打印到控制台
    console.log(`[验证码] ${type === 'phone' ? '手机' : '邮箱'}: ${target}, 验证码: ${code}`);

    return {
      success: true,
      message: '验证码已发送',
      codeId
    };
  }

  /**
   * 验证验证码
   */
  async verifyCode(
    target: string,
    type: 'phone' | 'email',
    code: string
  ): Promise<{ success: boolean; message: string }> {
    // 查找有效的验证码
    const verificationCode = Array.from(this.codes.values()).find(
      c => c.target === target && 
           c.type === type && 
           !c.used && 
           c.code === code
    );

    if (!verificationCode) {
      return {
        success: false,
        message: '验证码无效或已过期'
      };
    }

    // 检查是否过期
    if (Date.now() > verificationCode.expiresAt) {
      return {
        success: false,
        message: '验证码已过期'
      };
    }

    // 标记为已使用
    verificationCode.used = true;
    this.codes.set(verificationCode.id, verificationCode);

    return {
      success: true,
      message: '验证码验证成功'
    };
  }

  /**
   * 删除验证码
   */
  async deleteCode(target: string, type: 'phone' | 'email'): Promise<void> {
    const codesToDelete = Array.from(this.codes.entries())
      .filter(([_, c]) => c.target === target && c.type === type)
      .map(([id, _]) => id);

    codesToDelete.forEach(id => this.codes.delete(id));
  }

  /**
   * 清理过期验证码
   * 建议定期调用此方法清理内存
   */
  cleanExpiredCodes(): void {
    const now = Date.now();
    const expiredCodes = Array.from(this.codes.entries())
      .filter(([_, c]) => c.expiresAt < now || c.used)
      .map(([id, _]) => id);

    expiredCodes.forEach(id => this.codes.delete(id));
  }

  /**
   * 获取验证码统计信息
   */
  getStats(): { total: number; active: number; expired: number; used: number } {
    const now = Date.now();
    const codes = Array.from(this.codes.values());

    return {
      total: codes.length,
      active: codes.filter(c => !c.used && c.expiresAt > now).length,
      expired: codes.filter(c => c.expiresAt <= now).length,
      used: codes.filter(c => c.used).length
    };
  }
}

// 导出单例
export default new VerificationCodeService();
