'use client';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">系统设置</h1>
        <p className="mt-1 text-sm text-gray-600">
          管理管理员与角色权限、系统参数、登录方式与品牌外观。当前为页面骨架，后续可按文档逐步接入具体表单与接口。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">管理员与角色权限（RBAC）</h2>
          <p className="text-xs text-gray-600">
            规划角色列表与权限树展示区域，未来接入角色 CRUD 与权限勾选保存接口。
          </p>
        </section>

        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">系统参数与密钥管理</h2>
          <p className="text-xs text-gray-600">
            预留系统参数配置表单位置，如第三方 API 密钥、存储配置等，注意敏感信息脱敏显示。
          </p>
        </section>

        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">登录方式管理</h2>
          <p className="text-xs text-gray-600">
            预留微信授权、手机号登录等开关配置区域，与前台登录流程联动。
          </p>
        </section>

        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">外观与品牌设置</h2>
          <p className="text-xs text-gray-600">
            预留 Logo 上传、主题色选择等配置区域，与整体 UI 风格保持一致。
          </p>
        </section>
      </div>
    </div>
  );
}

