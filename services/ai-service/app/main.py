from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import logging
import time

# ========================================
# 配置和初始化
# ========================================

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 创建FastAPI应用实例
# 
# 配置说明：
# - title: API标题，用于文档生成
# - description: API描述，用于文档生成
# - version: API版本，用于版本管理
# - docs_url: 自定义文档路径（可选）
app = FastAPI(
    title="Medagil AI Service",
    description="AI服务API，提供智能处理功能，支持论文大纲生成、论文润色等功能",
    version="1.0.0"
)

# ========================================
# 请求和响应模型
# ========================================

class AIProcessRequest(BaseModel):
    """
    AI处理请求模型

    字段说明：
    - input_text: 输入文本，必需
    - agent_type: 智能体类型，默认为general
    - parameters: 额外参数，可选

    验证规则：
    - input_text不能为空
    - agent_type必须在支持的类型列表中
    - parameters必须是字典类型
    """
    input_text: str = Field(
        ...,
        description="输入文本，需要进行AI处理的内容",
        min_length=1,
        max_length=10000
    )
    agent_type: str = Field(
        default="general",
        description="智能体类型，决定使用哪种AI处理逻辑",
        pattern="^(paper-outline|paper-polish|paper-review|general)$"
    )
    parameters: Optional[dict] = Field(
        default={},
        description="额外参数，用于控制AI处理行为"
    )

class AIProcessResponse(BaseModel):
    """
    AI处理响应模型

    字段说明：
    - result: 处理结果，必需
    - status: 处理状态，固定为success
    - processing_time: 处理耗时，单位秒
    - metadata: 元数据，包含处理过程信息

    响应格式：
    - 统一JSON结构，便于前端解析
    - 包含完整的处理信息
    - 便于错误追踪和性能分析
    """
    result: str = Field(
        ...,
        description="AI处理结果"
    )
    status: str = Field(
        default="success",
        description="处理状态，成功时为success",
        pattern="^(success|error)$"
    )
    processing_time: float = Field(
        ...,
        description="处理耗时，单位秒",
        ge=0
    )
    metadata: dict = Field(
        default_factory=dict,
        description="元数据，包含处理过程信息"
    )

# ========================================
# AI业务逻辑实现
# ========================================

def process_ai_request(input_text: str, agent_type: str, parameters: dict) -> dict:
    """
    AI核心处理方法

    功能说明：
    - 根据agent_type选择不同的处理逻辑
    - 支持论文大纲生成、论文润色等功能
    - MVP阶段使用模拟实现，后续可接入真实AI服务

    参数说明：
    - input_text: 输入文本
    - agent_type: 智能体类型
    - parameters: 额外参数

    返回值：
    - dict: 包含result、processing_time、metadata的字典

    支持的agent_type：
    - paper-outline: 论文大纲生成
    - paper-polish: 论文润色
    - paper-review: 论文评审
    - general: 通用AI处理

    后续扩展：
    - 接入真实的AI模型（如GPT、Claude等）
    - 支持更多agent_type
    - 添加参数验证和错误处理
    """
    start_time = time.time()

    # 根据agent_type选择不同的处理逻辑
    try:
        if agent_type == "paper-outline":
            # 论文大纲生成
            result = f"""论文大纲：{input_text}

一、引言
    1.1 研究背景
    1.2 研究目的与意义
    1.3 研究方法

二、文献综述
    2.1 国内外研究现状
    2.2 研究空白与创新点

三、研究设计
    3.1 研究对象
    3.2 数据收集方法
    3.3 数据分析方法

四、研究结果
    4.1 描述性统计
    4.2 推断性统计

五、讨论
    5.1 结果解释
    5.2 研究局限性

六、结论
    6.1 主要发现
    6.2 实践建议
    6.3 未来研究方向

七、参考文献
"""
            agent_type_used = "paper-outline"

        elif agent_type == "paper-polish":
            # 论文润色
            result = f"""[润色后] {input_text}

注：此为MVP阶段的模拟润色结果，实际版本将接入真实的AI润色服务。
润色说明：
- 优化语言表达，提升学术性
- 调整句子结构，增强可读性
- 规范术语使用，确保准确性
"""
            agent_type_used = "paper-polish"

        elif agent_type == "paper-review":
            # 论文评审
            result = f"""论文评审意见：

一、总体评价
本文主题明确，结构清晰，具有一定的学术价值。

二、优点
1. 研究设计合理
2. 数据收集方法恰当
3. 分析方法科学

三、改进建议
1. 建议增加更多相关文献支持
2. 可进一步讨论研究结果的普适性
3. 建议补充更多实证数据

四、结论
建议修改后录用。
"""
            agent_type_used = "paper-review"

        else:
            # 通用AI处理
            result = f"""通用AI处理结果：{input_text}

注：此为MVP阶段的模拟结果，实际版本将接入真实的AI服务。
"""
            agent_type_used = "general"

    except Exception as e:
        logger.error(f"AI processing error: {str(e)}")
        raise ValueError(f"AI processing failed: {str(e)}")

    # 计算处理时间
    processing_time = time.time() - start_time

    # 返回处理结果
    return {
        "result": result,
        "processing_time": processing_time,
        "metadata": {
            "agent_type": agent_type_used,
            "input_length": len(input_text),
            "parameters": parameters
        }
    }

