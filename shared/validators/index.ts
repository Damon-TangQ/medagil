/**
 * 验证规则
 */

import type { FormRule } from '../types';

// ==================== 通用验证规则 ====================

/**
 * 必填验证
 */
export const required = (message: string = '此项为必填项'): FormRule => ({
  required: true,
  message,
  trigger: 'blur'
});

/**
 * 邮箱验证
 */
export const email = (message: string = '请输入正确的邮箱地址'): FormRule => ({
  type: 'email',
  message,
  trigger: 'blur'
});

/**
 * 手机号验证
 */
export const phone = (message: string = '请输入正确的手机号'): FormRule => ({
  pattern: /^1[3-9]\d{9}$/,
  message,
  trigger: 'blur'
});

/**
 * URL验证
 */
export const url = (message: string = '请输入正确的URL'): FormRule => ({
  pattern: /^https?:\/\/.+/,
  message,
  trigger: 'blur'
});

/**
 * 最小长度验证
 */
export const minLength = (min: number, message?: string): FormRule => ({
  min,
  message: message || `长度不能少于${min}个字符`,
  trigger: 'blur'
});

/**
 * 最大长度验证
 */
export const maxLength = (max: number, message?: string): FormRule => ({
  max,
  message: message || `长度不能超过${max}个字符`,
  trigger: 'blur'
});

/**
 * 密码验证
 */
export const password = (message: string = '密码必须包含大小写字母和数字，长度至少8位'): FormRule => ({
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  message,
  trigger: 'blur'
});

/**
 * 确认密码验证
 */
export const confirmPassword = (passwordField: string = 'password', message: string = '两次输入的密码不一致'): FormRule => ({
  validator: (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入密码'));
    } else if (value !== passwordField) {
      callback(new Error(message));
    } else {
      callback();
    }
  },
  trigger: 'blur'
});

/**
 * 用户名验证
 */
export const username = (message: string = '用户名只能包含字母、数字和下划线，长度4-20位'): FormRule => ({
  pattern: /^[a-zA-Z0-9_]{4,20}$/,
  message,
  trigger: 'blur'
});

/**
 * 自定义正则验证
 */
export const pattern = (regex: RegExp, message: string): FormRule => ({
  pattern: regex,
  message,
  trigger: 'blur'
});

/**
 * 自定义验证器
 */
export const validator = (fn: (rule: any, value: any, callback: any) => void, trigger: 'blur' | 'change' | ['blur', 'change'] = 'blur'): FormRule => ({
  validator: fn,
  trigger
});

// ==================== 表单验证规则集合 ====================

/**
 * 用户注册表单验证规则
 */
export const registerRules = {
  username: [
    required('请输入用户名'),
    username(),
    minLength(4),
    maxLength(20)
  ],
  password: [
    required('请输入密码'),
    password()
  ],
  confirmPassword: [
    required('请再次输入密码'),
    confirmPassword()
  ],
  email: [
    email()
  ],
  phone: [
    phone()
  ]
};

/**
 * 用户登录表单验证规则
 */
export const loginRules = {
  username: [
    required('请输入用户名或手机号')
  ],
  password: [
    required('请输入密码')
  ]
};

/**
 * 项目表单验证规则
 */
export const projectRules = {
  name: [
    required('请输入项目名称'),
    minLength(2),
    maxLength(50)
  ],
  description: [
    required('请输入项目描述'),
    minLength(10),
    maxLength(500)
  ],
  categoryId: [
    required('请选择项目分类')
  ],
  tags: [
    required('请选择或输入项目标签')
  ]
};

/**
 * 任务表单验证规则
 */
export const taskRules = {
  title: [
    required('请输入任务标题'),
    minLength(2),
    maxLength(100)
  ],
  description: [
    required('请输入任务描述'),
    minLength(10),
    maxLength(1000)
  ],
  taskType: [
    required('请选择任务类型')
  ]
};

/**
 * 订阅表单验证规则
 */
export const subscriptionRules = {
  subscriptionId: [
    required('请选择订阅套餐')
  ]
};

/**
 * 个人信息表单验证规则
 */
export const profileRules = {
  nickname: [
    required('请输入昵称'),
    minLength(2),
    maxLength(20)
  ],
  email: [
    email()
  ],
  phone: [
    phone()
  ]
};

// ==================== 数据验证函数 ====================

/**
 * 验证邮箱
 */
export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

/**
 * 验证手机号
 */
export const isValidPhone = (value: string): boolean => {
  return /^1[3-9]\d{9}$/.test(value);
};

/**
 * 验证密码强度
 */
export const checkPasswordStrength = (password: string): {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  message: string;
} => {
  let score = 0;

  // 长度检查
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // 复杂度检查
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  let level: 'weak' | 'medium' | 'strong';
  let message: string;

  if (score <= 2) {
    level = 'weak';
    message = '密码强度：弱';
  } else if (score <= 4) {
    level = 'medium';
    message = '密码强度：中';
  } else {
    level = 'strong';
    message = '密码强度：强';
  }

  return { score, level, message };
};

/**
 * 验证URL
 */
export const isValidUrl = (value: string): boolean => {
  return /^https?:\/\/.+/.test(value);
};

/**
 * 验证IP地址
 */
export const isValidIp = (value: string): boolean => {
  return /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(value);
};

/**
 * 验证身份证号
 */
export const isValidIdCard = (value: string): boolean => {
  // 简单验证，实际应用中需要更严格的验证
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
};

/**
 * 验证银行卡号
 */
export const isValidBankCard = (value: string): boolean => {
  return /^\d{16,19}$/.test(value);
};

/**
 * 验证文件类型
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * 验证文件大小
 */
export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

/**
 * 验证图片尺寸
 */
export const isValidImageSize = (
  file: File,
  minWidth: number,
  minHeight: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img.width >= minWidth && img.height >= minHeight);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    img.src = url;
  });
};

/**
 * 验证数字范围
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * 验证是否为空
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};
