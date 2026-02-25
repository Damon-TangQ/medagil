'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getDashboardStats } from '@medagil/api-client/admin';
import type { DashboardStats } from '@medagil/api-client/admin/model';

/**
 * 管理端首页：数据看板（Dashboard）
 *
 * 目标：
 * - 聚焦展示平台核心指标（用户数、订单数、MRR）；
 * - 其他模块（用户管理、任务、订单、知识库、系统设置）分布在独立路由中，通过左侧导航进入。
 */
export default function AdminDashboardPage() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('admin_token');
    setHasToken(Boolean(token));
  }, []);

  const {
    data: stats,
    isLoading: loadingStats,
    isError: errorStats,
    refetch: refetchStats,
  } = useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => getDashboardStats(),
    enabled: hasToken,
  });

  const {
    data: users,
    isLoading: loadingUsers,
    isError: errorUsers,
    refetch: refetchUsers,
  } = useQuery<AdminUserListResponse>({
    queryKey: ['admin', 'users'],
    queryFn: () => getAdminUsers({ page: 1, pageSize: 20 }),
    enabled: hasToken,
  });

  const {
    data: tasks,
    isLoading: loadingTasks,
    isError: errorTasks,
  } = useQuery<TaskListResponse>({
    queryKey: ['admin', 'tasks'],
    queryFn: () => getAdminTasks({ page: 1, pageSize: 10 }),
    enabled: hasToken,
  });

  const {
    data: orders,
    isLoading: loadingOrders,
    isError: errorOrders,
  } = useQuery<AdminOrderListResponse>({
    queryKey: ['admin', 'orders'],
    queryFn: () => getAdminOrders({ page: 1, pageSize: 10 }),
    enabled: hasToken,
  });

  const {
    data: knowledgeSources,
    isLoading: loadingKnowledge,
    isError: errorKnowledge,
  } = useQuery<KnowledgeSourceListResponse>({
    queryKey: ['admin', 'knowledge', 'sources'],
    queryFn: () => getKnowledgeSources({ page: 1, pageSize: 10 }),
    enabled: hasToken,
  });

  const handleSetupAdminDemo = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('admin_token', 'admin-demo-token');
    setHasToken(true);
    refetchStats();
    refetchUsers();
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">数据看板（MVP-A Demo）</h1>
          <p className="mt-1 text-sm text-gray-600">
            通过一键设置 Demo Token，验证管理端到 api-service 的核心链路是否正常。详细运营视图请通过左侧导航进入对应模块。
          </p>
        </div>
        <button
          type="button"
          onClick={handleSetupAdminDemo}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          disabled={hasToken && !loadingStats && !loadingUsers}
        >
          {hasToken ? '已设置 Admin Demo Token，可重新拉取数据' : '一键设置 Admin Demo Token 并加载数据'}
        </button>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">总用户数</p>
          {hasToken && loadingStats && <p className="mt-2 text-sm text-gray-500">加载中...</p>}
          {hasToken && errorStats && (
            <p className="mt-2 text-sm text-red-500">加载失败，请检查后端 /admin/dashboard/stats。</p>
          )}
          {(!hasToken || (!loadingStats && !stats)) && (
            <p className="mt-2 text-sm text-gray-400">—</p>
          )}
          {hasToken && stats && (
            <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">总订单数</p>
          {hasToken && loadingStats && <p className="mt-2 text-sm text-gray-500">加载中...</p>}
          {hasToken && errorStats && (
            <p className="mt-2 text-sm text-red-500">加载失败，请检查后端 /admin/dashboard/stats。</p>
          )}
          {(!hasToken || (!loadingStats && !stats)) && (
            <p className="mt-2 text-sm text-gray-400">—</p>
          )}
          {hasToken && stats && (
            <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">MRR（月经常性收入）</p>
          {hasToken && loadingStats && <p className="mt-2 text-sm text-gray-500">加载中...</p>}
          {hasToken && errorStats && (
            <p className="mt-2 text-sm text-red-500">加载失败，请检查后端 /admin/dashboard/stats。</p>
          )}
          {(!hasToken || (!loadingStats && !stats)) && (
            <p className="mt-2 text-sm text-gray-400">—</p>
          )}
          {hasToken && stats && (
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              ¥ {stats.mrr.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
