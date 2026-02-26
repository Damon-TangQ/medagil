# repositories/__init__.py
# 仓储层：数据访问接口和实现

from abc import ABC, abstractmethod
from typing import Any, List, Optional


class BaseRepository(ABC):
    """基础仓储抽象类，定义CRUD接口"""

    def __init__(self, db_connection):
        self.db = db_connection

    @abstractmethod
    def save(self, entity: Any) -> None:
        """保存实体"""
        pass

    @abstractmethod
    def find_by_id(self, id: Any) -> Optional[Any]:
        """根据ID查找实体"""
        pass

    @abstractmethod
    def find_all(self) -> List[Any]:
        """查找所有实体"""
        pass

    @abstractmethod
    def update(self, entity: Any) -> None:
        """更新实体"""
        pass

    @abstractmethod
    def delete(self, id: Any) -> None:
        """删除实体"""
        pass


# 导出仓储类
__all__ = ['BaseRepository']