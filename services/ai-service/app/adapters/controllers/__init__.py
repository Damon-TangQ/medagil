# controllers/__init__.py
# 控制器层：处理HTTP请求和响应，协调业务逻辑

from abc import ABC, abstractmethod
from typing import Any, Dict
from fastapi import Request, Response


class BaseController(ABC):
    """基础控制器类，提供请求和响应处理的通用方法"""

    @abstractmethod
    def handle_request(self, request: Request) -> Response:
        """处理HTTP请求，返回响应"""
        pass

    def parse_request_body(self, request: Request) -> Dict[str, Any]:
        """解析请求体，返回字典格式"""
        # 基础实现，可被子类覆盖
        return {}

    def build_response(self, data: Any, status_code: int = 200) -> Response:
        """构建标准响应"""
        # 基础实现，可被子类覆盖
        return Response(content=str(data), status_code=status_code)


# 导出AIController
from .ai_controller import AIController

__all__ = ['BaseController', 'AIController']