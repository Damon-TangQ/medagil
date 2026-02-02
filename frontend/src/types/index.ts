/**
 * 前端类型定义
 * 扩展共享类型定义，添加前端特有类型
 */

import type { Ref, ComputedRef } from 'vue'
import type { RouteMeta, RouteRecordRaw } from 'vue-router'
import type { VNode } from 'vue'
import type { FormRules } from 'element-plus'

// ==================== 导入共享类型 ====================
export * from '@/shared/types'

// ==================== 前端特有类型 ====================

// ==================== 路由相关 ====================
export interface RouteMetaCustom extends RouteMeta {
  icon?: string
  hidden?: boolean
  activeMenu?: string
  breadcrumb?: boolean
  affix?: boolean
}

export type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: RouteMetaCustom
  children?: AppRouteRecordRaw[]
}

// ==================== 组件Props ====================
export interface BaseComponentProps {
  id?: string
  class?: string
  style?: Record<string, any>
}

export interface LoadingProps extends BaseComponentProps {
  loading: boolean
  text?: string
  background?: string
  fullscreen?: boolean
}

export interface EmptyProps extends BaseComponentProps {
  description?: string
  image?: string
}

export interface PaginationProps extends BaseComponentProps {
  currentPage: number
  pageSize: number
  total: number
  layout?: string
  pageSizes?: number[]
}

// ==================== 表格相关 ====================
export interface TableColumn {
  prop: string
  label: string
  width?: number
  minWidth?: number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  formatter?: (row: any, column: any, cellValue: any, index: number) => string
  render?: (row: any, column: any, cellValue: any, index: number) => VNode
}

export interface TableProps extends BaseComponentProps {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  stripe?: boolean
  border?: boolean
  height?: string | number
  maxHeight?: string | number
}

// ==================== 表单相关 ====================
export interface FormItem {
  prop: string
  label: string
  type?: 'input' | 'select' | 'date' | 'number' | 'textarea' | 'switch' | 'checkbox' | 'radio'
  placeholder?: string
  options?: Array<{ label: string; value: any }>
  rules?: FormRules
  span?: number
  disabled?: boolean
  readonly?: boolean
  props?: Record<string, any>
}

export interface FormProps extends BaseComponentProps {
  model: Record<string, any>
  items: FormItem[]
  labelWidth?: string
  labelPosition?: 'left' | 'right' | 'top'
  inline?: boolean
  disabled?: boolean
}

// ==================== 上传相关 ====================
export interface UploadFile {
  name: string
  url: string
  uid: number
  status?: 'ready' | 'uploading' | 'success' | 'error'
  percentage?: number
  response?: any
}

export interface UploadProps extends BaseComponentProps {
  action: string
  headers?: Record<string, string>
  data?: Record<string, any>
  name?: string
  accept?: string
  multiple?: boolean
  limit?: number
  fileSize?: number
  fileList?: UploadFile[]
  onProgress?: (event: ProgressEvent, file: UploadFile) => void
  onSuccess?: (response: any, file: UploadFile) => void
  onError?: (error: Error, file: UploadFile) => void
  onRemove?: (file: UploadFile) => void
}

// ==================== 对话框相关 ====================
export interface DialogProps extends BaseComponentProps {
  visible: boolean
  title?: string
  width?: string | number
  fullscreen?: boolean
  top?: string
  modal?: boolean
  lockScroll?: boolean
  customClass?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  beforeClose?: (done: () => void) => void
}

// ==================== 消息提示相关 ====================
export interface MessageOptions {
  message: string
  type?: 'success' | 'warning' | 'info' | 'error'
  duration?: number
  showClose?: boolean
  center?: boolean
  dangerouslyUseHTMLString?: boolean
  customClass?: string
  offset?: number
  onClose?: () => void
}

