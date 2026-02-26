# gateways/__init__.py
# 网关层：处理外部服务集成，如AI模型调用、外部API

from abc import ABC, abstractmethod
from typing import Any, Dict
import requests


class BaseGateway(ABC):
    """基础网关类，提供外部服务调用的通用方法"""

    def __init__(self, base_url: str, api_key: str = None):
        self.base_url = base_url
        self.api_key = api_key
        self.session = requests.Session()

    @abstractmethod
    def call_external_service(self, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """调用外部服务"""
        pass

    def _make_request(self, method: str, url: str, **kwargs) -> Dict[str, Any]:
        """通用HTTP请求方法"""
        if self.api_key:
            headers = kwargs.get('headers', {})
            headers['Authorization'] = f'Bearer {self.api_key}'
            kwargs['headers'] = headers

        response = self.session.request(method, url, **kwargs)
        return {
            'status_code': response.status_code,
            'data': response.json() if response.headers.get('content-type') == 'application/json' else response.text
        }


# 导出网关类
__all__ = ['BaseGateway']