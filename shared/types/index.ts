/**
 * 通用类型定义
 */

// ==================== 用户相关 ====================
export interface User {
  id: string;
  username: string;
  password?: string;
  phone?: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  wechatOpenId?: string;
  wechatUnionId?: string;
  subscriptionLevel: number;
  subscriptionExpireTime?: string;
  status: number;
  lastLoginTime?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  username: string;
  password: string;
  phone?: string;
  email?: string;
  nickname?: string;
}

export interface LoginData {
  username?: string;
  phone?: string;
  email?: string;
  password: string;
}

export interface WechatLoginData {
  openid: string;
  unionid?: string;
  nickname?: string;
  avatar?: string;
}

export interface JwtPayload {
  userId: string;
  username: string;
  subscriptionLevel: number;
}

// ==================== 项目相关 ====================
export interface Project {
  id: string;
  userId: string;
  categoryId?: string;
  name: string;
  description?: string;
  coverImage?: string;
  category?: string;
  tags?: string;
  status: number;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  userId: string;
  categoryId?: string;
  name: string;
  description?: string;
  coverImage?: string;
  tags?: string;
}

export interface UpdateProjectData {
  categoryId?: string;
  name?: string;
  description?: string;
  coverImage?: string;
  tags?: string;
  status?: number;
}

export interface ProjectListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: string;
  status?: number;
  userId?: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== 分类相关 ====================
export interface Category {
  id: string;
  name: string;
  parentId?: string;
  level: number;
  sortOrder: number;
  icon?: string;
  description?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== 任务相关 ====================
export interface Task {
  id: string;
  userId: string;
  projectId?: string;
  title: string;
  description?: string;
  taskType: string;
  conversationHistory?: any;
  result?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  userId: string;
  projectId?: string;
  title: string;
  description?: string;
  taskType: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  result?: string;
  status?: number;
}

// ==================== 订阅相关 ====================
export interface Subscription {
  id: string;
  name: string;
  level: number;
  price: number;
  duration: number;
  features?: string;
  maxProjects: number;
  maxTasksPerMonth: number;
  maxAiCallsPerMonth: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  subscriptionId: string;
  startTime: string;
  endTime: string;
  amount: number;
  paymentMethod?: string;
  paymentStatus: number;
  createdAt: string;
}

// ==================== API响应 ====================
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== 通用类型 ====================
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Dict<T = any> = Record<string, T>;
export type Fn = (...args: any[]) => any;
export type PromiseFn = (...args: any[]) => Promise<any>;

// ==================== 组件Props ====================
export interface BaseProps {
  id?: string;
  className?: string;
  style?: Record<string, any>;
}

export interface LoadingProps extends BaseProps {
  loading: boolean;
  tip?: string;
}

// ==================== 表单相关 ====================
export interface FormRule {
  required?: boolean;
  message?: string;
  trigger?: 'blur' | 'change' | ['blur', 'change'];
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (rule: any, value: any, callback: any) => void;
}

export interface FormRules {
  [key: string]: FormRule | FormRule[];
}

// ==================== 路由相关 ====================
export interface RouteMeta {
  title?: string;
  requiresAuth?: boolean;
  roles?: string[];
  keepAlive?: boolean;
}

export interface RouteConfig {
  path: string;
  name: string;
  component?: any;
  redirect?: string;
  meta?: RouteMeta;
  children?: RouteConfig[];
}
