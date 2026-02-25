'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: '/', label: '数据看板' },
  { href: '/users', label: '用户管理' },
  { href: '/tasks', label: '任务与对话' },
  { href: '/orders', label: '会员与订单' },
  { href: '/knowledge', label: '知识库管理' },
  { href: '/settings', label: '系统设置' },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Medagil 管理端</span>
        <span className="text-xs text-gray-500">MVP 后台 · Demo 环境</span>
      </header>
      <div className="flex">
        <aside className="hidden md:block w-56 border-r bg-white">
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'flex items-center rounded-md px-3 py-2 text-sm',
                    active
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 min-h-[calc(100vh-3rem)]">{children}</main>
      </div>
    </div>
  );
}

