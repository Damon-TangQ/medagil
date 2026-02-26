'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAdminTasks } from '@medagil/api-client/admin';
import { TaskStatus } from '@medagil/api-client/admin/model';
import type { getAdminTasksResponse } from '@medagil/api-client/admin';

export default function TasksPage() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('admin_token');
    setHasToken(Boolean(token));
  }, []);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<getAdminTasksResponse>({
    queryKey: ['admin', 'tasks', 'list'],
    queryFn: () => getAdminTasks({ page: 1, pageSize: 20 }),
    enabled: hasToken,
  });

  const tasks = response?.data;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">任务与对话管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            查看平台任务流水，监控任务状态与对话内容。
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            导出数据
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            创建任务
          </button>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-1">
              搜索任务
            </label>
            <input
              type="text"
              id="search"
              placeholder="输入任务ID、项目ID或Agent Key"
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="agent-filter" className="block text-xs font-medium text-gray-700 mb-1">
              Agent类型
            </label>
            <select
              id="agent-filter"
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option>全部Agent</option>
              <option>代码助手</option>
              <option>数据分析</option>
              <option>文档生成</option>
              <option>任务规划</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1">
              任务状态
            </label>
            <select
              id="status-filter"
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option>全部状态</option>
              <option>进行中</option>
              <option>已完成</option>
              <option>已失败</option>
              <option>已取消</option>
            </select>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            查询
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">今日任务数</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">256</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">进行中</p>
          <p className="mt-2 text-2xl font-semibold text-blue-600">48</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">已完成</p>
          <p className="mt-2 text-2xl font-semibold text-green-600">198</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">失败率</p>
          <p className="mt-2 text-2xl font-semibold text-red-600">3.9%</p>
        </div>
      </div>

      {!hasToken && <p className="text-sm text-gray-500">请先在首页设置 Admin Demo Token。</p>}
      {hasToken && isLoading && <p className="text-sm text-gray-500">正在加载任务列表...</p>}
      {hasToken && isError && (
        <p className="text-sm text-red-500">加载失败，请检查后端 /api/v1/admin/tasks 接口。</p>
      )}
      {hasToken && tasks && (!tasks.items || tasks.items.length === 0) && (
        <p className="text-sm text-gray-500">暂无任务数据。</p>
      )}
      {hasToken && tasks && tasks.items && tasks.items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white p-4 shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-3 py-2">任务 ID</th>
                <th className="px-3 py-2">项目 ID</th>
                <th className="px-3 py-2">Agent Key</th>
                <th className="px-3 py-2">状态</th>
                <th className="px-3 py-2">创建时间</th>
                <th className="px-3 py-2 text-right">操作</th>
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
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      task.status === TaskStatus.succeeded ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                      task.status === TaskStatus.running ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                      task.status === TaskStatus.pending ? 'bg-gray-50 text-gray-700 ring-gray-600/20' :
                      'bg-red-50 text-red-700 ring-red-600/20'
                    } ring-1 ring-inset`}>
                      {task.status === TaskStatus.succeeded ? '已完成' :
                       task.status === TaskStatus.running ? '进行中' :
                       task.status === TaskStatus.pending ? '待处理' :
                       task.status === TaskStatus.failed ? '失败' : task.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600">{task.createdAt}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                      >
                        详情
                      </button>
                      <button
                        type="button"
                        className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                      >
                        日志
                      </button>
                      {task.status === TaskStatus.running && (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900 text-xs font-medium"
                        >
                          取消
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 分页 */}
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-500">
              显示 <span className="font-medium">1</span> 到 <span className="font-medium">{Math.min(10, tasks.items.length)}</span> 条，共 <span className="font-medium">{tasks.total}</span> 条记录
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled
              >
                上一页
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

