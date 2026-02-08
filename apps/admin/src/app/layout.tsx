import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
          <header className="border-b bg-white px-4 py-3">
            <span className="font-semibold text-gray-800">Medagil 管理端</span>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
