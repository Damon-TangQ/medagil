import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Shell } from './shell';

export const metadata: Metadata = {
  title: "Medagil 管理端 | 医学科研写作 AI 智能体平台",
  description: "平台管理后台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
