-- ========================================
-- Medagil 管理后台演示数据
-- ========================================

-- 清理现有数据
DELETE FROM task_files;
DELETE FROM task_feedbacks;
DELETE FROM tasks;
DELETE FROM knowledge_documents;
DELETE FROM knowledge_bases;
DELETE FROM subscriptions;
DELETE FROM credits;
DELETE FROM projects;
DELETE FROM user_auth_identities;
DELETE FROM user_tag_relations;
DELETE FROM user_tags;
DELETE FROM users;

-- ========================================
-- 用户数据
-- ========================================
INSERT INTO users (id, username, email, phone, status, created_at, updated_at) VALUES
(1, 'zhangsan', 'zhangsan@example.com', '13800138001', 'active', NOW() - INTERVAL '30 days', NOW()),
(2, 'lisi', 'lisi@example.com', '13800138002', 'active', NOW() - INTERVAL '25 days', NOW()),
(3, 'wangwu', 'wangwu@example.com', '13800138003', 'active', NOW() - INTERVAL '20 days', NOW()),
(4, 'zhaoliu', 'zhaoliu@example.com', '13800138004', 'active', NOW() - INTERVAL '15 days', NOW()),
(5, 'qianqi', 'qianqi@example.com', '13800138005', 'active', NOW() - INTERVAL '10 days', NOW());

-- 用户认证身份
INSERT INTO user_auth_identities (user_id, provider, provider_user_id, created_at, updated_at) VALUES
(1, 'wechat', 'wx_openid_001', NOW() - INTERVAL '30 days', NOW()),
(1, 'phone', '13800138001', NOW() - INTERVAL '30 days', NOW()),
(2, 'wechat', 'wx_openid_002', NOW() - INTERVAL '25 days', NOW()),
(2, 'email', 'lisi@example.com', NOW() - INTERVAL '25 days', NOW()),
(3, 'wechat', 'wx_openid_003', NOW() - INTERVAL '20 days', NOW()),
(4, 'wechat', 'wx_openid_004', NOW() - INTERVAL '15 days', NOW()),
(5, 'wechat', 'wx_openid_005', NOW() - INTERVAL '10 days', NOW());

-- 用户标签
INSERT INTO user_tags (id, name, color, created_at, updated_at) VALUES
(1, '活跃用户', '#22c55e', NOW(), NOW()),
(2, '高价值用户', '#f59e0b', NOW(), NOW()),
(3, '新用户', '#3b82f6', NOW(), NOW());

-- 用户标签关系
INSERT INTO user_tag_relations (user_id, tag_id, created_at) VALUES
(1, 1, NOW()),
(1, 2, NOW()),
(2, 1, NOW()),
(3, 3, NOW()),
(4, 3, NOW());

-- ========================================
-- 项目数据
-- ========================================
INSERT INTO projects (id, user_id, name, description, status, global_prompt, created_at, updated_at) VALUES
(1, 1, '肿瘤免疫治疗研究', '研究PD-1/PD-L1抑制剂在肿瘤治疗中的应用', 'active', '请使用专业的医学术语，注重临床数据的准确性和循证医学证据', NOW() - INTERVAL '20 days', NOW()),
(2, 1, '心血管疾病临床研究', '高血压、冠心病的临床治疗方案对比分析', 'active', '关注临床试验数据和治疗效果评估', NOW() - INTERVAL '15 days', NOW()),
(3, 2, '神经退行性疾病研究', '阿尔茨海默病和帕金森病的发病机制研究', 'active', '重点分析分子机制和药物靶点', NOW() - INTERVAL '12 days', NOW()),
(4, 3, '糖尿病并发症研究', '糖尿病肾病、视网膜病变的预防和治疗', 'active', '注重预防和早期干预策略', NOW() - INTERVAL '10 days', NOW()),
(5, 4, '肿瘤免疫治疗研究', 'CAR-T细胞疗法在血液肿瘤中的应用', 'active', '关注临床试验数据和治疗效果评估', NOW() - INTERVAL '8 days', NOW()),
(6, 5, '心血管疾病临床研究', '心肌梗死后的康复治疗研究', 'active', '关注康复方案和预后评估', NOW() - INTERVAL '5 days', NOW());

