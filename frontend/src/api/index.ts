/**
 * API服务模块
 * 统一管理所有API接口
 */

import { get, post, put, del, upload, download } from '@/utils/request'
import type {
  User,
  LoginData,
  WechatLoginData,
  RegisterData,
  Project,
  CreateProjectData,
  UpdateProjectData,
  ProjectListParams,
  Task,
  CreateTaskData,
  UpdateTaskData,
  Subscription,
  SubscriptionRecord,
  ApiResponse,
  ProjectListResponse
} from '@/shared'

// ==================== 认证相关API ====================

/**
 * 用户登录
 */
export const login = (data: LoginData) => {
  return post<{ user: User; token: string }>('/auth/login', data)
}

/**
 * 微信登录
 */
export const wechatLogin = (data: WechatLoginData) => {
  return post<{ user: User; token: string; isNewUser?: boolean }>('/auth/wechat', data)
}

/**
 * 用户注册
 */
export const register = (data: RegisterData) => {
  return post<{ user: User; token: string }>('/auth/register', data)
}

/**
 * 退出登录
 */
export const logout = () => {
  return post('/auth/logout')
}

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  return get<User>('/auth/user')
}

/**
 * 刷新Token
 */
export const refreshToken = () => {
  return post<{ token: string }>('/auth/refresh')
}

// ==================== 项目相关API ====================

/**
 * 获取项目列表
 */
export const getProjectList = (params: ProjectListParams) => {
  return get<ProjectListResponse>('/projects', params)
}

/**
 * 获取项目详情
 */
export const getProjectDetail = (id: string) => {
  return get<Project>(`/projects/${id}`)
}

/**
 * 创建项目
 */
export const createProject = (data: CreateProjectData) => {
  return post<Project>('/projects', data)
}

/**
 * 更新项目
 */
export const updateProject = (id: string, data: UpdateProjectData) => {
  return put<Project>(`/projects/${id}`, data)
}

/**
 * 删除项目
 */
export const deleteProject = (id: string) => {
  return del(`/projects/${id}`)
}

/**
 * 点赞项目
 */
export const likeProject = (id: string) => {
  return post<{ likeCount: number }>(`/projects/${id}/like`)
}

/**
 * 增加项目浏览量
 */
export const incrementProjectView = (id: string) => {
  return post<{ viewCount: number }>(`/projects/${id}/view`)
}

/**
 * 上传项目封面
 */
export const uploadProjectCover = (file: File, onProgress?: (progressEvent: any) => void) => {
  return upload<{ url: string }>('/upload/cover', file, onProgress)
}

// ==================== 任务相关API ====================

/**
 * 获取任务列表
 */
export const getTaskList = (params: { page?: number; pageSize?: number; projectId?: string }) => {
  return get<{ tasks: Task[]; total: number; page: number; pageSize: number }>('/tasks', params)
}

/**
 * 获取任务详情
 */
export const getTaskDetail = (id: string) => {
  return get<Task>(`/tasks/${id}`)
}

/**
 * 创建任务
 */
export const createTask = (data: CreateTaskData) => {
  return post<Task>('/tasks', data)
}

/**
 * 更新任务
 */
export const updateTask = (id: string, data: UpdateTaskData) => {
  return put<Task>(`/tasks/${id}`, data)
}

/**
 * 删除任务
 */
export const deleteTask = (id: string) => {
  return del(`/tasks/${id}`)
}

/**
 * 执行任务
 */
export const executeTask = (id: string, data?: any) => {
  return post<{ result: string }>(`/tasks/${id}/execute`, data)
}

// ==================== 订阅相关API ====================

/**
 * 获取订阅套餐列表
 */
export const getSubscriptionList = () => {
  return get<Subscription[]>('/subscriptions')
}

/**
 * 获取订阅套餐详情
 */
export const getSubscriptionDetail = (id: string) => {
  return get<Subscription>(`/subscriptions/${id}`)
}

/**
 * 获取用户订阅记录
 */
export const getUserSubscriptionRecords = (params?: { page?: number; pageSize?: number }) => {
  return get<{ records: SubscriptionRecord[]; total: number }>('/subscriptions/records', params)
}

/**
 * 创建订阅订单
 */
export const createSubscriptionOrder = (data: { subscriptionId: string; paymentMethod: string }) => {
  return post<{ orderId: string; paymentUrl?: string }>('/subscriptions/order', data)
}

/**
 * 查询订单状态
 */
export const getOrderStatus = (orderId: string) => {
  return get<{ status: number; paymentUrl?: string }>(`/subscriptions/order/${orderId}`)
}

// ==================== 用户相关API ====================

/**
 * 更新用户信息
 */
export const updateUserInfo = (data: Partial<User>) => {
  return put<User>('/user/profile', data)
}

/**
 * 修改密码
 */
export const changePassword = (data: { oldPassword: string; newPassword: string }) => {
  return post('/user/password', data)
}

/**
 * 上传头像
 */
export const uploadAvatar = (file: File, onProgress?: (progressEvent: any) => void) => {
  return upload<{ url: string }>('/upload/avatar', file, onProgress)
}

// ==================== 文件相关API ====================

/**
 * 上传文件
 */
export const uploadFile = (file: File, onProgress?: (progressEvent: any) => void) => {
  return upload<{ url: string }>('/upload/file', file, onProgress)
}

/**
 * 下载文件
 */
export const downloadFile = (url: string, filename: string) => {
  return download(url, filename)
}

// ==================== 统计相关API ====================

/**
 * 获取统计数据
 */
export const getStatistics = (params?: { startDate?: string; endDate?: string }) => {
  return get<{
    projectCount: number
    taskCount: number
    userCount: number
    subscriptionCount: number
  }>('/statistics', params)
}

/**
 * 获取项目统计
 */
export const getProjectStatistics = (id: string) => {
  return get<{
    viewCount: number
    likeCount: number
    taskCount: number
    memberCount: number
  }>(`/projects/${id}/statistics`)
}

// ==================== 导出 ====================
export default {
  // 认证
  login,
  wechatLogin,
  register,
  logout,
  getCurrentUser,
  refreshToken,

  // 项目
  getProjectList,
  getProjectDetail,
  createProject,
  updateProject,
  deleteProject,
  likeProject,
  incrementProjectView,
  uploadProjectCover,

  // 任务
  getTaskList,
  getTaskDetail,
  createTask,
  updateTask,
  deleteTask,
  executeTask,

  // 订阅
  getSubscriptionList,
  getSubscriptionDetail,
  getUserSubscriptionRecords,
  createSubscriptionOrder,
  getOrderStatus,

  // 用户
  updateUserInfo,
  changePassword,
  uploadAvatar,

  // 文件
  uploadFile,
  downloadFile,

  // 统计
  getStatistics,
  getProjectStatistics
}
