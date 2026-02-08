/**
 * React Query 用 mutator：在组件内通过 getToken 注入鉴权（可从 Zustand/Context 读取）
 * 签名与 Orval 生成代码一致：(url, options) => Promise<{ status, data }>
 */
import { getApiConfig } from './custom-instance';
import type { ErrorType } from './custom-instance';

export type UseCustomInstance = (
  url: string,
  options?: RequestInit
) => Promise<{ status: number; data: unknown }>;

export const useCustomInstance = (): UseCustomInstance => {
  const { baseUrl, getToken } = getApiConfig();
  return async (url: string, options: RequestInit = {}) => {
    const fullUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}${url}` : url;
    const token = getToken?.() ?? null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(typeof options.headers === 'object' && !(options.headers instanceof Headers)
        ? (options.headers as Record<string, string>)
        : {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(fullUrl, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  };
};

export type { ErrorType };
