/**
 * 统一请求实例：baseUrl 与 Authorization 由各 app 在启动时通过 setApiConfig 注入
 * 签名与 Orval fetch mutator 一致：(url, options) => Promise<{ status, data }>
 */
export type ApiConfig = {
  baseUrl: string;
  getToken?: () => string | null;
};

let apiConfig: ApiConfig = {
  baseUrl:
    typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL
      : '',
};

export function setApiConfig(config: Partial<ApiConfig>) {
  apiConfig = { ...apiConfig, ...config };
}

export function getApiConfig(): ApiConfig {
  return { ...apiConfig };
}

export type ErrorType<Error> = Error & { status?: number; data?: unknown };

export const customInstance = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<{ status: number; data: T }> => {
  const { baseUrl, getToken } = apiConfig;
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
  const data = (await res.json().catch(() => ({}))) as T;

  return { status: res.status, data };
};
