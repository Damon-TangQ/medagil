# API 设计规范（MVP）

**文档类型：** 技术规范
**适用范围：** api-service 接口设计、OpenAPI、前后端对接
**对齐文档：** 《技术实现方案(MVP)》《项目结构说明(MVP)》

---

## 1. 基本原则

- **标准化 REST API**：遵循 REST 风格，资源导向、HTTP 动词语义清晰。
- **OpenAPI 协议**：所有接口以 OpenAPI 3.x 规范描述，支持自动生成前端对接代码。
- **用户端与管理端分离**：路径与鉴权机制区分，避免混用。

---

## 2. 接口分类与路径

| 分类           | 路径前缀         | 调用方                 | 鉴权机制                                    |
| -------------- | ---------------- | ---------------------- | ------------------------------------------- |
| **用户端 API** | `/api/v1/`       | apps/web、apps/miniapp | 用户登录态（JWT / 微信 openid/session_key） |
| **管理端 API** | `/api/v1/admin/` | apps/admin             | 管理员 RBAC + 管理员 Token                  |

**示例：**

- 用户端：`GET /api/v1/projects`、`POST /api/v1/tasks`、`GET /api/v1/me`
- 管理端：`GET /api/v1/admin/users`、`GET /api/v1/admin/dashboard/stats`、`PUT /api/v1/admin/orders/:id/refund`

**说明**：同一业务资源（如用户、订单）在用户端与管理端暴露不同字段与操作；管理端可读写全平台数据，用户端仅读写当前用户数据。

---

## 3. OpenAPI 规范

### 3.1 产出物

- **openapi.json**：api-service 构建时生成，可通过 `GET /openapi.json` 或静态文件提供。
- **规范版本**：OpenAPI 3.0.x。
- **标签（tags）**：路径按 `user`、`admin` 打标签，便于按端生成客户端。

### 3.2 实现方式（Go）

- 使用 **swaggo/swag** 等工具，在 Gin handler 上写注释生成 spec。
- 或手写 `openapi.yaml`，由 CI 校验与 api-service 实现一致。

### 3.3 与 ai-service 的关系

- ai-service 若提供 REST 接口，同样遵循 OpenAPI 规范。
- 用户端与管理端均可调用 ai-service 时，需明确鉴权与路径约定，可单独维护 `ai-service/openapi.json` 或合并到主 spec。

---

## 4. 前端自动生成对接（已采用 Orval）

### 4.1 工具与链路

**已确定采用 Orval**，在 `packages/api-client` 中配置，按 OpenAPI 的 tag 生成用户端与管理端两套客户端（含 React Query hooks + 请求函数）。

```
api-service 开发/变更接口
  → 同步 OpenAPI 到 packages/api-client/spec/openapi.yaml
  → 根目录执行 pnpm generate:api（或 cd packages/api-client && pnpm generate）
  → 生成 src/user/endpoints.ts、src/admin/endpoints.ts 及 model
  → web / miniapp 使用 @medagil/api-client/user，admin 使用 @medagil/api-client/admin
```

### 4.2 配置要点

- **orval.config.ts**：两个项目 `user`、`admin`，分别用 `input.filters.tags: ['user']` 与 `['admin']` 过滤。
- **client**：`react-query` + `httpClient: 'fetch'`，配合自定义 mutator 注入 baseUrl 与 `Authorization`。
- **mutator**：`src/mutator/use-custom-instance.ts`，各 app 通过 `setApiConfig({ baseUrl, getToken })` 注入鉴权。

### 4.3 按端使用

| 端               | 引入                               | 说明                                                       |
| ---------------- | ---------------------------------- | ---------------------------------------------------------- |
| **apps/web**     | `from '@medagil/api-client/user'`  | 使用 useGetMe、getProjects 等 React Query hooks 与请求函数 |
| **apps/admin**   | `from '@medagil/api-client/admin'` | 使用 useGetDashboardStats、getAdminUsers 等                |
| **apps/miniapp** | `from '@medagil/api-client/user'`  | 仅用请求函数（getMe、getProjects 等），配合 Mobx           |

### 4.4 目录与脚本

- **packages/api-client**：Orval 配置、spec、mutator、生成产物（user/admin endpoints + model）。
- **根目录**：`pnpm generate:api` 调用 `pnpm --filter @medagil/api-client generate`。
- **鉴权**：各 app 在 Providers 中调用 `setApiConfig({ baseUrl, getToken })`，getToken 返回当前用户/管理员 Token。

---

## 5. 鉴权与校验约定

### 5.1 用户端 API

- **鉴权**：`Authorization: Bearer <user_token>` 或 Cookie/Session（由网关或 api-service 约定）。
- **校验**：用户只能访问自己的资源（projects、tasks、orders 等按 user_id 过滤）。
- **未登录**：返回 401，前端跳转登录。

### 5.2 管理端 API

- **鉴权**：`Authorization: Bearer <admin_token>`（与用户 Token 区分）。
- **校验**：RBAC 校验角色与权限；操作记入系统日志。
- **未授权**：返回 401/403，前端跳转管理端登录或提示无权限。

---

## 6. 路径与项目结构约定（api-service）

```
api-service/
├── docs/                    # OpenAPI 产物（swag 生成）
│   └── openapi.json
├── adapters/
│   └── controllers/
│       ├── user/            # 用户端：/api/v1/users、/api/v1/me 等
│       └── admin/           # 管理端：/api/v1/admin/*
```

路由注册时明确区分：

- `router.Group("/api/v1")` + 用户端中间件 → 用户端 API
- `router.Group("/api/v1/admin")` + 管理端中间件 → 管理端 API

---

_本文档与《技术实现方案(MVP)》及《项目结构说明(MVP)》保持一致；OpenAPI 与生成工具的具体选型可在实现时再细化为技术方案补充。_
