/**
 * 用户端 API 客户端（由 Orval 生成，勿手改）
 * 首次使用前请在 packages/api-client 下执行：pnpm install && pnpm generate
 */
export const getPing = () => Promise.resolve({ message: 'pong' });
export const getMe = () => Promise.resolve({ id: '', plan: 'free' as const });
export const getProjects = (_params?: { page?: number; pageSize?: number }) =>
  Promise.resolve({ items: [], total: 0 });
export const useGetPing = () => ({ data: { message: 'pong' }, isLoading: false });
export const useGetMe = () => ({ data: { id: '', plan: 'free' as const }, isLoading: false });
export const useGetProjects = (_params?: { page?: number; pageSize?: number }) =>
  ({ data: { items: [], total: 0 }, isLoading: false });
