-- ========================================
-- 数据库索引创建脚本（增强版）
-- 用于提高分页查询性能
-- ========================================

-- 注意事项：
-- 1. 在执行此脚本前，请确保已连接到正确的数据库
-- 2. 索引创建可能需要较长时间，取决于数据量
-- 3. 创建索引期间可能会锁定表，影响写入性能
-- 4. 建议在低峰期执行索引创建操作
-- 
-- 使用方法：
--   psql -U username -d database_name -f create_indexes_enhanced.sql
-- 
-- 验证索引：
--   SELECT * FROM pg_indexes WHERE tablename = 'table_name';
-- 
-- 删除索引：
--   DROP INDEX index_name;

-- ========================================
-- projects表索引
-- ========================================

-- 主键索引（通常自动创建，但这里明确说明）
-- 作用：加速按ID查询
-- 类型：B-tree索引，适合等值查询和范围查询
CREATE INDEX IF NOT EXISTS idx_projects_id 
ON projects(id DESC);

-- 用户ID索引
-- 作用：加速按用户ID查询项目列表
-- 使用场景：查询某个用户的所有项目
-- 类型：B-tree索引
CREATE INDEX IF NOT EXISTS idx_projects_user_id 
ON projects(user_id);

-- 创建时间索引
-- 作用：加速按创建时间排序和范围查询
-- 使用场景：查询最近创建的项目
-- 类型：B-tree索引，降序排列
CREATE INDEX IF NOT EXISTS idx_projects_created_at 
ON projects(created_at DESC);

-- 状态索引
-- 作用：加速按状态查询
-- 使用场景：查询特定状态的项目（如active、archived）
-- 类型：B-tree索引
CREATE INDEX IF NOT EXISTS idx_projects_status 
ON projects(status);

-- 复合索引：用户ID + 创建时间
-- 作用：加速按用户ID和创建时间组合查询
-- 使用场景：查询某个用户最近创建的项目
-- 类型：B-tree复合索引
CREATE INDEX IF NOT EXISTS idx_projects_user_created 
ON projects(user_id, created_at DESC);

-- ========================================
-- tasks表索引
-- ========================================

-- 主键索引
-- 作用：加速按ID查询任务
-- 类型：B-tree索引，降序排列
CREATE INDEX IF NOT EXISTS idx_tasks_id 
ON tasks(id DESC);

-- 用户ID索引
-- 作用：加速按用户ID查询任务列表
-- 使用场景：查询某个用户的所有任务
-- 类型：B-tree索引
CREATE INDEX IF NOT EXISTS idx_tasks_user_id 
ON tasks(user_id);

-- 任务状态索引
-- 作用：加速按状态查询
-- 使用场景：查询特定状态的任务（如running、completed）
-- 类型：B-tree索引
CREATE INDEX IF NOT EXISTS idx_tasks_status 
ON tasks(status);

-- 创建时间索引
-- 作用：加速按创建时间排序和范围查询
-- 使用场景：查询最近创建的任务
-- 类型：B-tree索引，降序排列
CREATE INDEX IF NOT EXISTS idx_tasks_created_at 
ON tasks(created_at DESC);

-- 任务编号索引
-- 作用：加速按任务编号查询
-- 使用场景：通过task_no查询任务
-- 类型：B-tree索引
CREATE INDEX IF NOT EXISTS idx_tasks_task_no 
ON tasks(task_no);

-- 智能体类型索引
-- 作用：加速按智能体类型查询
-- 使用场景：查询特定类型的任务
-- 类型：B-tree索引
CREATE INDEX IF NOT EXISTS idx_tasks_agent_type 
ON tasks(agent_type);

-- 复合索引：用户ID + 状态 + 创建时间
-- 作用：加速组合查询
-- 使用场景：查询某个用户特定状态的任务，按时间排序
-- 类型：B-tree复合索引
CREATE INDEX IF NOT EXISTS idx_tasks_user_status_created 
ON tasks(user_id, status, created_at DESC);

-- ========================================
-- orders表索引
-- ========================================

-- 主键索引
-- 作用：加速按ID查询订单
-- 类型：B-tree索引，降序排列
CREATE INDEX IF NOT EXISTS idx_orders_id 
ON orders(id DESC);

-- 用户ID索引
-- 作用：加速按用户ID查询订单列表
-- 使用场景：查询某个用户的所有订单
-- 类型：B-tree索引
CREATE INDEX IF NOT EXISTS idx_orders_user_id 
ON orders(user_id);

-- 订单状态索引
-- 作用：加速按状态查询
-- 使用场景：查询特定状态的订单（如paid、pending）
-- 类型：B-tree索引
CREATE INDEX IF NOT EXISTS idx_orders_status 
ON orders(status);

-- 创建时间索引
-- 作用：加速按创建时间排序和范围查询
-- 使用场景：查询最近创建的订单
-- 类型：B-tree索引，降序排列
CREATE INDEX IF NOT EXISTS idx_orders_created_at 
ON orders(created_at DESC);

-- 订单编号索引
-- 作用：加速按订单编号查询
-- 使用场景：通过order_no查询订单
-- 类型：B-tree索引
CREATE INDEX IF NOT EXISTS idx_orders_order_no 
ON orders(order_no);

-- 支付状态索引
-- 作用：加速按支付状态查询
-- 使用场景：查询特定支付状态的订单
-- 类型：B-tree索引
CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
ON orders(payment_status);

-- 复合索引：用户ID + 状态 + 创建时间
-- 作用：加速组合查询
-- 使用场景：查询某个用户特定状态的订单，按时间排序
-- 类型：B-tree复合索引
CREATE INDEX IF NOT EXISTS idx_orders_user_status_created 
ON orders(user_id, status, created_at DESC);

-- ========================================
-- 索引验证查询
-- ========================================

-- 查看所有索引
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 查看索引大小
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_indexes pi
JOIN pg_class pc ON pi.indexrelid = pc.oid
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- 查看索引使用情况
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- ========================================
-- 索引维护建议
-- ========================================

-- 1. 定期分析表和索引
-- ANALYZE TABLE projects;
-- ANALYZE TABLE tasks;
-- ANALYZE TABLE orders;

-- 2. 重建碎片化的索引
-- REINDEX TABLE projects;
-- REINDEX TABLE tasks;
-- REINDEX TABLE orders;

-- 3. 删除未使用的索引
-- 查找未使用的索引：
-- SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;
-- 删除未使用的索引：
-- DROP INDEX index_name;

-- ========================================
-- 性能监控查询
-- ========================================

-- 查看慢查询
-- 需要启用pg_stat_statements扩展
-- CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
-- 
-- SELECT 
--     query,
--     calls,
--     total_time,
--     mean_time,
--     rows
-- FROM pg_stat_statements
-- ORDER BY mean_time DESC
-- LIMIT 10;

-- 查看表大小
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ========================================
-- 索引优化建议
-- ========================================

-- 1. 选择性高的字段适合创建索引
--    选择性 = COUNT(DISTINCT column) / COUNT(*)
--    选择性接近1的字段适合创建索引

-- 2. 复合索引的字段顺序很重要
--    将选择性高的字段放在前面
--    将常用查询条件的字段放在前面

-- 3. 避免过度索引
--    每个表建议不超过5-7个索引
--    过多的索引会影响写入性能

-- 4. 定期维护索引
--    删除未使用的索引
--    重建碎片化的索引
--    分析表统计信息

-- 5. 监控索引性能
--    定期检查索引使用情况
--    优化低效的索引
--    根据实际查询模式调整索引
