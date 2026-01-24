根据项目路线图 **Phase 1: 基础设施与核心数据**，我们将启动后端的开发工作。

### 本次开发目标
完成后端数据库初始化及核心认证（Auth）模块的基础实现。

### 详细步骤

#### 1. 数据库初始化 (Backend DB)
*   **任务**: 生成初始数据库迁移脚本。
*   **操作**: 运行 `alembic revision --autogenerate -m "init_schema"`。
*   **目的**: 将之前定义的 User, Product, Order 等 Python 模型转换为 SQL 建表语句。

#### 2. 核心安全模块 (Core Security)
*   **任务**: 实现密码加密与 Token 签发工具。
*   **文件**: 创建 `backend/app/core/security.py`。
*   **内容**:
    *   `get_password_hash`: 密码哈希 (Bcrypt)。
    *   `verify_password`: 密码验证。
    *   `create_access_token`: 生成 JWT Token。

#### 3. 认证接口开发 (Auth API)
*   **任务**: 实现管理端和小程序端的登录接口。
*   **文件**:
    *   创建 `backend/app/api/api_v1/endpoints/admin/auth.py`: 管理员用户名/密码登录。
    *   创建 `backend/app/api/api_v1/endpoints/client/auth.py`: 用户微信/手机号登录 (基础桩代码)。
*   **路由注册**: 更新 `backend/app/api/api_v1/api.py` 注册上述路由。

### 确认
请确认是否开始执行上述步骤？（执行前请确保本地 Postgres 数据库已启动，或者我先仅生成代码和迁移脚本）