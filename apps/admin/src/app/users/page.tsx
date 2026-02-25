'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAdminUsers } from '@medagil/api-client/admin';
import type { AdminUserListResponse } from '@medagil/api-client/admin';

export default function UsersPage() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('admin_token');
    setHasToken(Boolean(token));
  }, []);

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery<AdminUserListResponse>({
    queryKey: ['admin', 'users', 'list'],
    queryFn: () => getAdminUsers({ page: 1, pageSize: 20 }),
    enabled: hasToken,
  });

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">用户管理</h1>
        <p className="mt-1 text-sm text-gray-600">
          查看平台用户列表，后续可扩展检索、详情、禁用与积分调整等操作。
        </p>
      </div>

      {!hasToken && <p className="text-sm text-gray-500">请先在首页设置 Admin Demo Token。</p>}
      {hasToken && isLoading && <p className="text-sm text-gray-500">正在加载用户列表...</p>}
      {hasToken && isError && (
        <p className="text-sm text-red-500">加载失败，请检查后端 /api/v1/admin/users 接口。</p>
      )}
      {hasToken && users && users.items.length === 0 && (
        <p className="text-sm text-gray-500">暂无用户数据。</p>
      )}
      {hasToken && users && users.items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white p-4 shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-3 py-2">用户 ID</th>
                <th className="px-3 py-2">昵称</th>
                <th className="px-3 py-2">邮箱</th>
                <th className="px-3 py-2">套餐</th>
                <th className="px-3 py-2 text-right">积分</th>
              </tr>
            </thead>
            <tbody>
              {users.items.map((user) => (
                <tr key={user.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2 font-mono text-xs text-gray-700">{user.id}</td>
                  <td className="px-3 py-2 text-gray-800">{user.nickname ?? '—'}</td>
                  <td className="px-3 py-2 text-gray-600">{user.email ?? '—'}</td>
                  <td className="px-3 py-2 text-gray-700 capitalize">{user.plan}</td>
                  <td className="px-3 py-2 text-right text-gray-800">{user.credits ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

