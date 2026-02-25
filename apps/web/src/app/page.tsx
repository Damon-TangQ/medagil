'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getMe, getProjects } from '@medagil/api-client/user';
import type { ProjectSummary, UserProfile } from '@medagil/api-client/user/model';

/**
 * MVP-A Web 用户端首页
 *
 * 目标：
 * - 用尽量少的 UI，把「设置 Token → 调用 /me 与 /projects → 展示数据」这一完整闭环跑通；
 * - 便于演示端到端链路是否打通：Next.js → api-client → api-service。
 *
 * 设计要点：
 * - 不实现真实登录，而是通过「一键设置 Demo Token」在 localStorage 中写入占位 token；
 * - React Query 仅在检测到本地存在 user_token 后才发起 /me 与 /projects 请求；
 * - 真实接入微信/手机号登录时，只需要替换掉设置 token 的逻辑即可。
 */
export default function HomePage() {
  const [hasToken, setHasToken] = useState(false);

  // 初始化时检查本地是否已经存在 user_token，用于支持刷新页面后自动恢复登录状态。
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('user_token');
    setHasToken(Boolean(token));
  }, []);

  // 查询当前用户信息：依赖 hasToken，避免在未「登录」状态下反复收到 401。
  const {
    data: me,
    isLoading: loadingMe,
    isError: errorMe,
    refetch: refetchMe,
  } = useQuery<UserProfile>({
    queryKey: ['me'],
    queryFn: () => getMe(),
    enabled: hasToken,
  });

  // 查询 Demo 项目列表：同样仅在 hasToken 为 true 时启用。
  const {
    data: projects,
    isLoading: loadingProjects,
    isError: errorProjects,
    refetch: refetchProjects,
  } = useQuery<{ items: ProjectSummary[]; total: number }>({
    queryKey: ['projects'],
    queryFn: () => getProjects({ page: 1, pageSize: 20 }),
    enabled: hasToken,
  });

  const handleSetupDemo = () => {
    if (typeof window === 'undefined') return;
    // 在本地写入一个占位 token，api-service 只校验是否存在 Authorization 头，不校验 token 内容。
    window.localStorage.setItem('user_token', 'demo-token');
    setHasToken(true);
    // 主动触发一次重新拉取，减少用户等待时间。
    refetchMe();
    refetchProjects();
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <div className="max-w-3xl w-full space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Medagil</h1>
          <p className="text-gray-600">医学科研写作 AI 智能体平台 · Web 用户端（MVP-A Demo）</p>
        </header>

        <section className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">步骤 1：一键开启 Demo 会话</h2>
          <p className="text-sm text-gray-600">
            点击下方按钮，会在浏览器本地写入一个示例 Token（user_token），前端通过
            Authorization 头访问后端 /api/v1/me 与 /api/v1/projects 接口。
          </p>
          <button
            type="button"
            onClick={handleSetupDemo}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            disabled={hasToken && !loadingMe && !loadingProjects}
          >
            {hasToken ? '已设置 Demo Token，可重新拉取数据' : '一键设置 Demo Token 并加载数据'}
          </button>
          <p className="text-xs text-gray-500">
            当前状态：{hasToken ? '已模拟登录（本地存在 user_token）' : '未登录（本地无 user_token）'}
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-3">
            <h3 className="text-base font-semibold text-gray-900">当前用户信息（/api/v1/me）</h3>
            {!hasToken && (
              <p className="text-sm text-gray-500">请先点击上方按钮设置 Demo Token。</p>
            )}
            {hasToken && loadingMe && <p className="text-sm text-gray-500">正在加载用户信息...</p>}
            {hasToken && errorMe && (
              <p className="text-sm text-red-500">拉取用户信息失败，请确认后端服务已启动。</p>
            )}
            {hasToken && me && (
              <dl className="space-y-1 text-sm text-gray-700">
                <div className="flex justify-between">
                  <dt className="text-gray-500">用户 ID</dt>
                  <dd className="font-mono">{me.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">昵称</dt>
                  <dd>{me.nickname ?? '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">邮箱</dt>
                  <dd>{me.email ?? '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">当前套餐</dt>
                  <dd className="capitalize">{me.plan}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">剩余积分</dt>
                  <dd>{me.credits ?? 0}</dd>
                </div>
              </dl>
            )}
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-3">
            <h3 className="text-base font-semibold text-gray-900">项目列表（/api/v1/projects）</h3>
            {!hasToken && (
              <p className="text-sm text-gray-500">请先点击上方按钮设置 Demo Token。</p>
            )}
            {hasToken && loadingProjects && (
              <p className="text-sm text-gray-500">正在加载项目列表...</p>
            )}
            {hasToken && errorProjects && (
              <p className="text-sm text-red-500">拉取项目列表失败，请确认后端服务已启动。</p>
            )}
            {hasToken && projects && projects.items.length === 0 && (
              <p className="text-sm text-gray-500">暂无项目数据（Demo 环境可由后端补充样例）。</p>
            )}
            {hasToken && projects && projects.items.length > 0 && (
              <ul className="space-y-2 text-sm text-gray-700">
                {projects.items.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <span className="font-medium text-gray-900">{project.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