-- ========================================
-- 任务数据
-- ========================================
INSERT INTO tasks (id, user_id, task_no, agent_type, status, dify_task_id, created_at, updated_at) VALUES
(1, 1, 'TASK20240226001', 'paper-outline', 'completed', 'dify_task_001', NOW() - INTERVAL '18 days', NOW()),
(2, 1, 'TASK20240226002', 'paper-polish', 'completed', 'dify_task_002', NOW() - INTERVAL '15 days', NOW()),
(3, 2, 'TASK20240226003', 'paper-review', 'completed', 'dify_task_003', NOW() - INTERVAL '12 days', NOW()),
(4, 2, 'TASK20240226004', 'paper-outline', 'running', 'dify_task_004', NOW() - INTERVAL '10 days', NOW()),
(5, 3, 'TASK20240226005', 'paper-polish', 'pending', NULL, NOW() - INTERVAL '8 days', NOW()),
(6, 3, 'TASK20240226006', 'paper-outline', 'completed', 'dify_task_005', NOW() - INTERVAL '6 days', NOW()),
(7, 4, 'TASK20240226007', 'paper-review', 'failed', 'dify_task_006', NOW() - INTERVAL '4 days', NOW()),
(8, 5, 'TASK20240226008', 'paper-outline', 'running', 'dify_task_007', NOW() - INTERVAL '2 days', NOW()),
(9, 1, 'TASK20240226009', 'paper-polish', 'completed', 'dify_task_008', NOW() - INTERVAL '1 days', NOW()),
(10, 2, 'TASK20240226010', 'paper-outline', 'pending', NULL, NOW(), NOW());

-- 任务反馈
INSERT INTO task_feedbacks (task_id, user_id, rating, comment, created_at) VALUES
(1, 1, 5, 'AI生成的论文大纲结构清晰，逻辑严密，非常满意', NOW() - INTERVAL '17 days'),
(2, 1, 4, '润色后的论文语言更加流畅，但部分术语可以更准确', NOW() - INTERVAL '14 days'),
(3, 2, 5, '评审意见专业且全面，对论文改进很有帮助', NOW() - INTERVAL '11 days'),
(6, 3, 5, '大纲生成质量很高，节省了很多时间', NOW() - INTERVAL '5 days'),
(9, 1, 4, '整体不错，但可以增加更多参考文献建议', NOW());

-- ========================================
-- 知识库数据
-- ========================================
INSERT INTO knowledge_bases (id, user_id, name, description, status, created_at, updated_at) VALUES
(1, 1, '肿瘤学临床指南', '收录最新的肿瘤学临床指南和诊疗规范', 'active', NOW() - INTERVAL '25 days', NOW()),
(2, 1, 'SCI论文写作模板', '包含各类型SCI论文的标准写作模板', 'active', NOW() - INTERVAL '20 days', NOW()),
(3, 2, '心血管疾病诊疗规范', '心血管疾病的最新诊疗指南和临床路径', 'active', NOW() - INTERVAL '15 days', NOW()),
(4, 3, '神经退行性疾病研究', '阿尔茨海默病、帕金森病等疾病的研究进展', 'active', NOW() - INTERVAL '12 days', NOW()),
(5, 4, '糖尿病并发症防治', '糖尿病各种并发症的预防和治疗指南', 'active', NOW() - INTERVAL '10 days', NOW());

-- 知识库文档
INSERT INTO knowledge_documents (id, knowledge_base_id, title, content, type, status, created_at, updated_at) VALUES
(1, 1, 'NCCN肿瘤学临床指南2024版', 'NCCN（National Comprehensive Cancer Network）2024年发布的肿瘤学临床指南，包含各类肿瘤的诊断、分期和治疗建议...', 'text', 'active', NOW() - INTERVAL '24 days', NOW()),
(2, 1, 'ESMO肿瘤学临床指南', '欧洲肿瘤内科学会（ESMO）发布的临床实践指南，涵盖实体瘤和血液肿瘤的诊疗建议...', 'text', 'active', NOW() - INTERVAL '23 days', NOW()),
(3, 2, 'SCI论文写作规范', 'SCI论文的基本结构、写作规范和投稿要求...', 'text', 'active', NOW() - INTERVAL '19 days', NOW()),
(4, 2, '医学论文图表制作指南', '医学论文中各类图表的制作规范和注意事项...', 'text', 'active', NOW() - INTERVAL '18 days', NOW()),
(5, 3, '高血压诊疗指南', '中国高血压防治指南2023版...', 'text', 'active', NOW() - INTERVAL '14 days', NOW()),
(6, 3, '冠心病诊断与治疗', '冠心病的最新诊断标准和治疗方案...', 'text', 'active', NOW() - INTERVAL '13 days', NOW()),
(7, 4, '阿尔茨海默病诊断标准', 'NIA-AA最新诊断标准和生物标志物...', 'text', 'active', NOW() - INTERVAL '11 days', NOW()),
(8, 4, '帕金森病治疗进展', '帕金森病的药物治疗和手术治疗最新进展...', 'text', 'active', NOW() - INTERVAL '10 days', NOW()),
(9, 5, '糖尿病肾病防治', '糖尿病肾病的早期诊断和干预策略...', 'text', 'active', NOW() - INTERVAL '9 days', NOW()),
(10, 5, '糖尿病视网膜病变', '糖尿病视网膜病变的筛查和治疗方案...', 'text', 'active', NOW() - INTERVAL '8 days', NOW());

