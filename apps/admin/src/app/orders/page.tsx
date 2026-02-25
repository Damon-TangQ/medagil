'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAdminOrders } from '@medagil/api-client/admin';
import type { AdminOrderListResponse } from '@medagil/api-client/admin/model';

export default function OrdersPage() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('admin_token');
    setHasToken(Boolean(token));
  }, []);

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery<AdminOrderListResponse>({
    queryKey: ['admin', 'orders', 'list'],
    queryFn: () => getAdminOrders({ page: 1, pageSize: 20 }),
    enabled: hasToken,
  });

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">会员与订单管理</h1>
        <p className="mt-1 text-sm text-gray-600">
          查看订阅订单流水，后续可扩展退款操作、收入统计与促销活动配置。
        </p>
      </div>

      {!hasToken && <p className="text-sm text-gray-500">请先在首页设置 Admin Demo Token。</p>}
      {hasToken && isLoading && <p className="text-sm text-gray-500">正在加载订单列表...</p>}
      {hasToken && isError && (
        <p className="text-sm text-red-500">加载失败，请检查后端 /api/v1/admin/orders 接口。</p>
      )}
      {hasToken && orders && orders.items.length === 0 && (
        <p className="text-sm text-gray-500">暂无订单数据。</p>
      )}
      {hasToken && orders && orders.items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white p-4 shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-3 py-2">订单 ID</th>
                <th className="px-3 py-2">用户 ID</th>
                <th className="px-3 py-2">套餐 ID</th>
                <th className="px-3 py-2">状态</th>
                <th className="px-3 py-2 text-right">金额（分）</th>
                <th className="px-3 py-2">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {orders.items.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2 font-mono text-xs text-gray-700">{order.id}</td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-600">{order.userId}</td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-600">{order.planId}</td>
                  <td className="px-3 py-2 text-gray-700">{order.status}</td>
                  <td className="px-3 py-2 text-right text-gray-800">
                    {order.amountCents.toLocaleString('zh-CN')}
                  </td>
                  <td className="px-3 py-2 text-gray-600">{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

