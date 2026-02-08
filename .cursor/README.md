# .cursor 能力总览与使用说明

本目录为 Cursor IDE 的**项目级配置**，包含五类能力：**agents**、**commands**、**contexts**、**rules**、**skills**。下文列出全部能力与使用方式。

---

## 其他 IDE 规范目录（已跳过检索）

项目中存在其他 IDE / 工具的规范目录，与 `.cursor/` 功能类似但格式不同，**已在根目录 `.cursorignore` 中配置跳过**，避免被 Cursor 的语义检索、@ 引用、Agent 读取，从而减少混淆、提高结果质量。

| 被忽略目录   | 对应 .cursor 能力 | 说明                                                     |
| ------------ | ----------------- | -------------------------------------------------------- |
| **.krio/**   | 同 .cursor        | Krio IDE 的 agents、commands、contexts、rules、skills    |
| **.trae/**   | 同 .cursor        | Trae 的 agents、commands、contexts、rules、skills、hooks |
| **.agents/** | .cursor/skills    | 其他 AI 工具的 skills（如 api-design-principles）        |
| **.github/** | -                 | GitHub Copilot / Codacy 等 AI 指令                       |
| **.codacy/** | -                 | Codacy 规则与配置                                        |

**使用 Cursor 时**：请以 `.cursor/` 下的 agents、commands、contexts、rules、skills 为准；不要引用 `.krio`、`.trae`、`.agents` 中的配置。

---

## 目录结构一览

```
.cursor/
├── README.md           # 本文件
├── agents/             # 子智能体（专家角色）
├── commands/           # 自定义斜杠命令
├── contexts/           # 上下文预设（工作模式）
├── rules/              # 规则（通用 + 子项目）
│   ├── common/         # 通用规则
│   └── projects/       # 按技术栈生效的规则
└── skills/             # 技能（专项能力库）
```

---

## 1. agents（子智能体 / 专家角色）

**路径**：`.cursor/agents/`
**作用**：定义具有特定专长的 AI 子角色，用于复杂任务或专项工作。
**使用方式**：在 Composer/Agent 中通过 `@agent名` 引用，或通过对应 command（如 `/plan`）间接调用。

| Agent                    | 说明                         | 典型用法                              |
| ------------------------ | ---------------------------- | ------------------------------------- |
| **architect**            | 系统设计、可扩展性与技术决策 | 新功能规划、大系统重构、架构决策      |
| **planner**              | 复杂功能与重构的规划         | 实现功能、架构变更前先出计划          |
| **tdd-guide**            | TDD 专家，先写测试再实现     | 新功能、修 bug、重构，80%+ 覆盖率     |
| **code-reviewer**        | 代码审查，质量与安全         | 代码修改后立即审查                    |
| **security-reviewer**    | 安全漏洞检测与修复           | 用户输入、认证、API、敏感数据相关代码 |
| **build-error-resolver** | 构建与 TypeScript 错误排查   | 构建失败、类型错误时最小改动修复      |
| **e2e-runner**           | Playwright E2E 测试          | 生成/维护/运行 E2E，截图/视频/追踪    |
| **doc-updater**          | 文档与代码地图               | 更新 codemaps、README、指南           |
| **refactor-cleaner**     | 死代码清理与重构             | knip/depcheck/ts-prune 识别并安全移除 |

---

## 2. commands（自定义斜杠命令）

**路径**：`.cursor/commands/`
**作用**：以 `/` 开头的自定义命令，选择后加载对应 `.md` 内容作为 AI 指令执行。
**使用方式**：在 Composer/Agent 输入框输入 `/`，从列表中选择命令。

| 命令                 | 说明                                                          |
| -------------------- | ------------------------------------------------------------- |
| **/plan**            | 复述需求、评估风险、制定分步实施计划；获得用户确认前不写代码  |
| **/tdd**             | 强制 TDD：先定义接口、写失败测试，再实现最小代码，80%+ 覆盖率 |
| **/code-review**     | 对未提交变更进行安全与质量审查                                |
| **/verify**          | 对当前代码库执行构建、类型、lint、测试等全面验证              |
| **/build-fix**       | 逐步修复 TypeScript 与构建错误                                |
| **/e2e**             | 使用 Playwright 生成并运行 E2E 测试，记录截图/视频/追踪       |
| **/refactor-clean**  | 安全识别并移除死代码，配合测试验证                            |
| **/test-coverage**   | 分析测试覆盖率并生成缺失测试                                  |
| **/update-docs**     | 按项目配置同步更新文档                                        |
| **/update-codemaps** | 分析代码库结构并更新架构文档（codemaps）                      |
| **/eval**            | 管理 EDD 评估流程（define/check/report/list）                 |
| **/learn**           | 从当前会话中提取可复用模式并保存为技能                        |
| **/checkpoint**      | 在工作流中创建或验证检查点                                    |
| **/orchestrate**     | 编排多步骤智能体工作流（planner→tdd→review→security）         |
| **/setup-pm**        | 配置项目或全局的包管理器（npm/pnpm/yarn/bun）                 |

