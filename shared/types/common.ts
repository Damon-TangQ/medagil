
/**
 * 通用类型定义
 * 用于前后端共享的类型
 */

// ==================== API响应类型 ====================

/**
 * 统一API响应格式
 */
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  code?: number
}

/**
 * 分页响应格式
 */
export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ==================== 错误类型 ====================

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  AUTH = 'AUTH_ERROR',
  PERMISSION = 'PERMISSION_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  BUSINESS = 'BUSINESS_ERROR',
  SYSTEM = 'SYSTEM_ERROR'
}

/**
 * 应用错误接口
 */
export interface AppError extends Error {
  type: ErrorType
  code?: number
  details?: any
}

/**
 * HTTP错误码映射
 */
export const ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  401: '未授权，请重新登录',
  403: '没有权限访问',
  404: '请求的资源不存在',
  405: '请求方法不允许',
  408: '请求超时',
  500: '服务器错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
}

// ==================== 用户相关类型 ====================

/**
 * 用户接口
 */
export interface User {
  id: string
  username: string
  phone?: string
  email?: string
  nickname?: string
  avatar?: string
  wechatOpenId?: string
  wechatUnionId?: string
  subscriptionLevel: number
  subscriptionExpireTime?: string // ISO 8601 格式字符串
  points: number
  status: number
  lastLoginTime?: string // ISO 8601 格式字符串
  lastLoginIp?: string
  createdAt: string // ISO 8601 格式字符串
  updatedAt: string // ISO 8601 格式字符串
}

/**
 * 用户注册数据
 */
export interface RegisterData {
  username: string
  password: string
  phone?: string
  email?: string
  nickname?: string
}

/**
 * 用户登录数据
 */
export interface LoginData {
  username?: string
  phone?: string
  email?: string
  password: string
}

/**
 * 微信登录数据
 */
export interface WechatLoginData {
  openid: string
  unionid?: string
  nickname?: string
  avatar?: string
}

/**
 * JWT载荷
 */
export interface JwtPayload {
  userId: string
  username: string
  subscriptionLevel: number
}

// ==================== 项目相关类型 ====================

/**
 * 项目接口
 */
export interface Project {
  id: string
  userId: string
  categoryId: string
  name: string
  description: string
  coverImage?: string
  tags: string[]
  config: ProjectConfig
  status: number
  likeCount: number
  viewCount: number
  createdAt: string
  updatedAt: string
}

/**
 * 项目配置
 */
export interface ProjectConfig {
  model: string
  temperature: number
  maxTokens: number
}

/**
 * 创建项目数据
 */
export interface CreateProjectData {
  userId: string
  categoryId: string
  name: string
  description: string
  coverImage?: string
  tags: string[]
  config: ProjectConfig
}

/**
 * 更新项目数据
 */
export interface UpdateProjectData {
  categoryId?: string
  name?: string
  description?: string
  coverImage?: string
  tags?: string[]
  config?: ProjectConfig
  status?: number
}

/**
 * 项目列表查询参数
 */
export interface ProjectListParams {
  page?: number
  pageSize?: number
  keyword?: string
  categoryId?: string
  status?: number
  userId?: string
}

/**
 * 项目列表响应
 */
export interface ProjectListResponse {
  projects: Project[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ==================== 任务相关类型 ====================

/**
 * 任务接口
 */
export interface Task {
  id: string
  projectId: string
  name: string
  description: string
  status: number
  result?: string
  createdAt: string
  updatedAt: string
}

/**
 * 创建任务数据
 */
export interface CreateTaskData {
  projectId: string
  name: string
  description: string
}

/**
 * 更新任务数据
 */
export interface UpdateTaskData {
  name?: string
  description?: string
  status?: number
  result?: string
}

// ==================== 订阅相关类型 ====================

/**
 * 订阅套餐
 */
export interface Subscription {
  id: string
  name: string
  description: string
  price: number
  duration: number // 天数
  level: number
  features: string[]
}

/**
 * 订阅记录
 */
export interface SubscriptionRecord {
  id: string
  userId: string
  subscriptionId: string
  status: number
  startTime: string
  endTime: string
  createdAt: string
}
