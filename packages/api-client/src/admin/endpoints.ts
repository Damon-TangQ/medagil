/**
 * 管理端 API 客户端（由 Orval 生成，勿手改）
 * 首次使用前请在 packages/api-client 下执行：pnpm install && pnpm generate
 */
export const getAdminPing = () => Promise.resolve({ message: 'admin pong' });
export const getDashboardStats = () =>
  Promise.resolve({ totalUsers: 0, totalOrders: 0, mrr: 0 });
export const getAdminUsers = (_params?: { page?: number; pageSize?: number }) =>
  Promise.resolve({ items: [], total: 0 });
export const useGetAdminPing = () => ({ data: { message: 'admin pong' }, isLoading: false });
export const useGetDashboardStats = () =>
  ({ data: { totalUsers: 0, totalOrders: 0, mrr: 0 }, isLoading: false });
export const useGetAdminUsers = (_params?: { page?: number; pageSize?: number }) =>
  ({ data: { items: [], total: 0 }, isLoading: false });
