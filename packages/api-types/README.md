# @medagil/api-types

前后端共享的 **API 契约类型**，供 `apps/web`、`apps/miniapp` 与后端约定保持一致时使用。

## 一般放什么？

| 类型 | 示例 | 用途 |
|------|------|------|
| **请求/响应 DTO** | `CreateProjectRequest`、`ProjectResponse` | 接口入参、出参结构 |
| **枚举** | `SubscriptionPlan`、`TaskStatus`、`OrderStatus` | 状态、类型等固定取值 |
| **分页** | `PageResult<T>`、`PaginationParams` | 列表接口的分页结构 |
| **错误响应** | `ApiError`、`ValidationError` | 统一错误格式 |
| **用户/业务实体** | `UserProfile`、`ProjectSummary` | 跨端复用的业务数据结构 |

## 约定

- 后端（Go）不直接引用此包，但需与这里的类型**语义一致**
- 前端（Web、小程序）将该包作为依赖，用于请求/响应类型、表单校验、状态枚举等
- 新增或修改类型时，需与后端接口文档同步
