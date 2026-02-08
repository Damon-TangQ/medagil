# api-service

Medagil 业务 API 服务：Go + Gin，采用 Clean Architecture / 六边形分层。**支持分布式部署与水平扩展**，用户量上升时可随时增加实例。

## API 设计

- **标准化 REST API**：遵循 REST 风格，支持 OpenAPI 3.x 协议
- **用户端 API**：`/api/v1/*`，鉴权为用户登录态，供 apps/web、apps/miniapp 调用
- **管理端 API**：`/api/v1/admin/*`，鉴权为 RBAC + 管理员 Token，供 apps/admin 调用
- **OpenAPI 文档**：构建后提供 `GET /openapi.json`，供前端自动生成对接代码

详见 `project/docs/API设计规范(MVP).md`。

## 可扩展性设计

- **无状态**：单实例不保存会话，任意实例可处理任意请求
- **会话外置**：登录态存 Redis，多实例共享
- **限流与缓存**：Redis 统一处理，避免单机本地状态
- **健康检查**：`/health` 供负载均衡探活
- **配置外置**：环境变量 / 配置中心，无硬编码

## 职责

- 用户与认证（微信/手机号登录、RBAC 用户数据）
- 项目与成果（项目 CRUD、成果库）
- 任务与对话（任务创建/状态/落库，调用 Dify 执行）
- 会员与订单（套餐、订单、微信支付回调）
- 积分（规则、流水、调整、统计）
- 内容与运营（技能审核、通知、反馈、模型配置、定时任务）
- 系统设置（管理员与角色、操作日志、参数、登录方式、外观）

## 分层

- `domain/` 领域层（entities, value_objects, interfaces）
- `use_cases/` 应用业务规则
- `adapters/` 控制器、仓储、外部网关实现
  - `adapters/controllers/user/` 用户端 handler（/api/v1/*）
  - `adapters/controllers/admin/` 管理端 handler（/api/v1/admin/*）
- `infra/` 配置、数据库连接、日志

## 运行

```bash
go mod tidy
go run ./cmd/server
```

默认监听 `:8080`，`GET /health` 健康检查，`GET /api/v1/ping` 占位。
