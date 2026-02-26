# infra/__init__.py
# 基础设施层：技术实现，如数据库连接、消息队列等

import logging
import psycopg2
from psycopg2.pool import SimpleConnectionPool


class DatabaseConnection:
    """数据库连接管理"""

    def __init__(self, host: str, port: int, user: str, password: str, dbname: str):
        self.pool = SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            host=host,
            port=port,
            user=user,
            password=password,
            dbname=dbname
        )

    def get_connection(self):
        """获取数据库连接"""
        return self.pool.getconn()

    def return_connection(self, conn):
        """归还数据库连接"""
        self.pool.putconn(conn)

    def close_all(self):
        """关闭所有连接"""
        self.pool.closeall()


def setup_logging(level: str = 'INFO'):
    """配置日志"""
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    return logging.getLogger(__name__)


class Config:
    """配置管理"""

    def __init__(self):
        self.database_url = "postgresql://user:password@localhost:5432/medagil_ai"
        self.ai_api_key = "your-ai-api-key"
        self.log_level = "INFO"