---

## 3. contexts（上下文预设）

**路径**：`.cursor/contexts/`
**作用**：定义不同工作模式下的行为侧重（实现优先 / 调研优先 / 审查优先）。
**使用方式**：在对话中通过 `@contexts/文件名` 引用（如 `@contexts/dev`），或由 rules 在特定场景注入。

| Context      | 模式     | 焦点                                     |
| ------------ | -------- | ---------------------------------------- |
| **dev**      | 开发模式 | 先写代码后说明，优先可运行方案，原子提交 |
| **research** | 调研模式 | 先理解再行动，多读少写，结论先行         |
| **review**   | 审查模式 | 质量、安全、可维护性，按严重程度输出     |

---

## 4. rules（规则）

**路径**：`.cursor/rules/common/`、`.cursor/rules/projects/`
**作用**：约束 AI 行为与项目规范；部分始终生效，部分按打开的文件类型（globs）生效。
**使用方式**：由 Cursor 自动加载，无需手动触发。编辑对应 `.mdc` 即可调整规范。

### 4.1 通用规则（common/）

| 规则文件                  | 说明                                                     | 生效方式                |
| ------------------------- | -------------------------------------------------------- | ----------------------- |
| **general**               | 通用规范总览，引用所有规则与团队协同约定                 | 始终                    |
| **project-structure**     | 项目结构、monorepo、文档与目录约定                       | 始终                    |
| **skill-usage**           | 技能使用规则：何时调用 skills，调用前先读 SKILL.md       | 始终                    |
| **code-style-formatting** | 代码风格与格式（EditorConfig、Prettier、go fmt、Python） | 始终                    |
| **package-management**    | 包管理（pnpm、Go modules、uv）                           | 始终                    |
| **document**              | 文档与注释规范（项目文档、代码注释、README）             | 始终                    |
| **git**                   | Git 提交与协作规范                                       | 始终                    |
| **security**              | 安全规范（密钥、输入、鉴权、敏感数据）                   | 始终                    |
| **testing**               | 测试规范（单元、集成、E2E 与目录约定）                   | 始终                    |
| **typescript**            | TypeScript 规范（不可变、错误处理、校验、文件组织）      | `**/*.ts,**/*.tsx`      |
| **react**                 | React 开发规范（组件、Hooks、样式、API 客户端）          | apps/web、admin 的 .tsx |
| **performance**           | 性能优化（前端与接口）                                   | apps、packages          |
| **accessibility-i18n**    | 可访问性与国际化                                         | apps                    |
| **api-integration**       | API 集成与客户端使用（api-client 按端引入）              | apps、api-client        |
| **state-management**      | 状态管理（React Query、Zustand、Mobx）                   | apps                    |
| **patterns**              | 通用模式（API 响应、Repository、Hooks）                  | .ts/.tsx/.go/.py        |
| **packages**              | 共享包约定（api-types、api-client）                      | packages                |
| **database**              | 数据库脚本、迁移与 schema                                | db、services 相关路径   |
| **infra**                 | 运维与部署（Docker、网关、监控、密钥）                   | infra、Dockerfile 等    |

### 4.2 子项目规则（projects/）

