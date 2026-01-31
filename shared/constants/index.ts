/**
 * 常量配置
 */

// ==================== 应用配置 ====================
export const APP_CONFIG = {
  APP_NAME: 'Medagil AI平台',
  APP_VERSION: '1.0.0',
  API_VERSION: 'v1',
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100
} as const;

// ==================== API配置 ====================
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  TIMEOUT: 30000,
  RETRY_TIMES: 3
} as const;

// ==================== 存储键名 ====================
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SETTINGS: 'settings'
} as const;

// ==================== 订阅等级 ====================
export const SUBSCRIPTION_LEVEL = {
  FREE: 0,
  BASIC: 1,
  PREMIUM: 2
} as const;

export const SUBSCRIPTION_LEVEL_NAMES = {
  [SUBSCRIPTION_LEVEL.FREE]: '免费版',
  [SUBSCRIPTION_LEVEL.BASIC]: '基础版',
  [SUBSCRIPTION_LEVEL.PREMIUM]: '高级版'
} as const;

// ==================== 用户状态 ====================
export const USER_STATUS = {
  DISABLED: 0,
  NORMAL: 1
} as const;

export const USER_STATUS_NAMES = {
  [USER_STATUS.DISABLED]: '禁用',
  [USER_STATUS.NORMAL]: '正常'
} as const;

// ==================== 项目状态 ====================
export const PROJECT_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1
} as const;

export const PROJECT_STATUS_NAMES = {
  [PROJECT_STATUS.DRAFT]: '草稿',
  [PROJECT_STATUS.PUBLISHED]: '已发布'
} as const;

export const PROJECT_STATUS_TYPES = {
  [PROJECT_STATUS.DRAFT]: 'info',
  [PROJECT_STATUS.PUBLISHED]: 'success'
} as const;

// ==================== 任务类型 ====================
export const TASK_TYPE = {
  CHAT: 'chat',
  ANALYSIS: 'analysis',
  REPORT: 'report'
} as const;

export const TASK_TYPE_NAMES = {
  [TASK_TYPE.CHAT]: '对话',
  [TASK_TYPE.ANALYSIS]: '分析',
  [TASK_TYPE.REPORT]: '报告'
} as const;

// ==================== 任务状态 ====================
export const TASK_STATUS = {
  IN_PROGRESS: 0,
  COMPLETED: 1,
  FAILED: 2
} as const;

export const TASK_STATUS_NAMES = {
  [TASK_STATUS.IN_PROGRESS]: '进行中',
  [TASK_STATUS.COMPLETED]: '已完成',
  [TASK_STATUS.FAILED]: '失败'
} as const;

export const TASK_STATUS_TYPES = {
  [TASK_STATUS.IN_PROGRESS]: 'warning',
  [TASK_STATUS.COMPLETED]: 'success',
  [TASK_STATUS.FAILED]: 'danger'
} as const;

// ==================== 支付状态 ====================
export const PAYMENT_STATUS = {
  PENDING: 0,
  PAID: 1,
  CANCELLED: 2
} as const;

export const PAYMENT_STATUS_NAMES = {
  [PAYMENT_STATUS.PENDING]: '待支付',
  [PAYMENT_STATUS.PAID]: '已支付',
  [PAYMENT_STATUS.CANCELLED]: '已取消'
} as const;

// ==================== 支付方式 ====================
export const PAYMENT_METHOD = {
  WECHAT: 'wechat',
  ALIPAY: 'alipay'
} as const;

export const PAYMENT_METHOD_NAMES = {
  [PAYMENT_METHOD.WECHAT]: '微信支付',
  [PAYMENT_METHOD.ALIPAY]: '支付宝'
} as const;

// ==================== 项目可见性 ====================
export const PROJECT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  PROTECTED: 'protected'
} as const;

export const PROJECT_VISIBILITY_NAMES = {
  [PROJECT_VISIBILITY.PUBLIC]: '公开',
  [PROJECT_VISIBILITY.PRIVATE]: '私有',
  [PROJECT_VISIBILITY.PROTECTED]: '仅成员可见'
} as const;

// ==================== 分类配置 ====================
export const CATEGORIES = {
  AI: {
    id: '1',
    name: '人工智能',
    children: {
      NLP: { id: '3', name: '自然语言处理' },
      CV: { id: '4', name: '计算机视觉' },
      ML: { id: '5', name: '机器学习' }
    }
  },
  DATA: {
    id: '2',
    name: '数据分析',
    children: {
      VISUALIZATION: { id: '6', name: '数据可视化' },
      ANALYSIS: { id: '7', name: '预测分析' }
    }
  }
} as const;

// ==================== 主题配置 ====================
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
} as const;

// ==================== 语言配置 ====================
export const LANGUAGE = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US'
} as const;

export const LANGUAGE_NAMES = {
  [LANGUAGE.ZH_CN]: '简体中文',
  [LANGUAGE.EN_US]: 'English'
} as const;

// ==================== 文件上传配置 ====================
export const UPLOAD_CONFIG = {
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_VIDEO_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/avi', 'video/mov'],
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ]
} as const;

// ==================== 分页配置 ====================
export const PAGINATION = {
  PAGE_SIZES: [10, 20, 30, 50, 100],
  DEFAULT_PAGE_SIZE: 10
} as const;

// ==================== 正则表达式 ====================
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{4,20}$/,
  URL: /^https?:\/\/.+/,
  IP: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
} as const;

// ==================== 错误码 ====================
export const ERROR_CODES = {
  SUCCESS: 0,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: '未授权，请登录',
  [ERROR_CODES.FORBIDDEN]: '无权限访问',
  [ERROR_CODES.NOT_FOUND]: '资源不存在',
  [ERROR_CODES.SERVER_ERROR]: '服务器错误'
} as const;

// ==================== 日期格式 ====================
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY'
} as const;

// ==================== 请求方法 ====================
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
} as const;
