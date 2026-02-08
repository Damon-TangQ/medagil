# Medagil · 医学科研写作 AI 智能体平台

**Medagil** 是覆盖医学科研全流程的 AI 智能体平台，助力临床医生、硕博研究生与科研人员高效完成论文写作、基金申请、课题设计等工作。

---

## 项目愿景与目标

- **愿景**：打造覆盖医学科研全流程的 AI 智能体平台。
- **MVP 目标**：验证 AI 智能体在论著写作、基金申请、毕业课题、科研工具四大场景的实用价值；后续逐步完善各场景智能体并扩展至科普写作等完整科研场景。
- **目标用户**：临床医生、住院/主治医师、医学院硕博研究生、科研人员。
- **技术方案**：Dify 云服务 + 自研后端 + 微信支付。

---

## 主要交付（MVP）

| 交付物             | 说明                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Web 用户端**     | 个人中心、搜索、项目管理、成果库、任务对话、导航与组织、会员与订阅                                                                                     |
| **Web 管理端**     | 数据看板、用户管理、任务与对话管理、项目与成果、会员与订单、积分、知识库管理、内容与运营、系统设置                                                     |
| **小程序端**       | 与 Web 用户端功能对齐的 7 大模块，支持微信登录、手机号、分享、微信支付                                                                                 |
| **9 个科研智能体** | 临床论著助手、基础论著助手、综述/范围综述助手、国自然面上/重点/专项基金助手、博士基础/临床研究课题助手、文献分析助手、智能选刊助手（均在 Dify 上编排） |

---

## 技术栈概览

| 层级           | 技术选型                                                              |
| -------------- | --------------------------------------------------------------------- |
| **AI 集成**    | Dify（工作流编排、多模型、流式输出）                                  |
| **向量数据库** | Zilliz（知识库与 RAG）                                                |
| **Web 前端**   | Next.js 14+、TypeScript、Radix UI、Tailwind CSS、Zustand、React Query |
| **小程序**     | Taro、TypeScript、Mobx、Taro UI、微信小程序                           |
| **业务后端**   | Go（Gin）：用户、项目、任务、订单、积分、内容与运营、系统设置         |
| **AI 侧服务**  | Python（FastAPI）：知识库、Dify/向量检索对接                          |
| **数据存储**   | PostgreSQL、MongoDB、Redis、Zilliz；文件采用对象存储                  |
| **网关**       | APISIX（路由、鉴权、限流）                                            |
| **支付**       | 微信支付                                                              |

---

## 仓库结构

```
Medagil/
├── README.md
├── package.json              # 根 workspace 脚本（如 generate:api）
├── pnpm-workspace.yaml       # pnpm 工作区：apps/*、packages/*
├── project/                  # 产品与项目文档
│   ├── docs/                 # 技术方案、功能清单、智能体概况、API 设计规范等
│   └── plan/                 # 开发排期
├── apps/                     # 前端应用（三端独立）
│   ├── web/                  # Next.js：用户端
│   ├── admin/                # Next.js：管理端
│   └── miniapp/              # Taro：小程序端
├── services/                 # 后端服务
│   ├── api-service/          # Go + Gin：业务 API，REST + OpenAPI，用户端/管理端分离
│   └── ai-service/           # Python + FastAPI：知识库与 Dify/向量检索
├── packages/                 # 共享包
│   ├── api-types/            # 前后端共享 TypeScript 类型（DTO、枚举等）
│   └── api-client/           # Orval 根据 OpenAPI 生成的 API 客户端（user + admin）
├── infra/                    # 运维与部署（Docker、网关等，MVP 可后续补充）
├── .krio/                    # Krio IDE 配置（agents、commands、contexts、rules、skills）
├── .trae/                    # Trae 配置（agents、commands、contexts、rules、skills、hooks）
├── .agents/                  # 其他 AI 工具的 skills（如 api-design-principles）
├── .cursor/                  # Cursor 配置（rules、skills、agents、commands 等）
├── .cursorignore
├── .gitignore
├── .editorconfig
├── .prettierrc
└── .prettierignore
```

