-- Medagil平台数据库表结构设计
-- 创建时间: 2023-09-15
-- 数据库类型: MySQL

-- 创建数据库
CREATE DATABASE IF NOT EXISTS medagil_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE medagil_platform;

-- ============================================
-- 1. 用户表(users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY COMMENT '用户ID',
  username VARCHAR(50) UNIQUE COMMENT '用户名',
  password VARCHAR(255) COMMENT '密码(加密)',
  phone VARCHAR(20) UNIQUE COMMENT '手机号',
  email VARCHAR(100) UNIQUE COMMENT '邮箱',
  nickname VARCHAR(50) COMMENT '昵称',
  avatar VARCHAR(255) COMMENT '头像URL',
  wechat_openid VARCHAR(100) UNIQUE COMMENT '微信OpenID',
  wechat_unionid VARCHAR(100) COMMENT '微信UnionID',
  subscription_level INT DEFAULT 0 COMMENT '订阅等级: 0-免费, 1-基础, 2-高级',
  subscription_expire_time DATETIME COMMENT '订阅到期时间',
  status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
  last_login_time DATETIME COMMENT '最后登录时间',
  last_login_ip VARCHAR(50) COMMENT '最后登录IP',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_phone (phone),
  INDEX idx_wechat_openid (wechat_openid),
  INDEX idx_subscription_level (subscription_level),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================
-- 2. 项目分类表(project_categories)
-- ============================================
CREATE TABLE IF NOT EXISTS project_categories (
  id VARCHAR(36) PRIMARY KEY COMMENT '分类ID',
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  parent_id VARCHAR(36) COMMENT '父分类ID',
  level INT DEFAULT 1 COMMENT '分类层级',
  sort_order INT DEFAULT 0 COMMENT '排序顺序',
  icon VARCHAR(255) COMMENT '分类图标',
  description VARCHAR(255) COMMENT '分类描述',
  status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_parent_id (parent_id),
  INDEX idx_level (level),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目分类表';

-- ============================================
-- 3. 项目表(projects)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(36) PRIMARY KEY COMMENT '项目ID',
  user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
  category_id VARCHAR(36) COMMENT '分类ID',
  name VARCHAR(100) NOT NULL COMMENT '项目名称',
  description TEXT COMMENT '项目描述',
  cover_image VARCHAR(255) COMMENT '封面图片URL',
  tags VARCHAR(255) COMMENT '标签(逗号分隔)',
  status TINYINT DEFAULT 1 COMMENT '状态: 0-草稿, 1-已发布',
  view_count INT DEFAULT 0 COMMENT '浏览次数',
  like_count INT DEFAULT 0 COMMENT '点赞次数',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES project_categories(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_category_id (category_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目表';

-- ============================================
-- 4. 任务表(tasks)
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(36) PRIMARY KEY COMMENT '任务ID',
  user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
  project_id VARCHAR(36) COMMENT '项目ID',
  title VARCHAR(100) NOT NULL COMMENT '任务标题',
  description TEXT COMMENT '任务描述',
  task_type VARCHAR(20) DEFAULT 'chat' COMMENT '任务类型: chat-对话, analysis-分析, report-报告',
  conversation_history JSON COMMENT 'AI对话历史记录',
  result TEXT COMMENT '任务结果',
  status TINYINT DEFAULT 0 COMMENT '状态: 0-进行中, 1-已完成, 2-失败',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_project_id (project_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务表';

-- ============================================
-- 5. 订阅表(subscriptions)
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(36) PRIMARY KEY COMMENT '订阅ID',
  name VARCHAR(50) NOT NULL COMMENT '套餐名称',
  level INT NOT NULL COMMENT '订阅等级: 1-基础, 2-高级',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  duration INT NOT NULL COMMENT '订阅时长(天)',
  features TEXT COMMENT '功能特性(JSON格式)',
  max_projects INT COMMENT '最大项目数',
  max_tasks_per_month INT COMMENT '每月最大任务数',
  max_ai_calls_per_month INT COMMENT '每月最大AI调用次数',
  status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_level (level),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订阅表';

-- ============================================
-- 6. 订阅记录表(subscription_records)
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_records (
  id VARCHAR(36) PRIMARY KEY COMMENT '记录ID',
  user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
  subscription_id VARCHAR(36) NOT NULL COMMENT '订阅ID',
  start_time DATETIME NOT NULL COMMENT '开始时间',
  end_time DATETIME NOT NULL COMMENT '结束时间',
  amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  payment_method VARCHAR(20) COMMENT '支付方式: wechat-微信, alipay-支付宝',
  payment_status TINYINT DEFAULT 0 COMMENT '支付状态: 0-待支付, 1-已支付, 2-已取消',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_subscription_id (subscription_id),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订阅记录表';

-- ============================================
-- 7. 初始化数据
-- ============================================

-- 初始化项目分类数据
INSERT INTO project_categories (id, name, parent_id, level, sort_order, description) VALUES
('1', '人工智能', NULL, 1, 1, 'AI相关项目'),
('2', '数据分析', NULL, 1, 2, '数据分析相关项目'),
('3', '自然语言处理', '1', 2, 1, 'NLP相关项目'),
('4', '计算机视觉', '1', 2, 2, 'CV相关项目'),
('5', '数据可视化', '2', 2, 1, '数据可视化相关项目'),
('6', '预测分析', '2', 2, 2, '预测分析相关项目');

-- 初始化订阅套餐数据
INSERT INTO subscriptions (id, name, level, price, duration, features, max_projects, max_tasks_per_month, max_ai_calls_per_month) VALUES
('1', '基础套餐', 1, 9.90, 30, '{"chat": true, "analysis": true, "report": false}', 5, 50, 100),
('2', '高级套餐', 2, 29.90, 30, '{"chat": true, "analysis": true, "report": true}', 20, 200, 500);
