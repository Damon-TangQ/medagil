INSERT INTO users (id, username, email, phone, status, created_at, updated_at) VALUES 
(1, E'zhangsan', E'zhangsan@example.com', E'13800138001', E'active', NOW() - INTERVAL '30 days', NOW()),
(2, E'lisi', E'lisi@example.com', E'13800138002', E'active', NOW() - INTERVAL '25 days', NOW()),
(3, E'wangwu', E'wangwu@example.com', E'13800138003', E'active', NOW() - INTERVAL '20 days', NOW()),
(4, E'zhaoliu', E'zhaoliu@example.com', E'13800138004', E'active', NOW() - INTERVAL '15 days', NOW()),
(5, E'qianqi', E'qianqi@example.com', E'13800138005', E'active', NOW() - INTERVAL '10 days', NOW());