后端采用 **Clean Architecture / 六边形架构**：领域层（domain）→ 用例层（use_cases）→ 适配器层（adapters）→ 基础设施（infra），依赖向内，便于测试与扩展。详见 `project/docs/项目结构说明(MVP).md`。

---

## 快速开始

### 依赖要求

- **Node.js** 18+
- **Go** 1.21+
- **Python** 3.10+、**uv**（Python 包管理，<https://docs.astral.sh/uv/>）
- **pnpm** 或 **npm**（前端）

### Web 用户端

```bash
cd apps/web
pnpm install
pnpm dev       # http://localhost:3000
```

### Web 管理端

```bash
cd apps/admin
pnpm install
pnpm dev       # http://localhost:3001
```

### 小程序端

```bash
cd apps/miniapp
pnpm install
pnpm dev:weapp # 微信开发者工具打开 dist 目录
```

### 业务 API（Go）

```bash
cd services/api-service
go mod tidy
go run ./cmd/server
# 默认 http://localhost:8080，/health、/api/v1/ping
```

### AI 服务（Python）

```bash
cd services/ai-service
uv sync
uvicorn main:app --reload --port 8000
# 默认 http://localhost:8000，/health、/api/v1/ping
```

需先安装 [uv](https://docs.astral.sh/uv/)（`curl -LsSf https://astral.sh/uv/install.sh | sh` 或 `pip install uv`）。

### 生成 API 客户端（Orval）

api-service 接口变更后，用 OpenAPI 规范重新生成前端对接代码：

```bash
pnpm install              # 根目录安装 workspace 依赖
pnpm generate:api         # 生成 packages/api-client（user + admin 两套）
```

详见 `packages/api-client/README.md` 与 `project/docs/API设计规范(MVP).md`。

### 代码格式与风格

- **TS/JS/CSS/MD**：`pnpm format`（Prettier）、`pnpm format:check`（仅检查）；配置见 `.prettierrc`、`.editorconfig`。
- **Go**：`cd services/api-service && go fmt ./...`
- **Python**：`cd services/ai-service && ruff format . && ruff check .`（开发依赖可 `uv add --dev ruff`）
- 包管理规范见 `.cursor/rules/common/package-management.mdc`。

---

## 文档索引

| 文档                                                                | 说明                                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------------- |
| [项目概况(MVP)](<project/docs/项目概况(MVP).md>)                    | 愿景、目标用户、主要交付、技术方案                            |
| [技术实现方案(MVP)](<project/docs/技术实现方案(MVP).md>)            | 架构概览、前后端技术栈、服务划分、数据存储、Dify/Zilliz、运维 |
| [项目结构说明(MVP)](<project/docs/项目结构说明(MVP).md>)            | 仓库目录约定、分层说明、与功能清单对应关系                    |
| [API 设计规范(MVP)](<project/docs/API设计规范(MVP).md>)             | REST API、OpenAPI、用户端/管理端分离、前端自动生成对接        |
| [Web 用户端功能清单](<project/docs/web/web用户端功能清单(MVP).md>)  | 用户端 7 大模块需求                                           |
| [管理端功能清单](<project/docs/admin/管理端功能清单(MVP).md>)       | 管理端 9 大模块需求                                           |
| [小程序端功能清单](<project/docs/miniapp/小程序端功能清单(MVP).md>) | 小程序 7 大模块需求                                           |
| [智能体概况(MVP)](<project/docs/智能体概况(MVP).md>)                | 9 个智能体能力与验收标准                                      |

---

## 许可证与贡献

MVP 阶段为内部/闭源项目；许可证与贡献方式以团队约定为准。

---

_Medagil — 让医学科研写作更高效。_