| 规则文件   | 说明                                        | 生效范围                      |
| ---------- | ------------------------------------------- | ----------------------------- |
| **go**     | api-service（Go + Gin）分层与 OpenAPI 同步  | services/api-service/\*_/_.go |
| **python** | ai-service（Python + FastAPI）分层与 uv     | services/ai-service/\*_/_.py  |
| **nextjs** | apps/web、apps/admin（Next.js、api-client） | apps/web、apps/admin          |
| **taro**   | apps/miniapp（Taro、Mobx、api-client/user） | apps/miniapp/\*_/_.ts,\*.tsx  |

---

## 5. skills（技能）

**路径**：`.cursor/skills/`
**作用**：可复用的专项能力（架构、安全、TDD 等）；相关任务触发时 AI 应**先读取对应 SKILL.md** 再执行。
**使用方式**：由 [rules/common/skill-usage.mdc](rules/common/skill-usage.mdc) 约定触发条件；AI 按条件匹配后读取 `skills/<名>/SKILL.md` 并遵循其中步骤。

| 技能                           | 说明                                 | 触发场景                    |
| ------------------------------ | ------------------------------------ | --------------------------- |
| **architecture-patterns**      | Clean Architecture、六边形、DDD      | 设计/重构后端、拆分微服务   |
| **backend-patterns**           | Node/Express/Next.js API、数据库优化 | 后端 API 设计、服务端实践   |
| **clickhouse-io**              | ClickHouse、OLAP、查询优化           | 使用 ClickHouse、分析型数据 |
| **coding-standards**           | TS/JS/React 编码规范与模式           | 通用编码与命名、错误处理    |
| **continuous-learning**        | 从会话提取可复用模式保存为技能       | 会话结束由 hook 等触发      |
| **eval-harness**               | EDD 评估框架（先定义预期、追踪回归） | 定义/运行评估、EDD 流程     |
| **frontend-patterns**          | React/Next.js、状态、性能、UI        | 前端组件与页面开发          |
| **project-guidelines-example** | 项目技能模板示例                     | 创建新项目技能时参考        |
| **security-review**            | 认证、输入、密钥、API、支付安全检查  | 敏感功能开发与审查          |
| **strategic-compact**          | 任务阶段边界建议手动压缩上下文       | 长会话、阶段切换时          |
| **tdd-workflow**               | TDD、80%+ 覆盖率（单元/集成/E2E）    | 新功能、修 bug、重构        |
| **verification-loop**          | 构建、类型、测试、lint 等质量门禁    | 功能完成或 PR 前            |

---

## 使用方式速查

| 目标            | 操作                                                             |
| --------------- | ---------------------------------------------------------------- |
| 先规划再写代码  | 输入 `/plan`，确认计划后再开发                                   |
| 按 TDD 开发     | 输入 `/tdd` 或 `@tdd-guide`                                      |
| 做代码审查      | 输入 `/code-review` 或 `@code-reviewer`                          |
| 全面验证        | 输入 `/verify`                                                   |
| 修构建/类型错误 | 输入 `/build-fix` 或 `@build-error-resolver`                     |
| 跑 E2E          | 输入 `/e2e` 或 `@e2e-runner`                                     |
| 架构/技术决策   | 输入 `@architect`                                                |
| 安全审查        | 输入 `@security-reviewer`                                        |
| 切换工作模式    | 输入 `@contexts/dev`、`@contexts/research` 或 `@contexts/review` |
| 编排完整流程    | 输入 `/orchestrate feature <描述>`                               |

---

## 与其他配置的关系

- **规则（rules）**：自动生效，定义「怎么做」；**技能（skills）**：按需读取，定义「专项怎么做」。
- **命令（commands）**：用户主动触发；**子智能体（agents）**：可通过命令或 `@` 引用触发。
- **上下文（contexts）**：通过 `@` 或规则注入，影响当前对话的侧重点（开发/调研/审查）。

详细规则索引见 [rules/common/general.mdc](rules/common/general.mdc)，技能触发与使用见 [rules/common/skill-usage.mdc](rules/common/skill-usage.mdc)。
