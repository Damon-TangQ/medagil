# Medagil AI Service application package
# 提供AI服务的核心功能模块

# 导出控制器层
from app.adapters.controllers import BaseController, AIController

# 导出用例层
from app.use_cases import AIService

# 导出领域层
from app.domain.entities import BaseEntity
from app.domain.interfaces import DomainService, AIServiceInterface, RepositoryInterface
from app.domain.value_objects import BaseValueObject, AIRequest, AIResponse

# 导出适配器层
from app.adapters.gateways import BaseGateway
from app.adapters.repositories import BaseRepository

__all__ = [
    # 控制器层
    'BaseController',
    'AIController',
    # 用例层
    'AIService',
    # 领域实体
    'BaseEntity',
    # 领域接口
    'DomainService',
    'AIServiceInterface',
    'RepositoryInterface',
    # 值对象
    'BaseValueObject',
    'AIRequest',
    'AIResponse',
    # 适配器层
    'BaseGateway',
    'BaseRepository',
]
