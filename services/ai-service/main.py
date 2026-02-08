"""
Medagil AI 服务入口：知识库与 Dify/向量检索对接。
采用 Clean Architecture：domain → use_cases → adapters → infra。
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时初始化（如 Zilliz 连接池）
    yield
    # 关闭时清理
    pass


app = FastAPI(
    title="Medagil AI Service",
    description="知识库元数据、向量检索、Dify 对接",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/v1/ping")
def ping():
    return {"message": "pong"}


# 后续：知识库、检索等路由从 adapters.controllers 挂载
# from app.adapters.controllers import knowledge_router
# app.include_router(knowledge_router, prefix="/api/v1", tags=["knowledge"])
