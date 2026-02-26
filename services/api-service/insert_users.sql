INSERT INTO users (id, username, email, phone, status, created_at, updated_at) VALUES 
(1, ''zhangsan'', ''zhangsan@example.com'', ''13800138001'', ''active'', NOW() - INTERVAL ''30 days'', NOW()),
(2, ''lisi'', ''lisi@example.com'', ''13800138002'', ''active'', NOW() - INTERVAL ''25 days'', NOW()),
(3, ''wangwu'', ''wangwu@example.com'', ''13800138003'', ''active'', NOW() - INTERVAL ''20 days'', NOW()),
(4, ''zhaoliu'', ''zhaoliu@example.com'', ''13800138004'', ''active'', NOW() - INTERVAL ''15 days'', NOW()),
(5, ''qianqi'', ''qianqi@example.com'', ''13800138005'', ''active'', NOW() - INTERVAL ''10 days'', NOW());
