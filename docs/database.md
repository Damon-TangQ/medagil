# Medagil平台数据库设计文档

## 数据库概述

Medagil平台使用MySQL数据库，包含用户、项目、任务、订阅等核心业务数据。

## 数据库表结构

### 1. 用户表(users)

存储用户基本信息、登录信息和订阅状态。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(36) | 用户ID，主键 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(255) | 密码(加密) |
| phone | VARCHAR(20) | 手机号，唯一 |
| email | VARCHAR(100) | 邮箱，唯一 |
| nickname | VARCHAR(50) | 昵称 |
| avatar | VARCHAR(255) | 头像URL |
| wechat_openid | VARCHAR(100) | 微信OpenID，唯一 |
| wechat_unionid | VARCHAR(100) | 微信UnionID |
| subscription_level | INT | 订阅等级: 0-免费, 1-基础, 2-高级 |
| subscription_expire_time | DATETIME | 订阅到期时间 |
| status | TINYINT | 状态: 0-禁用, 1-正常 |
| last_login_time | DATETIME | 最后登录时间 |
| last_login_ip | VARCHAR(50) | 最后登录IP |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 2. 项目分类表(project_categories)

存储项目分类信息，支持多级分类。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(36) | 分类ID，主键 |
| name | VARCHAR(50) | 分类名称 |
| parent_id | VARCHAR(36) | 父分类ID |
| level | INT | 分类层级 |
| sort_order | INT | 排序顺序 |
| icon | VARCHAR(255) | 分类图标 |
| description | VARCHAR(255) | 分类描述 |
| status | TINYINT | 状态: 0-禁用, 1-正常 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 3. 项目表(projects)

存储项目信息，关联用户和分类。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(36) | 项目ID，主键 |
| user_id | VARCHAR(36) | 用户ID，外键 |
| category_id | VARCHAR(36) | 分类ID，外键 |
| name | VARCHAR(100) | 项目名称 |
| description | TEXT | 项目描述 |
| cover_image | VARCHAR(255) | 封面图片URL |
| tags | VARCHAR(255) | 标签(逗号分隔) |
| status | TINYINT | 状态: 0-草稿, 1-已发布 |
| view_count | INT | 浏览次数 |
| like_count | INT | 点赞次数 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 4. 任务表(tasks)

存储任务信息，包括AI对话历史记录。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(36) | 任务ID，主键 |
| user_id | VARCHAR(36) | 用户ID，外键 |
| project_id | VARCHAR(36) | 项目ID，外键 |
| title | VARCHAR(100) | 任务标题 |
| description | TEXT | 任务描述 |
| task_type | VARCHAR(20) | 任务类型: chat-对话, analysis-分析, report-报告 |
| conversation_history | JSON | AI对话历史记录 |
| result | TEXT | 任务结果 |
| status | TINYINT | 状态: 0-进行中, 1-已完成, 2-失败 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 5. 订阅表(subscriptions)

存储订阅套餐信息。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(36) | 订阅ID，主键 |
| name | VARCHAR(50) | 套餐名称 |
| level | INT | 订阅等级: 1-基础, 2-高级 |
| price | DECIMAL(10,2) | 价格 |
| duration | INT | 订阅时长(天) |
| features | TEXT | 功能特性(JSON格式) |
| max_projects | INT | 最大项目数 |
| max_tasks_per_month | INT | 每月最大任务数 |
| max_ai_calls_per_month | INT | 每月最大AI调用次数 |
| status | TINYINT | 状态: 0-禁用, 1-正常 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 6. 订阅记录表(subscription_records)

存储用户订阅记录。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | VARCHAR(36) | 记录ID，主键 |
| user_id | VARCHAR(36) | 用户ID，外键 |
| subscription_id | VARCHAR(36) | 订阅ID，外键 |
| start_time | DATETIME | 开始时间 |
| end_time | DATETIME | 结束时间 |
| amount | DECIMAL(10,2) | 支付金额 |
| payment_method | VARCHAR(20) | 支付方式: wechat-微信, alipay-支付宝 |
| payment_status | TINYINT | 支付状态: 0-待支付, 1-已支付, 2-已取消 |
| created_at | DATETIME | 创建时间 |

## 数据库使用

### 初始化数据库

1. 配置数据库连接信息
2. 运行初始化脚本：
```bash
cd backend/database
node init.js
```

### 数据库模型使用

```javascript
const { User, Project, Task, Subscription, SubscriptionRecord, ProjectCategory } = require('./database/models');

// 查询用户
const user = await User.findById(userId);

// 创建项目
const project = await Project.createProject({
  user_id: userId,
  name: '新项目',
  description: '项目描述'
});

// 创建任务
const task = await Task.createTask({
  user_id: userId,
  project_id: projectId,
  title: '新任务',
  description: '任务描述'
});
```

## 数据库备份与恢复

### 备份数据库

```bash
mysqldump -u root -p medagil_platform > backup.sql
```

### 恢复数据库

```bash
mysql -u root -p medagil_platform < backup.sql
```

## 性能优化建议

1. 为常用查询字段添加索引
2. 定期清理过期数据
3. 使用连接池管理数据库连接
4. 对大表进行分区处理
5. 定期分析查询性能，优化慢查询
