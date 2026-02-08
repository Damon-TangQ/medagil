# @medagil/api-client

由 **Orval** 根据 api-service 的 OpenAPI 规范自动生成的 TypeScript API 客户端，用户端与管理端分离。

## 使用链路

```
1. api-service 开发/变更接口
2. 更新 spec：将 api-service 的 openapi.json 同步到 spec/openapi.yaml（或由 swag 生成后复制）
3. 在仓库根目录执行：pnpm generate:api
   或在本包下执行：pnpm install && pnpm generate
4. 生成产物：src/user/endpoints.ts、src/admin/endpoints.ts 及对应 model
5. apps/web、apps/miniapp 使用 @medagil/api-client/user；apps/admin 使用 @medagil/api-client/admin
```

## 按端使用

| 端 | 引入 | 说明 |
|----|------|------|
| **apps/web** | `import { useGetMe, getProjects, ... } from '@medagil/api-client/user'` | 用户端 React Query hooks + 请求函数 |
| **apps/admin** | `import { useGetDashboardStats, getAdminUsers, ... } from '@medagil/api-client/admin'` | 管理端 React Query hooks + 请求函数 |
| **apps/miniapp** | `import { getMe, getProjects, ... } from '@medagil/api-client/user'` | 仅用请求函数（配合 Mobx 等） |

## 鉴权与 baseUrl

各 app 在启动时调用 `setApiConfig`（已在 web/admin 的 `providers.tsx` 中接入）：

```ts
import { setApiConfig } from '@medagil/api-client';

setApiConfig({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
  getToken: () => localStorage.getItem('user_token'), // 或 admin_token
});
```

## 配置说明

- **orval.config.ts**：两个 Orval 项目 `user`、`admin`，分别按 tag `user`、`admin` 过滤 OpenAPI 路径
- **spec/openapi.yaml**：基线 OpenAPI，与 api-service 约定一致；接口变更后需同步
- **mutator**：`src/mutator/use-custom-instance.ts` 提供统一 fetch + 注入 Token，供生成代码使用

## 首次生成

当前仓库内为占位实现，正式生成需执行：

```bash
cd packages/api-client
pnpm install
pnpm generate
```

生成后会覆盖 `src/user/endpoints.ts`、`src/admin/endpoints.ts` 及 `src/*/model/`，得到完整类型与 React Query hooks。