-- ========================================
-- 订阅数据
-- ========================================
INSERT INTO subscriptions (id, user_id, plan, status, start_date, end_date, created_at, updated_at) VALUES
(1, 1, 'pro', 'active', NOW() - INTERVAL '30 days', NOW() + INTERVAL '335 days', NOW() - INTERVAL '30 days', NOW()),
(2, 2, 'pro', 'active', NOW() - INTERVAL '25 days', NOW() + INTERVAL '340 days', NOW() - INTERVAL '25 days', NOW()),
(3, 3, 'free', 'active', NOW() - INTERVAL '20 days', NOW() + INTERVAL '10 days', NOW() - INTERVAL '20 days', NOW()),
(4, 4, 'max', 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '345 days', NOW() - INTERVAL '15 days', NOW()),
(5, 5, 'free', 'active', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', NOW() - INTERVAL '10 days', NOW());

-- ========================================
-- 积分数据
-- ========================================
INSERT INTO credits (id, user_id, type, amount, description, created_at) VALUES
(1, 1, 'earn', 1000, '注册奖励', NOW() - INTERVAL '30 days'),
(2, 1, 'earn', 500, '每日签到奖励', NOW() - INTERVAL '29 days'),
(3, 1, 'spend', -50, '生成论文大纲', NOW() - INTERVAL '18 days'),
(4, 1, 'spend', -30, '论文润色', NOW() - INTERVAL '15 days'),
(5, 2, 'earn', 1000, '注册奖励', NOW() - INTERVAL '25 days'),
(6, 2, 'spend', -50, '生成论文大纲', NOW() - INTERVAL '12 days'),
(7, 2, 'spend', -30, '论文润色', NOW() - INTERVAL '10 days'),
(8, 3, 'earn', 1000, '注册奖励', NOW() - INTERVAL '20 days'),
(9, 3, 'spend', -50, '生成论文大纲', NOW() - INTERVAL '6 days'),
(10, 4, 'earn', 1000, '注册奖励', NOW() - INTERVAL '15 days'),
(11, 4, 'spend', -50, '生成论文大纲', NOW() - INTERVAL '4 days'),
(12, 5, 'earn', 1000, '注册奖励', NOW() - INTERVAL '10 days'),
(13, 5, 'spend', -50, '生成论文大纲', NOW() - INTERVAL '2 days'),
(14, 1, 'earn', 200, '完成论文评审任务', NOW() - INTERVAL '17 days'),
(15, 2, 'earn', 200, '完成论文评审任务', NOW() - INTERVAL '11 days'),
(16, 3, 'earn', 200, '完成论文大纲任务', NOW() - INTERVAL '5 days'),
(17, 1, 'earn', 500, '购买Pro套餐', NOW() - INTERVAL '30 days'),
(18, 2, 'earn', 500, '购买Pro套餐', NOW() - INTERVAL '25 days'),
(19, 4, 'earn', 1000, '购买Max套餐', NOW() - INTERVAL '15 days');

-- ========================================
-- 管理员数据
-- ========================================
INSERT INTO admins (id, username, password_hash, email, role, status, created_at, updated_at) VALUES
(1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17fhWy', 'admin@medagil.com', 'super', 'active', NOW() - INTERVAL '60 days', NOW()),
(2, 'manager', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17fhWy', 'manager@medagil.com', 'admin', 'active', NOW() - INTERVAL '45 days', NOW());

-- 重置自增序列
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks));
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));
SELECT setval('knowledge_bases_id_seq', (SELECT MAX(id) FROM knowledge_bases));
SELECT setval('knowledge_documents_id_seq', (SELECT MAX(id) FROM knowledge_documents));
SELECT setval('subscriptions_id_seq', (SELECT MAX(id) FROM subscriptions));
SELECT setval('credits_id_seq', (SELECT MAX(id) FROM credits));
SELECT setval('admins_id_seq', (SELECT MAX(id) FROM admins));
