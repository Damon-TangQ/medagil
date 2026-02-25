'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAdminTasks } from '@medagil/api-client/admin';
import type { TaskListResponse } from '@medagil/api-client/admin/model';

export default function TasksPage() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('admin_token');
    setHasToken(Boolean(token));
  }, []);

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery<TaskListResponse>({
    queryKey: ['admin', 'tasks', 'list'],
    queryFn: () => getAdminTasks({ page: 1, pageSize: 20 }),
    enabled: hasToken,
  });

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">任务与对话管理</h1>
        <p className="mt-1 text-sm text-gray-600">
          查看平台任务流水，后续可扩展按用户、Agent、状态筛选以及查看任务详情与思考过程。
        </p>
      </div>

      {!hasToken && <p className="text-sm text-gray-500">请先在首页设置 Admin Demo Token。</p>}
      {hasToken && isLoading && <p className="text-sm text-gray-500">正在加载任务列表...</p>}
      {hasToken && isError && (
        <p className="text-sm text-red-500">加载失败，请检查后端 /api/v1/admin/tasks 接口。</p>
      )}
      {hasToken && tasks && tasks.items.length === 0 && (
        <p className="text-sm text-gray-500">暂无任务数据。</p>
      )}
      {hasToken && tasks && tasks.items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white p-4 shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-3 py-2">任务 ID</th>
                <th className="px-3 py-2">项目 ID</th>
                <th className="px-3 py-2">Agent Key</th>
                <th className="px-3 py-2">状态</th>
                <th className="px-3 py-2">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {tasks.items.map((task) => (
                <tr key={task.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2 font-mono text-xs text-gray-700">{task.id}</td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-600">
                    {task.projectId ?? '—'}
                  </td>
                  <td className="px-3 py-2 text-gray-700">{task.agentKey}</td>
                  <td className="px-3 py-2 text-gray-700">{task.status}</td>
                  <td className="px-3 py-2 text-gray-600">{task.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

