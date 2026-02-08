/**
 * @medagil/api-client
 * 由 Orval 根据 api-service OpenAPI 规范生成，用户端与管理端分离
 *
 * 使用方式：
 * - 用户端（web、miniapp）：import { getMe, useGetMe, ... } from '@medagil/api-client/user'
 * - 管理端（admin）：import { getDashboardStats, useGetDashboardStats, ... } from '@medagil/api-client/admin'
 * - 启动时注入配置：import { setApiConfig } from '@medagil/api-client'
 */
export { setApiConfig, getApiConfig } from './mutator/custom-instance';
export type { ApiConfig } from './mutator/custom-instance';
