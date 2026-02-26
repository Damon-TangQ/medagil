-- Clean existing data
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

-- Users data
INSERT INTO users (id, username, email, phone, status, created_at, updated_at) VALUES
(1, 'zhangsan', 'zhangsan@example.com', '13800138001', 'active', NOW() - INTERVAL '30 days', NOW()),
(2, 'lisi', 'lisi@example.com', '13800138002', 'active', NOW() - INTERVAL '25 days', NOW()),
(3, 'wangwu', 'wangwu@example.com', '13800138003', 'active', NOW() - INTERVAL '20 days', NOW()),
(4, 'zhaoliu', 'zhaoliu@example.com', '13800138004', 'active', NOW() - INTERVAL '15 days', NOW()),
(5, 'qianqi', 'qianqi@example.com', '13800138005', 'active', NOW() - INTERVAL '10 days', NOW());

-- User tags
INSERT INTO user_tags (id, name, color, created_at, updated_at) VALUES
(1, 'Active User', '#22c55e', NOW(), NOW()),
(2, 'High Value User', '#f59e0b', NOW(), NOW()),
(3, 'New User', '#3b82f6', NOW(), NOW());

-- User tag relations
INSERT INTO user_tag_relations (user_id, tag_id, created_at) VALUES
(1, 1, NOW()),
(1, 2, NOW()),
(2, 1, NOW()),
(3, 3, NOW()),
(4, 3, NOW());

-- User auth identities
INSERT INTO user_auth_identities (user_id, provider, provider_user_id, created_at, updated_at) VALUES
(1, 'wechat', 'wx_openid_001', NOW() - INTERVAL '30 days', NOW()),
(1, 'phone', '13800138001', NOW() - INTERVAL '30 days', NOW()),
(2, 'wechat', 'wx_openid_002', NOW() - INTERVAL '25 days', NOW()),
(2, 'email', 'lisi@example.com', NOW() - INTERVAL '25 days', NOW()),
(3, 'wechat', 'wx_openid_003', NOW() - INTERVAL '20 days', NOW()),
(4, 'wechat', 'wx_openid_004', NOW() - INTERVAL '15 days', NOW()),
(5, 'wechat', 'wx_openid_005', NOW() - INTERVAL '10 days', NOW());

-- Projects data
INSERT INTO projects (id, user_id, name, description, status, global_prompt, created_at, updated_at) VALUES
(1, 1, 'Tumor Immunotherapy Research', 'Research on PD-1/PD-L1 inhibitors in cancer treatment', 'active', 'Use professional medical terminology, focus on clinical data accuracy and evidence-based medicine', NOW() - INTERVAL '20 days', NOW()),
(2, 1, 'Cardiovascular Disease Clinical Research', 'Comparative analysis of hypertension and coronary heart disease treatment', 'active', 'Focus on clinical trial data and treatment outcome assessment', NOW() - INTERVAL '15 days', NOW()),
(3, 2, 'Neurodegenerative Disease Research', 'Research on pathogenesis of Alzheimer''s and Parkinson''s disease', 'active', 'Focus on molecular mechanisms and drug targets', NOW() - INTERVAL '12 days', NOW()),
(4, 3, 'Diabetes Complications Research', 'Prevention and treatment of diabetic nephropathy and retinopathy', 'active', 'Focus on prevention and early intervention strategies', NOW() - INTERVAL '10 days', NOW()),
(5, 4, 'Tumor Immunotherapy Research', 'Application of CAR-T cell therapy in hematological malignancies', 'active', 'Focus on clinical trial data and treatment outcome assessment', NOW() - INTERVAL '8 days', NOW()),
(6, 5, 'Cardiovascular Disease Clinical Research', 'Rehabilitation treatment research after myocardial infarction', 'active', 'Focus on rehabilitation protocols and prognosis assessment', NOW() - INTERVAL '5 days', NOW());

-- Tasks data
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

