# interfaces/__init__.py
# 领域接口层：定义领域服务和仓储接口

from abc import ABC, abstractmethod
from typing import Any, List


class DomainService(ABC):
    """领域服务接口"""

    @abstractmethod
    def execute_business_logic(self, params: Any) -> Any:
        """执行业务逻辑"""
        pass


class AIServiceInterface(ABC):
    """AI服务接口，定义AI相关业务方法"""

    @abstractmethod
    def process_ai_request(self, request: Any) -> Any:
        """处理AI请求"""
        pass

    @abstractmethod
    def get_ai_models(self) -> List[str]:
        """获取可用AI模型列表"""
        pass

    @abstractmethod
    def validate_ai_request(self, request: Any) -> bool:
        """验证AI请求参数"""
        pass


class RepositoryInterface(ABC):
    """仓储接口"""

    @abstractmethod
    def save(self, entity: Any) -> None:
        pass

    @abstractmethod
    def find_by_id(self, id: Any) -> Any:
        pass

    @abstractmethod
    def find_all(self) -> List[Any]:
        pass


# 导出所有接口
__all__ = ['DomainService', 'AIServiceInterface', 'RepositoryInterface']