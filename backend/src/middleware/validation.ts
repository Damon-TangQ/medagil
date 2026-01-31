
/**
 * 参数验证中间件
 * 提供统一的请求参数验证功能
 */

import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errorHandler';

/**
 * 验证规则接口
 */
interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: any[];
  custom?: (value: any) => boolean | string;
}

/**
 * 验证配置接口
 */
interface ValidationConfig {
  body?: Record<string, ValidationRule>;
  query?: Record<string, ValidationRule>;
  params?: Record<string, ValidationRule>;
}

/**
 * 验证单个值
 */
function validateValue(value: any, rule: ValidationRule, fieldName: string): string | null {
  // 检查必填
  if (rule.required && (value === undefined || value === null || value === '')) {
    return `${fieldName}不能为空`;
  }

  // 如果值为空且非必填，跳过其他验证
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return null;
  }

  // 类型验证
  if (rule.type) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== rule.type) {
      return `${fieldName}类型错误，期望${rule.type}类型`;
    }
  }

  // 字符串长度验证
  if (rule.type === 'string') {
    if (rule.minLength !== undefined && value.length < rule.minLength) {
      return `${fieldName}长度不能少于${rule.minLength}个字符`;
    }
    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
      return `${fieldName}长度不能超过${rule.maxLength}个字符`;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return `${fieldName}格式不正确`;
    }
  }

  // 数字范围验证
  if (rule.type === 'number') {
    if (rule.min !== undefined && value < rule.min) {
      return `${fieldName}不能小于${rule.min}`;
    }
    if (rule.max !== undefined && value > rule.max) {
      return `${fieldName}不能大于${rule.max}`;
    }
  }

  // 枚举值验证
  if (rule.enum && !rule.enum.includes(value)) {
    return `${fieldName}的值必须是以下之一：${rule.enum.join(', ')}`;
  }

  // 自定义验证
  if (rule.custom) {
    const customResult = rule.custom(value);
    if (customResult !== true) {
      return typeof customResult === 'string' ? customResult : `${fieldName}验证失败`;
    }
  }

  return null;
}

/**
 * 创建验证中间件
 */
export const validate = (config: ValidationConfig) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // 验证请求体
    if (config.body) {
      for (const [fieldName, rule] of Object.entries(config.body)) {
        const error = validateValue(req.body[fieldName], rule, fieldName);
        if (error) {
          errors.push(error);
        }
      }
    }

    // 验证查询参数
    if (config.query) {
      for (const [fieldName, rule] of Object.entries(config.query)) {
        const error = validateValue(req.query[fieldName], rule, fieldName);
        if (error) {
          errors.push(error);
        }
      }
    }

    // 验证路径参数
    if (config.params) {
      for (const [fieldName, rule] of Object.entries(config.params)) {
        const error = validateValue(req.params[fieldName], rule, fieldName);
        if (error) {
          errors.push(error);
        }
      }
    }

    // 如果有错误，返回验证错误
    if (errors.length > 0) {
      next(new ValidationError('参数验证失败', { errors }));
      return;
    }

    next();
  };
};

// 导出常用验证规则
export const rules = {
  // 必填字符串
  requiredString: (minLength?: number, maxLength?: number): ValidationRule => ({
    required: true,
    type: 'string',
    minLength,
    maxLength
  }),

  // 可选字符串
  optionalString: (minLength?: number, maxLength?: number): ValidationRule => ({
    type: 'string',
    minLength,
    maxLength
  }),

  // 必填数字
  requiredNumber: (min?: number, max?: number): ValidationRule => ({
    required: true,
    type: 'number',
    min,
    max
  }),

  // 可选数字
  optionalNumber: (min?: number, max?: number): ValidationRule => ({
    type: 'number',
    min,
    max
  }),

  // 必填布尔值
  requiredBoolean: (): ValidationRule => ({
    required: true,
    type: 'boolean'
  }),

  // 可选布尔值
  optionalBoolean: (): ValidationRule => ({
    type: 'boolean'
  }),

  // 必填数组
  requiredArray: (minLength?: number, maxLength?: number): ValidationRule => ({
    required: true,
    type: 'array',
    minLength,
    maxLength
  }),

  // 可选数组
  optionalArray: (minLength?: number, maxLength?: number): ValidationRule => ({
    type: 'array',
    minLength,
    maxLength
  }),

  // 必填对象
  requiredObject: (): ValidationRule => ({
    required: true,
    type: 'object'
  }),

  // 可选对象
  optionalObject: (): ValidationRule => ({
    type: 'object'
  }),

  // 枚举值
  enum: (...values: any[]): ValidationRule => ({
    enum: values
  }),

  // 正则表达式
  pattern: (regex: RegExp): ValidationRule => ({
    type: 'string',
    pattern: regex
  }),

  // 自定义验证
  custom: (validator: (value: any) => boolean | string): ValidationRule => ({
    custom: validator
  })
};
