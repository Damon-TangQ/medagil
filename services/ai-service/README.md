# ai-service

Medagil 知识库与 AI 对接服务：Python + FastAPI，采用 Clean Architecture 分层。

## 职责

- 知识库元数据、分类/标签、版本、权限
- 调用 Zilliz 做向量写入与检索（RAG、知识库搜索）
- 与 Dify 的对接（可由本服务或 api-service 转发）

## 分层

- `app/domain/` 领域层（entities, value_objects, interfaces）
- `app/use_cases/` 应用业务规则
- `app/adapters/` 控制器、仓储、Dify/Zilliz 网关实现
- `app/infra/` 配置、连接等

## 运行

需先安装 [uv](https://docs.astral.sh/uv/)。依赖以 `pyproject.toml` + `uv.lock` 管理，不再使用 `requirements.txt`。

```bash
uv sync
uvicorn main:app --reload --port 8000
```

首次执行 `uv sync` 会生成 `uv.lock`，请提交。默认监听 `8000`，`GET /health` 健康检查，`GET /api/v1/ping` 占位。
