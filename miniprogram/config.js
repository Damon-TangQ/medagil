/**
 * 小程序配置文件
 */

// ==================== API配置 ====================
const API_CONFIG = {
  // 开发环境
  development: {
    baseUrl: 'http://localhost:5000/api',
    timeout: 30000
  },
  // 生产环境
  production: {
    baseUrl: 'https://api.medagil.com/api',
    timeout: 30000
  }
}

// ==================== 环境配置 ====================
const ENV_CONFIG = {
  // 当前环境
  env: 'development',

  // 获取当前环境配置
  getConfig() {
    return API_CONFIG[this.env]
  }
}

// ==================== 存储键名 ====================
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  SETTINGS: 'settings'
}

// ==================== 应用配置 ====================
const APP_CONFIG = {
  // 应用名称
  appName: 'Medagil AI',

  // 应用版本
  version: '1.0.0',

  // 每页显示数量
  pageSize: 10,

  // 最大每页显示数量
  maxPageSize: 50
}

// ==================== 订阅配置 ====================
const SUBSCRIPTION_CONFIG = {
  // 免费版
  free: {
    level: 0,
    name: '免费版',
    maxProjects: 3,
    maxTasksPerMonth: 10,
    maxAiCallsPerMonth: 50
  },

  // 基础版
  basic: {
    level: 1,
    name: '基础版',
    maxProjects: 10,
    maxTasksPerMonth: 100,
    maxAiCallsPerMonth: 500
  },

  // 高级版
  premium: {
    level: 2,
    name: '高级版',
    maxProjects: -1, // 无限制
    maxTasksPerMonth: -1, // 无限制
    maxAiCallsPerMonth: -1 // 无限制
  }
}

// ==================== 文件上传配置 ====================
const UPLOAD_CONFIG = {
  // 最大文件大小 (MB)
  maxSize: 10,

  // 允许上传的图片类型
  imageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

  // 上传接口
  uploadUrl: '/upload'
}

// ==================== 缓存配置 ====================
const CACHE_CONFIG = {
  // 是否启用缓存
  enabled: true,

  // 缓存过期时间 (毫秒)
  expireTime: 3600000, // 1小时

  // 缓存键前缀
  prefix: 'cache_'
}

// ==================== 导出配置 ====================
module.exports = {
  API_CONFIG,
  ENV_CONFIG,
  STORAGE_KEYS,
  APP_CONFIG,
  SUBSCRIPTION_CONFIG,
  UPLOAD_CONFIG,
  CACHE_CONFIG
}
