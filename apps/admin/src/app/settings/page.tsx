'use client';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">系统设置</h1>
          <p className="mt-1 text-sm text-gray-600">
            管理系统参数、权限配置与品牌外观设置。
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          保存设置
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 管理员与角色权限 */}
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">管理员与角色权限（RBAC）</h2>
            <button
              type="button"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-900"
            >
              管理角色
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">超级管理员</p>
                <p className="text-xs text-gray-500">拥有所有权限</p>
              </div>
              <span className="text-xs text-gray-500">2 人</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">运营管理员</p>
                <p className="text-xs text-gray-500">用户、订单、数据查看</p>
              </div>
              <span className="text-xs text-gray-500">5 人</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">内容管理员</p>
                <p className="text-xs text-gray-500">知识库、任务管理</p>
              </div>
              <span className="text-xs text-gray-500">3 人</span>
            </div>
          </div>
        </section>

        {/* 系统参数与密钥管理 */}
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">系统参数与密钥管理</h2>
            <button
              type="button"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-900"
            >
              编辑配置
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">OpenAI API Key</p>
                <p className="text-xs text-gray-500">用于 AI 对话功能</p>
              </div>
              <span className="text-xs text-gray-500">sk-**** **** **** ****</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">OSS 存储配置</p>
                <p className="text-xs text-gray-500">文件上传与存储</p>
              </div>
              <span className="text-xs text-green-600">已配置</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">数据库连接</p>
                <p className="text-xs text-gray-500">主数据库连接状态</p>
              </div>
              <span className="text-xs text-green-600">正常</span>
            </div>
          </div>
        </section>

        {/* 登录方式管理 */}
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">登录方式管理</h2>
            <button
              type="button"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-900"
            >
              配置登录
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">微信登录</p>
                <p className="text-xs text-gray-500">微信扫码登录</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                已启用
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">手机号登录</p>
                <p className="text-xs text-gray-500">短信验证码登录</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                已启用
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">邮箱登录</p>
                <p className="text-xs text-gray-500">邮箱密码登录</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                已禁用
              </span>
            </div>
          </div>
        </section>

        {/* 外观与品牌设置 */}
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">外观与品牌设置</h2>
            <button
              type="button"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-900"
            >
              编辑外观
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">系统 Logo</p>
                <p className="text-xs text-gray-500">品牌标识</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-indigo-600"></div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">主题色</p>
                <p className="text-xs text-gray-500">主色调</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-indigo-600 ring-2 ring-offset-2 ring-indigo-600"></div>
                <span className="text-xs text-gray-500">#4F46E5</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">深色模式</p>
                <p className="text-xs text-gray-500">界面主题风格</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                未启用
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