# ========================================
# API路由定义
# ========================================

@app.get("/health")
async def health_check():
    """
    健康检查接口

    用途：
    - 供APISIX、Kubernetes或运维监控探活使用
    - 验证服务是否正常运行
    - 返回服务状态信息

    响应格式：
    - JSON格式
    - 包含status和service字段
    - 便于自动化监控
    """
    return {
        "status": "healthy",
        "service": "ai-service",
        "version": "1.0.0"
    }

@app.post("/api/v1/ai/process", response_model=AIProcessResponse)
async def process_ai(request: AIProcessRequest):
    """
    AI处理接口

    功能说明：
    - 接收用户的AI处理请求
    - 调用AI核心处理方法
    - 返回标准格式的处理结果

    请求格式：
    - Content-Type: application/json
    - 必需字段：input_text
    - 可选字段：agent_type、parameters

    响应格式：
    - Content-Type: application/json
    - 包含result、status、processing_time、metadata
    - 成功时返回200状态码
    - 失败时返回500状态码

    错误处理：
    - 参数验证错误：返回400状态码
    - 处理异常：返回500状态码
    - 所有错误都包含详细的错误信息

    使用示例：
    ```bash
    curl -X POST http://localhost:8000/api/v1/ai/process \
      -H "Content-Type: application/json" \
      -d '{
        "input_text": "人工智能在医疗诊断中的应用研究",
        "agent_type": "paper-outline",
        "parameters": {}
      }'
    ```

    支持的agent_type：
    - paper-outline: 论文大纲生成
    - paper-polish: 论文润色
    - paper-review: 论文评审
    - general: 通用AI处理（默认）

    后续扩展：
    - 添加请求限流
    - 添加认证鉴权
    - 添加请求日志记录
    - 添加性能监控
    """
    try:
        # 记录请求信息
        logger.info(
            f"Processing AI request: "
            f"agent_type={request.agent_type}, "
            f"input_length={len(request.input_text)}, "
            f"parameters={request.parameters}"
        )

        # 验证必需参数
        if not request.input_text or not request.input_text.strip():
            logger.warning("Empty input_text received")
            raise HTTPException(
                status_code=400,
                detail="input_text cannot be empty"
            )

        # 验证agent_type
        supported_types = ["paper-outline", "paper-polish", "paper-review", "general"]
        if request.agent_type not in supported_types:
            logger.warning(f"Unsupported agent_type: {request.agent_type}")
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported agent_type: {request.agent_type}. "
                       f"Supported types: {', '.join(supported_types)}"
            )

        # 调用AI核心处理方法
        ai_result = process_ai_request(
            input_text=request.input_text,
            agent_type=request.agent_type,
            parameters=request.parameters or {}
        )

        # 构造响应
        response = AIProcessResponse(
            result=ai_result["result"],
            status="success",
            processing_time=ai_result["processing_time"],
            metadata=ai_result["metadata"]
        )

        # 记录成功日志
        logger.info(
            f"AI processing completed successfully: "
            f"agent_type={request.agent_type}, "
            f"processing_time={ai_result['processing_time']:.3f}s"
        )

        return response

    except HTTPException:
        # FastAPI的HTTPException，直接抛出
        raise

    except ValueError as e:
        # 参数验证错误
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Validation error: {str(e)}"
        )

    except Exception as e:
        # 未预期的错误
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

# ========================================
# 应用启动
# ========================================

if __name__ == "__main__":
    import uvicorn

    # 配置说明：
    # - host: 监听地址，0.0.0.0表示监听所有接口
    # - port: 监听端口，8000为默认端口
    # - log_level: 日志级别，info表示记录重要信息
    # - access_log: 是否记录访问日志，生产环境建议开启

    logger.info("Starting Medagil AI Service...")
    logger.info(f"API Documentation: http://0.0.0.0:8000/docs")
    logger.info(f"Health Check: http://0.0.0.0:8000/health")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )
