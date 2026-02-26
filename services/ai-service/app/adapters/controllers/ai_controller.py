# ai_controller.py
# AI控制器：处理AI相关的HTTP请求和响应

from typing import Any, Dict
from fastapi import Request, Response
import logging

from . import BaseController
from ...domain.interfaces import AIServiceInterface
from ...domain.value_objects import AIRequest, AIResponse

logger = logging.getLogger(__name__)


class AIController(BaseController):
    """
    AI控制器类，负责处理AI相关的HTTP请求

    主要功能：
    1. 接收客户端的AI处理请求
    2. 验证请求参数
    3. 调用AI服务接口处理请求
    4. 返回格式化的响应结果

    设计原则：
    - 遵循单一职责原则，仅负责请求/响应处理
    - 业务逻辑委托给AIServiceInterface处理
    - 使用值对象(AIRequest/AIResponse)进行数据传递
    """

    def __init__(self, ai_service: AIServiceInterface):
        """
        初始化AI控制器

        Args:
            ai_service: AI服务接口实例，用于处理AI业务逻辑
        """
        super().__init__()
        self.ai_service = ai_service
        logger.info("AIController initialized")

    def handle_request(self, request: Request) -> Response:
        """
        处理HTTP请求的主入口方法

        根据请求路径分发到不同的处理方法

        Args:
            request: FastAPI请求对象

        Returns:
            Response: HTTP响应对象
        """
        path = request.url.path

        if path.endswith("/process"):
            return self.process(request)
        elif path.endswith("/models"):
            return self.get_models(request)
        else:
            return self.build_response(
                {"error": "Unsupported endpoint"},
                status_code=404
            )

    def process(self, request: Request) -> Response:
        """
        处理AI处理请求

        流程：
        1. 解析请求体，验证参数
        2. 创建AIRequest值对象
        3. 调用AI服务处理请求
        4. 返回处理结果

        Args:
            request: FastAPI请求对象，期望包含以下字段：
                - input_text: 输入文本
                - agent_type: 智能体类型（如paper-outline, paper-polish等）
                - parameters: 额外参数（可选）

        Returns:
            Response: 包含处理结果的HTTP响应
                成功：{"result": "...", "status": "success", ...}
                失败：{"error": "...", "status": "error", ...}
        """
        try:
            # 解析请求体
            body = self.parse_request_body(request)

            # 验证必需参数
            input_text = body.get("input_text", "")
            agent_type = body.get("agent_type", "general")
            parameters = body.get("parameters", {})

            if not input_text:
                return self.build_response(
                    {"error": "input_text is required", "status": "error"},
                    status_code=400
                )

            # 创建AIRequest值对象
            ai_request = AIRequest(
                model=agent_type,
                prompt=input_text,
                parameters=parameters
            )

            # 调用AI服务处理请求
            logger.info(f"Processing AI request: agent_type={agent_type}, input_length={len(input_text)}")
            ai_response = self.ai_service.process_ai_request(ai_request)

            # 构建响应
            response_data = {
                "result": ai_response.content,
                "status": "success",
                "model_used": ai_response.model_used,
                "tokens_used": ai_response.tokens_used,
                "metadata": ai_response.metadata
            }

            logger.info("AI processing completed successfully")
            return self.build_response(response_data, status_code=200)

        except ValueError as e:
            # 参数验证错误
            logger.error(f"Invalid request parameters: {str(e)}")
            return self.build_response(
                {"error": f"Invalid parameters: {str(e)}", "status": "error"},
                status_code=400
            )
        except Exception as e:
            # 其他未预期的错误
            logger.error(f"AI processing failed: {str(e)}")
            return self.build_response(
                {"error": f"Processing failed: {str(e)}", "status": "error"},
                status_code=500
            )

    def get_models(self, request: Request) -> Response:
        """
        获取可用的AI模型列表

        Args:
            request: FastAPI请求对象

        Returns:
            Response: 包含模型列表的HTTP响应
                成功：{"models": [...], "status": "success"}
                失败：{"error": "...", "status": "error"}
        """
        try:
            models = self.ai_service.get_ai_models()
            return self.build_response(
                {"models": models, "status": "success"},
                status_code=200
            )
        except Exception as e:
            logger.error(f"Failed to get models: {str(e)}")
            return self.build_response(
                {"error": f"Failed to get models: {str(e)}", "status": "error"},
                status_code=500
            )

    def parse_request_body(self, request: Request) -> Dict[str, Any]:
        """
        解析请求体，返回字典格式

        Args:
            request: FastAPI请求对象

        Returns:
            Dict[str, Any]: 解析后的请求体字典
        """
        try:
            return request.json()
        except Exception as e:
            logger.error(f"Failed to parse request body: {str(e)}")
            raise ValueError("Invalid JSON in request body")

    def build_response(self, data: Any, status_code: int = 200) -> Response:
        """
        构建标准响应

        Args:
            data: 响应数据
            status_code: HTTP状态码

        Returns:
            Response: HTTP响应对象
        """
        from fastapi.responses import JSONResponse
        return JSONResponse(content=data, status_code=status_code)
