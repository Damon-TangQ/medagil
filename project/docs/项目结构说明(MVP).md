# 项目结构说明（MVP）

**文档类型：** 架构文档
**适用范围：** Medagil 代码仓库目录与分层约定
**对齐文档：** 《技术实现方案(MVP)》、三端功能清单与技术实现方案

---

## 1. 设计原则

- **前后端分离**：Web/小程序/管理端为前端应用，自研后端提供统一 API。
- **Clean Architecture / 六边形**：后端按「领域 → 用例 → 适配器 → 基础设施」分层，依赖向内；端口（接口）与适配器（实现）分离，便于测试与替换。
- **三端与后端对应**：用户端、管理端、小程序为**三个独立应用**；用户端与管理端技术栈相同（Next.js、TypeScript、Radix UI、Tailwind 等），但代码分离便于维护；Go 负责主业务，Python 负责知识库与 AI 对接。

---

## 2. 根目录结构概览

```
Medagil/
├── .cursor/                      # Cursor 规则配置
│   ├── skills/                   # Cursor 技能配置
│   └── rules/                    # Cursor 规则
├── project/                      # 产品与项目文档（需求、方案、排期）
│   ├── docs/                     # 技术方案、功能清单、智能体概况等
│   └── plan/                     # 开发排期等
├── apps/                         # 前端应用（三端独立）
│   ├── web/                      # Next.js：用户端
│   ├── admin/                    # Next.js：管理端
│   └── miniapp/                  # Taro：小程序端
├── services/                     # 后端服务
│   ├── api-service/              # Go + Gin：用户、项目、任务、订单、积分、内容与运营、系统设置；REST + OpenAPI
│   └── ai-service/              # Python + FastAPI：知识库、Dify/向量检索对接
├── packages/                     # 跨应用共享包
│   ├── api-types/                # 手写/共享类型（DTO、枚举等）
│   └── api-client/               # 由 api-service OpenAPI 自动生成的 API 客户端
│── infra/                        # 运维与部署（Docker、网关,日志监控等配置等
│   ├── docker/                   # Docker 相关（MVP 阶段）
│   ├── gateway/                  # APISIX 网关配置
│   ├── monitoring/               # Prometheus、Grafana 等监控与日志配置
│   └── logging/                  # 日志配置
├── tests/                        # 测试用例
├── db/
├── .gitignore                    # Git 忽略文件
├── pnpm-workspace.yaml           # pnpm 工作区配置
├── pnpm-lock.yaml                # pnpm 锁定文件
├── .prettierignore               # Prettier 忽略文件
├── .prettierrc                   # Prettier 配置
├── .editorconfig                 # EditorConfig 配置
├── README.md                     # 本文件





```

---

## 3. 应用层：apps/

### 3.1 apps/web（Next.js 用户端）

- **技术栈**：Next.js 14+、TypeScript、Radix UI、Tailwind CSS、Zustand、React Query。
- **功能**：个人中心、搜索、项目管理、成果库、任务对话、导航与组织、会员与订阅。
- **与后端**：调用 `services/api-service` 与 `services/ai-service` 的 API；任务流式输出可直连 Dify 或经后端转发。

### 3.2 apps/admin（Next.js 管理端）

- **技术栈**：与用户端相同（Next.js、TypeScript、Radix UI、Tailwind CSS、Zustand、React Query）。
- **功能**：数据看板、用户管理、任务与对话管理、项目与成果、会员与订单、积分、知识库管理、内容与运营、系统设置；受 RBAC 控制。
- **与后端**：调用 `services/api-service` 与 `services/ai-service` 的 API。

### 3.3 apps/miniapp（Taro 微信小程序）

- **技术栈**：Taro、TypeScript、Mobx、Taro UI。
- **功能**：与 Web 用户端功能对齐（7 大模块），端能力包括微信登录、手机号、分享、微信支付。
- **与后端**：与 Web 用户端共用同一套业务 API。

---

## 4. 服务层：services/（分层架构）

### 4.1 services/api-service（Go + Gin）

采用 **Clean Architecture / 六边形** 分层，技术栈与《技术实现方案(MVP)》一致。

```
api-service/
├── cmd/                    # 入口
│   └── server/
│       └── main.go
├── domain/                 # 领域层（向内依赖）
│   ├── entities/           # 实体
│   ├── value_objects/      # 值对象
│   └── interfaces/         # 端口（如 UserRepository, PaymentGateway）
├── use_cases/              # 应用业务规则（用例）
├── adapters/               # 适配器（实现端口）
│   ├── repositories/       # 持久化实现（PostgreSQL、MongoDB、Redis）
│   ├── controllers/        # HTTP 控制器（Gin handlers）
│   │   ├── user/            # 用户端：/api/v1/*
│   │   └── admin/           # 管理端：/api/v1/admin/*
│   └── gateways/           # 外部服务（微信支付、Dify 调用等）
└── infra/                  # 框架与外部关注点
    ├── config/
    ├── database/
    └── logging/
```

- **职责**：用户与认证、项目与成果、任务与对话（创建/状态/落库）、会员与订单、积分、内容与运营、系统设置。
- **存储**：PostgreSQL（用户、权限、订单、订阅、积分流水、系统配置）、MongoDB（项目、任务/对话内容、成果库等）、Redis（会话、限流、缓存）。
- **API 设计**：标准化 REST API，支持 OpenAPI；用户端 `/api/v1/*` 与管理端 `/api/v1/admin/*` 分离，鉴权机制不同。详见 `project/docs/API设计规范(MVP).md`。

### 4.2 services/ai-service（Python + FastAPI）

同样采用 **领域 → 用例 → 适配器 → 基础设施** 分层。

```
ai-service/
├── app/
│   ├── domain/
│   │   ├── entities/
│   │   ├── value_objects/
│   │   └── interfaces/
│   ├── use_cases/
│   ├── adapters/
│   │   ├── repositories/
│   │   ├── controllers/    # FastAPI 路由
│   │   └── gateways/       # Dify、Zilliz 等
│   └── infra/
├── main.py
├── pyproject.toml
├── uv.lock
└── Dockerfile（可选）
```

- **职责**：知识库元数据、分类/标签、版本、权限；调用 Zilliz 做向量写入与检索；与 Dify 的对接（任务执行、流式等可由 api-service 转发或本服务转发）。

---

## 5. 共享包：packages/

- **packages/api-types**：手写或共享的 TypeScript 类型（DTO、枚举等），与后端约定一致。
- **packages/api-client**：由 api-service 的 OpenAPI 规范自动生成的 API 客户端；用户端（web、miniapp）与管理端（admin）按 tag/path 分别生成，鉴权由各 app 注入 Token。详见 `project/docs/API设计规范(MVP).md`。

---

## 6. 基础设施：infra/

- 放置 Docker Compose、APISIX 配置、监控与日志等；MVP 阶段可仅保留占位或简单 Dockerfile，与《技术实现方案(MVP)》第 6 节对齐后逐步补充。

---

## 7. 与功能清单的对应关系

| 功能清单/模块       | 前端实现                   | 后端实现                                       |
| ------------------- | -------------------------- | ---------------------------------------------- |
| Web 用户端 7 大模块 | apps/web                   | api-service + ai-service                       |
| 管理端 9 大模块     | apps/admin                 | api-service + ai-service                       |
| 小程序端 7 大模块   | apps/miniapp               | api-service + ai-service                       |
| 9 个智能体          | 前端调用 Dify / 经后端转发 | Dify 编排；api-service/ai-service 做鉴权与落库 |

---

_本文档与《技术实现方案(MVP)》及三端功能清单、技术实现方案保持一致，后续若有目录变更将同步更新。_
