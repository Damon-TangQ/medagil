# entities/__init__.py
# 领域实体层：核心业务实体

from abc import ABC
from dataclasses import dataclass
from typing import Any
from datetime import datetime


@dataclass
class BaseEntity(ABC):
    """基础实体类，包含通用字段"""
    id: Any
    created_at: datetime
    updated_at: datetime

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
        if self.updated_at is None:
            self.updated_at = datetime.now()

    def update_timestamp(self):
        """更新修改时间"""
        self.updated_at = datetime.now()


# 导出实体类
__all__ = ['BaseEntity']