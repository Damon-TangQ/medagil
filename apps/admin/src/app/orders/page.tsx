'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAdminOrders } from '@medagil/api-client/admin';
import type { getAdminOrdersResponse } from '@medagil/api-client/admin';

export default function OrdersPage() {
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
  } = useQuery<getAdminOrdersResponse>({
    queryKey: ['admin', 'orders', 'list'],
    queryFn: () => getAdminOrders({ page: 1, pageSize: 20 }),
    enabled: hasToken,
  });

  const orders = response?.data;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">会员与订单管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            查看订阅订单流水，管理退款、收入统计与促销活动。
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            导出报表
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            创建订单
          </button>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-1">
              搜索订单
            </label>
            <input
              type="text"
              id="search"
              placeholder="输入订单ID或用户ID"
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1">
              订单状态
            </label>
            <select
              id="status-filter"
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option>全部状态</option>
              <option>待支付</option>
              <option>已支付</option>
              <option>已取消</option>
              <option>已退款</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label htmlFor="date-range" className="block text-xs font-medium text-gray-700 mb-1">
              创建时间
            </label>
            <input
              type="date"
              id="date-range"
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
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
          <p className="text-xs font-medium text-gray-500">今日订单数</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">128</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">今日收入</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">¥ 12,580</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">本月订单数</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">3,456</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">本月收入</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">¥ 358,900</p>
        </div>
      </div>

      {!hasToken && <p className="text-sm text-gray-500">请先在首页设置 Admin Demo Token。</p>}
      {hasToken && isLoading && <p className="text-sm text-gray-500">正在加载订单列表...</p>}
      {hasToken && isError && (
        <p className="text-sm text-red-500">加载失败，请检查后端 /api/v1/admin/orders 接口。</p>
      )}
      {hasToken && orders && (!orders.items || orders.items.length === 0) && (
        <p className="text-sm text-gray-500">暂无订单数据。</p>
      )}
      {hasToken && orders && orders.items && orders.items.length > 0 && (
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
                <th className="px-3 py-2 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.items.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2 font-mono text-xs text-gray-700">{order.id}</td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-600">{order.userId}</td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-600">{order.planId}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      order.status === '已支付' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                      order.status === '待支付' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                      order.status === '已取消' ? 'bg-gray-50 text-gray-700 ring-gray-600/20' :
                      'bg-red-50 text-red-700 ring-red-600/20'
                    } ring-1 ring-inset`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-gray-800">
                    {order.amountCents !== undefined && order.amountCents !== null
                      ? order.amountCents.toLocaleString('zh-CN')
                      : '—'}
                  </td>
                  <td className="px-3 py-2 text-gray-600">{order.createdAt}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                      >
                        详情
                      </button>
                      {order.status === '已支付' && (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900 text-xs font-medium"
                        >
                          退款
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
              显示 <span className="font-medium">1</span> 到 <span className="font-medium">{Math.min(10, orders.items.length)}</span> 条，共 <span className="font-medium">{orders.total}</span> 条记录
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

