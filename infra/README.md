# Infra（基础设施与运维）

Medagil 平台的基础设施与运维配置目录，与 [project/docs/技术实现方案(MVP).md](../project/docs/技术实现方案(MVP).md) 第 6 节「基础设施与运维」对齐。

---

## 目录结构（规划）

```
infra/
├── README.md           # 本文件
├── docker/             # Docker 相关（MVP 阶段）
│   ├── docker-compose.yml      # 本地/开发环境编排
│   ├── docker-compose.prod.yml # 生产环境编排（可选）
│   └── .env.example            # 环境变量示例（不含真实密钥）
├── gateway/            # APISIX 网关配置
│   └── apisix/         # 路由、鉴权、限流、日志配置
└── monitoring/         # 监控与日志
    ├── prometheus/     # Prometheus 配置
    └── grafana/        # Grafana 仪表盘（可选）
```

MVP 阶段可保留占位目录，随开发进度逐步补充。

---

## 部署与编排

### Docker Compose 组件

| 组件 | 说明 |
|------|------|
| **PostgreSQL** | 用户、权限、订单、订阅、积分流水、系统配置 |
| **MongoDB** | 项目、任务/对话内容、成果库文档元数据 |
| **Redis** | 会话、限流、任务队列、热点缓存 |
| **api-service** | Go + Gin 主业务服务 |
| **ai-service** | Python + FastAPI 知识库与 AI 对接（uv 包管理，pyproject.toml + uv.lock） |
| **web** | Next.js 用户端 |
| **admin** | Next.js 管理端 |
| **网关** | APISIX 统一入口 |

### 部署方式

- **MVP**：Docker Compose 或单机多容器。
- **扩展**：可逐步迁移至 Kubernetes。

---

## 网关（APISIX）

- **职责**：统一入口、鉴权、限流、日志。
- **配置**：`gateway/apisix/` 下存放路由、插件、上游配置。
- 与自研后端的 `/api/v1/*`、`/api/v1/admin/*` 及 ai-service 路径对齐。

---

## 监控与日志

- **监控**：核心服务与 Dify 的可用性、API 耗时、错误率；可基于 Prometheus + Grafana 或云厂商监控。
- **日志与审计**：与「系统设置」中的操作日志、安全追溯一致，由自研后端落库与查询。

---

## 配置与密钥

- **禁止**在镜像或 Compose 文件中硬编码密钥（API Key、DB 密码、Token 等）。
- 使用环境变量或 Docker secrets 注入；`.env` 不提交，仅提供 `.env.example` 模板。
- 开发/测试/生产配置分离管理。

---

## 相关文档

- [技术实现方案(MVP)](../project/docs/技术实现方案(MVP).md) 第 6 节 — 基础设施与运维
- [项目结构说明(MVP)](../project/docs/项目结构说明(MVP).md) — infra 目录说明
