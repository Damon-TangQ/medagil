'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getKnowledgeSources } from '@medagil/api-client/admin';
import type { KnowledgeSourceListResponse } from '@medagil/api-client/admin/model';

export default function KnowledgePage() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('admin_token');
    setHasToken(Boolean(token));
  }, []);

  const {
    data: sources,
    isLoading,
    isError,
  } = useQuery<KnowledgeSourceListResponse>({
    queryKey: ['admin', 'knowledge', 'sources', 'list'],
    queryFn: () => getKnowledgeSources({ page: 1, pageSize: 20 }),
    enabled: hasToken,
  });

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">知识库管理</h1>
        <p className="mt-1 text-sm text-gray-600">
          管理知识源与知识库，后续可扩展上传解析、分类标签、版本控制与访问权限配置。
        </p>
      </div>

      {!hasToken && <p className="text-sm text-gray-500">请先在首页设置 Admin Demo Token。</p>}
      {hasToken && isLoading && <p className="text-sm text-gray-500">正在加载知识源列表...</p>}
      {hasToken && isError && (
        <p className="text-sm text-red-500">
          加载失败，请检查后端 /api/v1/admin/knowledge/sources 接口。
        </p>
      )}
      {hasToken && sources && sources.items.length === 0 && (
        <p className="text-sm text-gray-500">暂无知识源数据。</p>
      )}
      {hasToken && sources && sources.items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white p-4 shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-3 py-2">知识源 ID</th>
                <th className="px-3 py-2">名称</th>
                <th className="px-3 py-2">类型</th>
                <th className="px-3 py-2">状态</th>
                <th className="px-3 py-2">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {sources.items.map((source) => (
                <tr key={source.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2 font-mono text-xs text-gray-700">{source.id}</td>
                  <td className="px-3 py-2 text-gray-800">{source.name}</td>
                  <td className="px-3 py-2 text-gray-700">{source.type}</td>
                  <td className="px-3 py-2 text-gray-700">{source.status}</td>
                  <td className="px-3 py-2 text-gray-600">{source.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