// ==================== 通知相关 ====================
export interface NotificationOptions extends MessageOptions {
  title?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

// ==================== 菜单相关 ====================
export interface MenuItem {
  id: string
  title: string
  path?: string
  icon?: string
  children?: MenuItem[]
  hidden?: boolean
  badge?: string | number
  disabled?: boolean
}

export interface MenuProps extends BaseComponentProps {
  items: MenuItem[]
  defaultActive?: string
  defaultOpeneds?: string[]
  uniqueOpened?: boolean
  router?: boolean
  collapse?: boolean
  backgroundColor?: string
  textColor?: string
  activeTextColor?: string
}

// ==================== 标签页相关 ====================
export interface TabItem {
  name: string
  title: string
  path: string
  closable?: boolean
  query?: Record<string, any>
}

export interface TabsProps extends BaseComponentProps {
  items: TabItem[]
  activeName?: string
  type?: '' | 'card' | 'border-card'
  closable?: boolean
  addable?: boolean
  editable?: boolean
  tabPosition?: 'top' | 'right' | 'bottom' | 'left'
  stretch?: boolean
}

// ==================== 面包屑相关 ====================
export interface BreadcrumbItem {
  title: string
  path?: string
  disabled?: boolean
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[]
  separator?: string
  separatorClass?: string
}

// ==================== 统计卡片相关 ====================
export interface StatisticCardProps extends BaseComponentProps {
  title: string
  value: number | string
  prefix?: string
  suffix?: string
  precision?: number
  trend?: number
  trendUp?: boolean
  icon?: string
  color?: string
  loading?: boolean
}

// ==================== 图表相关 ====================
export interface ChartSeries {
  name: string
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'effectScatter' | 'radar' | 'tree' | 'treemap'
  data: any[]
  [key: string]: any
}

export interface ChartProps extends BaseComponentProps {
  title?: string
  xAxis?: string[]
  yAxis?: string[]
  series: ChartSeries[]
  legend?: boolean
  grid?: Record<string, any>
  tooltip?: Record<string, any>
  height?: string | number
  loading?: boolean
}

// ==================== 搜索相关 ====================
export interface SearchFilter {
  key: string
  label: string
  type?: 'input' | 'select' | 'date' | 'daterange'
  placeholder?: string
  options?: Array<{ label: string; value: any }>
  defaultValue?: any
  props?: Record<string, any>
}

export interface SearchProps extends BaseComponentProps {
  filters: SearchFilter[]
  model: Record<string, any>
  onSearch: (model: Record<string, any>) => void
  onReset: () => void
  searchButtonText?: string
  resetButtonText?: string
  showReset?: boolean
  layout?: 'inline' | 'vertical'
}

// ==================== 操作按钮相关 ====================
export interface ActionButton {
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  icon?: string
  disabled?: boolean
  loading?: boolean
  show?: (row: any, index: number) => boolean
  onClick: (row: any, index: number) => void
}

export interface ActionGroupProps extends BaseComponentProps {
  actions: ActionButton[]
  row: any
  index: number
  max?: number
}

// ==================== 权限相关 ====================
export interface Permission {
  id: string
  name: string
  code: string
  type: 'menu' | 'button' | 'api'
  parentId?: string
  children?: Permission[]
}

export interface Role {
  id: string
  name: string
  code: string
  description?: string
  permissions: Permission[]
}

// ==================== 主题相关 ====================
export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeConfig {
  mode: ThemeMode
  primaryColor: string
  fontSize: number
  borderRadius: number
}

// ==================== 布局相关 ====================
export type LayoutMode = 'side' | 'top' | 'mix'

export interface LayoutConfig {
  mode: LayoutMode
  collapsed: boolean
  showLogo: boolean
  showTags: boolean
  showBreadcrumb: boolean
  showFooter: boolean
  fixedHeader: boolean
  fixedSidebar: boolean
}

// ==================== 应用状态相关 ====================
export interface AppState {
  loading: boolean
  theme: ThemeConfig
  layout: LayoutConfig
  sidebarCollapsed: boolean
  tagsView: TabItem[]
}

// ==================== 工具函数类型 ====================
export type DebouncedFn<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void

export type ThrottledFn<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void

export type AsyncFn<T = any> = (...args: any[]) => Promise<T>

export type MaybePromise<T> = T | Promise<T>

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// ==================== 事件类型 ====================
export interface CustomEvent<T = any> {
  detail: T
  bubbles: boolean
  cancelable: boolean
  composed: boolean
  currentTarget: EventTarget | null
  defaultPrevented: boolean
  eventPhase: number
  isTrusted: boolean
  returnValue: any
  srcElement: EventTarget | null
  target: EventTarget | null
  timeStamp: number
  type: string
}

export type EventHandler<T = any> = (event: CustomEvent<T>) => void

// ==================== 组合式函数类型 ====================
export interface UseRequestOptions<T> {
  manual?: boolean
  defaultParams?: any[]
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onFinally?: () => void
}

export interface UseRequestResult<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  run: (...args: any[]) => Promise<void>
  refresh: () => Promise<void>
  cancel: () => void
}

export interface UseTableOptions<T> {
  fetchFn: (params: any) => Promise<{ list: T[]; total: number }>
  defaultParams?: any
  pagination?: boolean
}

export interface UseTableResult<T> {
  data: Ref<T[]>
  loading: Ref<boolean>
  total: Ref<number>
  currentPage: Ref<number>
  pageSize: Ref<number>
  totalPages: ComputedRef<number>
  hasMore: ComputedRef<boolean>
  refresh: () => Promise<void>
  handlePageChange: (page: number) => void
  handleSizeChange: (size: number) => void
  updateParams: (params: any) => void
  reset: () => Promise<void>
}

// ==================== VNode类型 ====================
export type VNodeChild = VNode | string | number | boolean | null | undefined | VNodeChildren

export type VNodeChildren = Array<VNodeChild | VNodeArrayChildren>

export type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChild>