-- Task feedback
INSERT INTO task_feedbacks (task_id, user_id, rating, comment, created_at) VALUES
(1, 1, 5, 'AI generated paper outline has clear structure and rigorous logic, very satisfied', NOW() - INTERVAL '17 days'),
(2, 1, 4, 'Polished paper language is more fluent, but some terms could be more accurate', NOW() - INTERVAL '14 days'),
(3, 2, 5, 'Review comments are professional and comprehensive, very helpful for paper improvement', NOW() - INTERVAL '11 days'),
(6, 3, 5, 'High quality outline generation, saved a lot of time', NOW() - INTERVAL '5 days'),
(9, 1, 4, 'Overall good, but could add more reference suggestions', NOW());

-- Knowledge bases data
INSERT INTO knowledge_bases (id, user_id, name, description, status, created_at, updated_at) VALUES
(1, 1, 'Oncology Clinical Guidelines', 'Collection of latest oncology clinical guidelines and diagnostic standards', 'active', NOW() - INTERVAL '25 days', NOW()),
(2, 1, 'SCI Paper Writing Templates', 'Standard writing templates for various types of SCI papers', 'active', NOW() - INTERVAL '20 days', NOW()),
(3, 2, 'Cardiovascular Disease Guidelines', 'Latest diagnostic guidelines and clinical pathways for cardiovascular diseases', 'active', NOW() - INTERVAL '15 days', NOW()),
(4, 3, 'Neurodegenerative Disease Research', 'Research progress on Alzheimer''s, Parkinson''s and other diseases', 'active', NOW() - INTERVAL '12 days', NOW()),
(5, 4, 'Diabetes Complications Prevention', 'Prevention and treatment guidelines for various diabetes complications', 'active', NOW() - INTERVAL '10 days', NOW());

-- Knowledge documents
INSERT INTO knowledge_documents (id, knowledge_base_id, title, content, type, status, created_at, updated_at) VALUES
(1, 1, 'NCCN Oncology Guidelines 2024', 'NCCN 2024 oncology clinical guidelines including diagnosis, staging and treatment recommendations for various cancers...', 'text', 'active', NOW() - INTERVAL '24 days', NOW()),
(2, 1, 'ESMO Oncology Guidelines', 'ESMO clinical practice guidelines covering solid tumors and hematological malignancies...', 'text', 'active', NOW() - INTERVAL '23 days', NOW()),
(3, 2, 'SCI Paper Writing Standards', 'Basic structure, writing standards and submission requirements for SCI papers...', 'text', 'active', NOW() - INTERVAL '19 days', NOW()),
(4, 2, 'Medical Paper Chart Guidelines', 'Chart production standards and considerations in medical papers...', 'text', 'active', NOW() - INTERVAL '18 days', NOW()),
(5, 3, 'Hypertension Guidelines', 'China Hypertension Prevention and Treatment Guidelines 2023...', 'text', 'active', NOW() - INTERVAL '14 days', NOW()),
(6, 3, 'Coronary Heart Disease Treatment', 'Latest diagnostic criteria and treatment protocols for coronary heart disease...', 'text', 'active', NOW() - INTERVAL '13 days', NOW()),
(7, 4, 'Alzheimer''s Diagnosis Criteria', 'NIA-AA latest diagnostic criteria and biomarkers...', 'text', 'active', NOW() - INTERVAL '11 days', NOW()),
(8, 4, 'Parkinson''s Treatment Progress', 'Latest progress in drug therapy and surgical treatment for Parkinson''s disease...', 'text', 'active', NOW() - INTERVAL '10 days', NOW()),
(9, 5, 'Diabetic Nephropathy Prevention', 'Early diagnosis and intervention strategies for diabetic nephropathy...', 'text', 'active', NOW() - INTERVAL '9 days', NOW()),
(10, 5, 'Diabetic Retinopathy', 'Screening and treatment protocols for diabetic retinopathy...', 'text', 'active', NOW() - INTERVAL '8 days', NOW());

