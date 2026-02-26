'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getKnowledgeSources } from '@medagil/api-client/admin';
import type { getKnowledgeSourcesResponse } from '@medagil/api-client/admin';

export default function KnowledgePage() {
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
  } = useQuery<getKnowledgeSourcesResponse>({
    queryKey: ['admin', 'knowledge', 'sources', 'list'],
    queryFn: () => getKnowledgeSources({ page: 1, pageSize: 20 }),
    enabled: hasToken,
  });

  const sources = response?.data;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">知识库管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            管理知识源与知识库，上传文档、配置分类与权限。
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            批量导入
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            上传文档
          </button>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-1">
              搜索知识源
            </label>
            <input
              type="text"
              id="search"
              placeholder="输入知识源名称或ID"
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="type-filter" className="block text-xs font-medium text-gray-700 mb-1">
              知识源类型
            </label>
            <select
              id="type-filter"
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option>全部类型</option>
              <option>文档</option>
              <option>网页</option>
              <option>数据库</option>
              <option>API</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              id="status-filter"
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option>全部状态</option>
              <option>已启用</option>
              <option>已禁用</option>
              <option>解析中</option>
              <option>解析失败</option>
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
          <p className="text-xs font-medium text-gray-500">知识源总数</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">128</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">文档总数</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">3,456</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">已解析</p>
          <p className="mt-2 text-2xl font-semibold text-green-600">3,200</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">存储占用</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">2.8 GB</p>
        </div>
      </div>

      {!hasToken && <p className="text-sm text-gray-500">请先在首页设置 Admin Demo Token。</p>}
      {hasToken && isLoading && <p className="text-sm text-gray-500">正在加载知识源列表...</p>}
      {hasToken && isError && (
        <p className="text-sm text-red-500">
          加载失败，请检查后端 /api/v1/admin/knowledge/sources 接口。
        </p>
      )}
      {hasToken && sources && (!sources.items || sources.items.length === 0) && (
        <p className="text-sm text-gray-500">暂无知识源数据。</p>
      )}
      {hasToken && sources && sources.items && sources.items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white p-4 shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-3 py-2">知识源 ID</th>
                <th className="px-3 py-2">名称</th>
                <th className="px-3 py-2">类型</th>
                <th className="px-3 py-2">状态</th>
                <th className="px-3 py-2">文档数</th>
                <th className="px-3 py-2">创建时间</th>
                <th className="px-3 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {sources.items.map((source) => (
                <tr key={source.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2 font-mono text-xs text-gray-700">{source.id}</td>
                  <td className="px-3 py-2 text-gray-800">{source.name}</td>
                  <td className="px-3 py-2 text-gray-700">{source.type}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      source.status === '已启用' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                      source.status === '解析中' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                      source.status === '已禁用' ? 'bg-gray-50 text-gray-700 ring-gray-600/20' :
                      'bg-red-50 text-red-700 ring-red-600/20'
                    } ring-1 ring-inset`}>
                      {source.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-700">128</td>
                  <td className="px-3 py-2 text-gray-600">{source.createdAt}</td>
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
                        编辑
                      </button>
                      {source.status === '已启用' ? (
                        <button
                          type="button"
                          className="text-gray-600 hover:text-gray-900 text-xs font-medium"
                        >
                          禁用
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="text-green-600 hover:text-green-900 text-xs font-medium"
                        >
                          启用
                        </button>
                      )}
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900 text-xs font-medium"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 分页 */}
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-500">
              显示 <span className="font-medium">1</span> 到 <span className="font-medium">{Math.min(10, sources.items.length)}</span> 条，共 <span className="font-medium">{sources.total}</span> 条记录
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

