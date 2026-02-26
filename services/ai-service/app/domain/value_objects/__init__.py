# value_objects/__init__.py
# 值对象层：不可变的值对象

from abc import ABC
from dataclasses import dataclass, FrozenInstanceError
from typing import Any, Dict, List


@dataclass(frozen=True)
class BaseValueObject(ABC):
    """基础值对象类，不可变"""

    value: Any

    def __post_init__(self):
        # 确保不可变
        try:
            object.__setattr__(self, '_frozen', True)
        except FrozenInstanceError:
            pass


@dataclass(frozen=True)
class AIRequest(BaseValueObject):
    """AI请求值对象"""
    model: str
    prompt: str
    parameters: Dict[str, Any]

    def __post_init__(self):
        super().__post_init__()
        # 验证必需字段
        if not self.model or not self.prompt:
            raise ValueError("model and prompt are required")


@dataclass(frozen=True)
class AIResponse(BaseValueObject):
    """AI响应值对象"""
    content: str
    model_used: str
    tokens_used: int
    metadata: Dict[str, Any]


# 导出值对象类
__all__ = ['BaseValueObject', 'AIRequest', 'AIResponse']