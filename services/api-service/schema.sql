-- ========================================
-- Medagil API Service 数据库表结构定义
-- 包含所有业务表的DDL定义
-- ========================================

-- ========================================
-- 用户相关表
-- ========================================

-- 用户表
-- 用途：存储系统用户信息，支持多种登录方式
CREATE TABLE users (
    -- 主键，自增，唯一标识用户
    id BIGSERIAL PRIMARY KEY,

    -- 用户名，用于登录和展示，全局唯一
    username VARCHAR(255) NOT NULL UNIQUE,

    -- 邮箱地址，可为空，用于邮箱登录和通知
    email VARCHAR(255),

    -- 手机号，可为空，用于手机号登录和短信通知
    phone VARCHAR(20),

    -- 用户状态：active-正常可用，inactive-未激活，banned-封禁
    status VARCHAR(50) NOT NULL DEFAULT 'active',

    -- 账户创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 用户认证身份表
-- 用途：管理用户与第三方认证提供商的关联，支持多种登录方式
CREATE TABLE user_auth_identities (
    -- 主键，自增，唯一标识认证身份
    id BIGSERIAL PRIMARY KEY,

    -- 用户ID，外键关联users表
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 认证提供商：wechat-微信，phone-手机号，email-邮箱
    provider VARCHAR(50) NOT NULL,

    -- 提供商用户ID，如微信openid、手机号、邮箱地址
    provider_user_id VARCHAR(255) NOT NULL,

    -- 认证身份创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 唯一约束：同一用户在同一提供商下只能有一个认证身份
    UNIQUE(user_id, provider)
);

-- 用户标签表
-- 用途：用于对用户进行分类和运营标签管理，支持用户分群和精准营销
CREATE TABLE user_tags (
    -- 主键，自增，唯一标识标签
    id BIGSERIAL PRIMARY KEY,

    -- 标签名称，如"活跃用户"、"高价值用户"等
    name VARCHAR(255) NOT NULL,

    -- 标签颜色，用于前端展示，十六进制颜色值
    color VARCHAR(7) NOT NULL,

    -- 标签创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 用户标签关系表
-- 用途：管理用户与标签的多对多关系，实现灵活的用户标签分配
CREATE TABLE user_tag_relations (
    -- 主键，自增，唯一标识用户标签关系
    id BIGSERIAL PRIMARY KEY,

    -- 用户ID，外键关联users表
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 标签ID，外键关联user_tags表
    tag_id BIGINT NOT NULL REFERENCES user_tags(id) ON DELETE CASCADE,

    -- 关系创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 唯一约束：同一用户不能重复添加同一标签
    UNIQUE(user_id, tag_id)
);

-- ========================================
-- 项目相关表
-- ========================================

-- 项目分类表
-- 用途：用于对项目进行分类管理，支持多级分类结构，便于项目组织和检索
CREATE TABLE project_categories (
    -- 主键，自增，唯一标识分类
    id BIGSERIAL PRIMARY KEY,

    -- 用户ID，外键关联users表，表示分类的创建者
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 分类名称，如"临床研究"、"课题项目"等
    name VARCHAR(255) NOT NULL,

    -- 父分类ID，支持多级分类结构，为空表示顶级分类
    parent_id BIGINT REFERENCES project_categories(id) ON DELETE SET NULL,

    -- 分类创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 项目表
-- 用途：记录用户创建的项目信息，包括名称、描述、全局提示等，是系统的核心业务实体
CREATE TABLE projects (
    -- 主键，自增，唯一标识项目
    id BIGSERIAL PRIMARY KEY,

    -- 用户ID，外键关联users表，表示项目的创建者
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 分类ID，外键关联project_categories表，可为空
    category_id BIGINT REFERENCES project_categories(id) ON DELETE SET NULL,

    -- 项目名称，用户自定义
    name VARCHAR(255) NOT NULL,

    -- 项目描述，详细说明项目的目标和内容
    description TEXT,

    -- 项目状态：active-活跃，archived-已归档
    status VARCHAR(50) NOT NULL DEFAULT 'active',

    -- 全局提示词，用于AI交互，影响AI生成的内容风格
    global_prompt TEXT,

    -- 项目创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 成就表
-- 用途：记录用户在项目、任务、文件等方面的成就和收藏，支持用户成果管理和展示
CREATE TABLE achievements (
    -- 主键，自增，唯一标识成就
    id BIGSERIAL PRIMARY KEY,

    -- 用户ID，外键关联users表，表示成就的所有者
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 项目ID，外键关联projects表，可为空，表示成就所属的项目
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    -- 任务ID，外键关联tasks表，可为空，表示成就所属的任务
    task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,

    -- 文件ID，外键关联files表，可为空，表示成就所属的文件
    file_id BIGINT REFERENCES files(id) ON DELETE CASCADE,

    -- 成就标题，如"论文初稿"、"数据分析报告"等
    title VARCHAR(255) NOT NULL,

    -- 成就类型，如"论文"、"报告"、"图表"等
    type VARCHAR(100) NOT NULL,

    -- 成就状态：draft-草稿，published-已发布，archived-已归档
    status VARCHAR(50) NOT NULL DEFAULT 'draft',

    -- 是否收藏，true表示已收藏
    is_favorited BOOLEAN NOT NULL DEFAULT false,

    -- 成就创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 文件表
-- 用途：记录上传的文件信息，包括文件名、大小、类型等，支持文件管理和云存储
CREATE TABLE files (
    -- 主键，自增，唯一标识文件
    id BIGSERIAL PRIMARY KEY,

    -- 用户ID，外键关联users表，表示文件的上传者
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 文件名，包含扩展名
    name VARCHAR(255) NOT NULL,

    -- 文件存储键，用于云存储（如OSS、S3等）的文件标识
    key VARCHAR(500) NOT NULL,

    -- 文件大小，单位为字节
    size BIGINT NOT NULL,

    -- 文件类型，MIME类型，如"application/pdf"、"image/png"等
    type VARCHAR(100) NOT NULL,

    -- 所属对象类型，如"project"、"task"等，表示文件的归属
    belongs_to VARCHAR(50) NOT NULL,

    -- 文件创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 任务相关表
-- ========================================

-- 任务表
-- 用途：记录用户创建的任务信息，包括任务编号、智能体类型、状态等，是AI任务执行的核心实体
CREATE TABLE tasks (
    -- 主键，自增，唯一标识任务
    id BIGSERIAL PRIMARY KEY,

    -- 用户ID，外键关联users表，表示任务的创建者
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 任务编号，全局唯一，用于外部引用和查询
    task_no VARCHAR(100) NOT NULL UNIQUE,

    -- 智能体类型，如"paper-outline"、"paper-polish"等，表示任务的AI处理类型
    agent_type VARCHAR(100) NOT NULL,

    -- 任务状态：pending-待处理，running-进行中，completed-已完成，failed-失败
    status VARCHAR(50) NOT NULL DEFAULT 'pending',

    -- Dify平台任务ID，可为空，用于关联Dify平台的任务
    dify_task_id VARCHAR(255),

    -- 任务创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 任务文件关联表
-- 用途：记录任务与上传文件之间的关联关系，支持任务输入输出文件管理
CREATE TABLE task_files (
    -- 主键，自增，唯一标识任务文件关系
    id BIGSERIAL PRIMARY KEY,

    -- 任务ID，外键关联tasks表
    task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,

    -- 文件ID，外键关联files表
    file_id BIGINT NOT NULL REFERENCES files(id) ON DELETE CASCADE,

    -- 文件类型：input-输入文件，output-输出文件
    type VARCHAR(50) NOT NULL,

    -- 关系创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 唯一约束：同一任务的同一文件只能关联一次
    UNIQUE(task_id, file_id, type)
);

-- 任务反馈表
-- 用途：记录用户对任务执行结果的评价和反馈，支持任务质量评估和改进
CREATE TABLE task_feedbacks (
    -- 主键，自增，唯一标识反馈
    id BIGSERIAL PRIMARY KEY,

    -- 任务ID，外键关联tasks表
    task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,

    -- 用户ID，外键关联users表，表示反馈的提交者
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 评分，1-5星，5星表示最高评价
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),

    -- 评论内容，用户对任务执行结果的具体评价
    comment TEXT,

    -- 反馈创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 唯一约束：同一用户对同一任务只能反馈一次
    UNIQUE(task_id, user_id)
);

-- ========================================
-- 内容相关表
-- ========================================

-- 内容表
-- 用途：存储用户创建的内容，支持多种内容类型和版本管理
CREATE TABLE contents (
    -- 主键，自增，唯一标识内容
    id BIGSERIAL PRIMARY KEY,

    -- 用户ID，外键关联users表，表示内容的创建者
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 项目ID，外键关联projects表，可为空
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,

    -- 任务ID，外键关联tasks表，可为空
    task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,

    -- 内容标题
    title VARCHAR(255) NOT NULL,

    -- 内容类型：article-文章，note-笔记，report-报告等
    type VARCHAR(50) NOT NULL,

    -- 内容状态：draft-草稿，published-已发布，archived-已归档
    status VARCHAR(50) NOT NULL DEFAULT 'draft',

    -- 内容正文
    body TEXT,

    -- 内容创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 积分相关表
-- ========================================

-- 积分表
-- 用途：记录用户的积分获取和使用情况，支持积分管理和激励
CREATE TABLE credits (
    -- 主键，自增，唯一标识积分记录
    id BIGSERIAL PRIMARY KEY,

    -- 用户ID，外键关联users表
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 积分类型：earn-获取，spend-消费
    type VARCHAR(50) NOT NULL,

    -- 积分数量，正数表示获取，负数表示消费
    amount INTEGER NOT NULL,

    -- 积分来源或用途说明
    description VARCHAR(500),

    -- 积分创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 知识库相关表
-- ========================================

-- 知识库表
-- 用途：存储用户的知识库内容，支持知识管理和AI检索
CREATE TABLE knowledge_bases (
    -- 主键，自增，唯一标识知识库
    id BIGSERIAL PRIMARY KEY,

    -- 用户ID，外键关联users表，表示知识库的创建者
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 知识库名称
    name VARCHAR(255) NOT NULL,

    -- 知识库描述
    description TEXT,

    -- 知识库状态：active-活跃，archived-已归档
    status VARCHAR(50) NOT NULL DEFAULT 'active',

    -- 知识库创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 知识库文档表
-- 用途：存储知识库中的文档内容，支持文档管理和向量检索
CREATE TABLE knowledge_documents (
    -- 主键，自增，唯一标识文档
    id BIGSERIAL PRIMARY KEY,

    -- 知识库ID，外键关联knowledge_bases表
    knowledge_base_id BIGINT NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,

    -- 文档标题
    title VARCHAR(255) NOT NULL,

    -- 文档内容
    content TEXT NOT NULL,

    -- 文档类型：text-文本，file-文件等
    type VARCHAR(50) NOT NULL DEFAULT 'text',

    -- 文档状态：active-活跃，archived-已归档
    status VARCHAR(50) NOT NULL DEFAULT 'active',

    -- 文档创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 订阅相关表
-- ========================================

-- 订阅表
-- 用途：记录用户的订阅信息，支持订阅管理和计费
CREATE TABLE subscriptions (
    -- 主键，自增，唯一标识订阅
    id BIGSERIAL PRIMARY KEY,

    -- 用户ID，外键关联users表
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 订阅计划：free-免费，pro-专业，max-最大
    plan VARCHAR(50) NOT NULL,

    -- 订阅状态：active-活跃，expired-过期，cancelled-已取消
    status VARCHAR(50) NOT NULL DEFAULT 'active',

    -- 订阅开始时间，UTC时间戳
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 订阅结束时间，UTC时间戳
    end_date TIMESTAMP NOT NULL,

    -- 订阅创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 唯一约束：同一用户只能有一个活跃订阅
    UNIQUE(user_id, status)
);

-- ========================================
-- 管理员相关表
-- ========================================

-- 管理员表
-- 用途：存储管理员账户信息，支持管理端权限控制
CREATE TABLE admins (
    -- 主键，自增，唯一标识管理员
    id BIGSERIAL PRIMARY KEY,

    -- 管理员用户名，用于登录
    username VARCHAR(255) NOT NULL UNIQUE,

    -- 管理员密码，加密存储
    password_hash VARCHAR(255) NOT NULL,

    -- 管理员邮箱
    email VARCHAR(255),

    -- 管理员角色：super-超级管理员，admin-普通管理员
    role VARCHAR(50) NOT NULL DEFAULT 'admin',

    -- 管理员状态：active-活跃，inactive-未激活
    status VARCHAR(50) NOT NULL DEFAULT 'active',

    -- 管理员创建时间，UTC时间戳
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 最后更新时间，UTC时间戳
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 索引定义
-- ========================================

-- 用户表索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 任务表索引
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_task_no ON tasks(task_no);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);

-- 项目表索引
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_category_id ON projects(category_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- 文件表索引
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_belongs_to ON files(belongs_to);
CREATE INDEX idx_files_created_at ON files(created_at);

-- 订阅表索引
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);

-- 积分表索引
CREATE INDEX idx_credits_user_id ON credits(user_id);
CREATE INDEX idx_credits_type ON credits(type);
CREATE INDEX idx_credits_created_at ON credits(created_at);

-- ========================================
-- 注释说明
-- ========================================
-- 所有表和字段都添加了详细的中文注释
-- 注释格式：-- 字段说明
-- 包含用途、类型、约束等说明
-- 便于开发人员理解和维护