-- Subscriptions data
INSERT INTO subscriptions (id, user_id, plan, status, start_date, end_date, created_at, updated_at) VALUES
(1, 1, 'pro', 'active', NOW() - INTERVAL '30 days', NOW() + INTERVAL '335 days', NOW() - INTERVAL '30 days', NOW()),
(2, 2, 'pro', 'active', NOW() - INTERVAL '25 days', NOW() + INTERVAL '340 days', NOW() - INTERVAL '25 days', NOW()),
(3, 3, 'free', 'active', NOW() - INTERVAL '20 days', NOW() + INTERVAL '10 days', NOW() - INTERVAL '20 days', NOW()),
(4, 4, 'max', 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '345 days', NOW() - INTERVAL '15 days', NOW()),
(5, 5, 'free', 'active', NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', NOW() - INTERVAL '10 days', NOW());

-- Credits data
INSERT INTO credits (id, user_id, type, amount, description, created_at) VALUES
(1, 1, 'earn', 1000, 'Registration reward', NOW() - INTERVAL '30 days'),
(2, 1, 'earn', 500, 'Daily check-in reward', NOW() - INTERVAL '29 days'),
(3, 1, 'spend', -50, 'Generate paper outline', NOW() - INTERVAL '18 days'),
(4, 1, 'spend', -30, 'Paper polishing', NOW() - INTERVAL '15 days'),
(5, 2, 'earn', 1000, 'Registration reward', NOW() - INTERVAL '25 days'),
(6, 2, 'spend', -50, 'Generate paper outline', NOW() - INTERVAL '12 days'),
(7, 2, 'spend', -30, 'Paper polishing', NOW() - INTERVAL '10 days'),
(8, 3, 'earn', 1000, 'Registration reward', NOW() - INTERVAL '20 days'),
(9, 3, 'spend', -50, 'Generate paper outline', NOW() - INTERVAL '6 days'),
(10, 4, 'earn', 1000, 'Registration reward', NOW() - INTERVAL '15 days'),
(11, 4, 'spend', -50, 'Generate paper outline', NOW() - INTERVAL '4 days'),
(12, 5, 'earn', 1000, 'Registration reward', NOW() - INTERVAL '10 days'),
(13, 5, 'spend', -50, 'Generate paper outline', NOW() - INTERVAL '2 days'),
(14, 1, 'earn', 200, 'Complete paper review task', NOW() - INTERVAL '17 days'),
(15, 2, 'earn', 200, 'Complete paper review task', NOW() - INTERVAL '11 days'),
(16, 3, 'earn', 200, 'Complete paper outline task', NOW() - INTERVAL '5 days'),
(17, 1, 'earn', 500, 'Purchase Pro plan', NOW() - INTERVAL '30 days'),
(18, 2, 'earn', 500, 'Purchase Pro plan', NOW() - INTERVAL '25 days'),
(19, 4, 'earn', 1000, 'Purchase Max plan', NOW() - INTERVAL '15 days');

-- Admin data
INSERT INTO admins (id, username, password_hash, email, role, status, created_at, updated_at) VALUES
(1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17fhWy', 'admin@medagil.com', 'super', 'active', NOW() - INTERVAL '60 days', NOW()),
(2, 'manager', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17fhWy', 'manager@medagil.com', 'admin', 'active', NOW() - INTERVAL '45 days', NOW());

-- Reset sequences
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks));
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));
SELECT setval('knowledge_bases_id_seq', (SELECT MAX(id) FROM knowledge_bases));
SELECT setval('knowledge_documents_id_seq', (SELECT MAX(id) FROM knowledge_documents));
SELECT setval('subscriptions_id_seq', (SELECT MAX(id) FROM subscriptions));
SELECT setval('credits_id_seq', (SELECT MAX(id) FROM credits));
SELECT setval('admins_id_seq', (SELECT MAX(id) FROM admins));
