package repositories

// 注意：toInterfaceSlice和Paginate函数已被移除
// 
// 原因：
// 1. 分页查询已改用GORM原生分页（Offset().Limit()），性能更优
// 2. 不再将所有数据加载到内存后再分页，避免内存溢出
// 3. 数据库层面的分页更高效，特别是大数据量场景（10万+条）
// 
// 新的分页实现：
// - 各repository（project_repository.go、task_repository.go、order_repository.go）
//   中的FindPaginated方法使用GORM原生分页
// - 使用Offset和Limit实现数据库层面的分页
// - 查询总数和分页数据在数据库层面完成
// 
// 性能对比：
// 旧方案（内存分页）：
//   - 查询所有数据到内存
//   - 在内存中切片分页
//   - 缺点：内存占用高，大数据量时性能差
// 
// 新方案（数据库分页）：
//   - 使用Offset和Limit在数据库层面分页
//   - 只查询当前页的数据
//   - 优点：内存占用低，性能稳定
// 
// 验证标准：
// - 大数据量（10万+条）分页查询响应时间<1s
// - 无内存溢出
// - 数据库连接数稳定
// 
// 索引建议：
// 为提高分页查询性能，建议为常用排序字段创建索引：
// 
// 1. projects表索引：
//    CREATE INDEX idx_projects_id ON projects(id DESC);
//    CREATE INDEX idx_projects_user_id ON projects(user_id);
//    CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
// 
// 2. tasks表索引：
//    CREATE INDEX idx_tasks_id ON tasks(id DESC);
//    CREATE INDEX idx_tasks_user_id ON tasks(user_id);
//    CREATE INDEX idx_tasks_status ON tasks(status);
//    CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
// 
// 3. orders表索引：
//    CREATE INDEX idx_orders_id ON orders(id DESC);
//    CREATE INDEX idx_orders_user_id ON orders(user_id);
//    CREATE INDEX idx_orders_status ON orders(status);
//    CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
// 
// 索引创建脚本：
// 请参考 create_indexes.sql 文件创建必要的索引
// 
// 索引维护：
// - 定期分析索引：ANALYZE TABLE table_name;
// - 监控索引使用情况：SELECT * FROM pg_stat_user_indexes;
// - 删除未使用的索引：DROP INDEX index_name;
// 
// 注意事项：
// - 索引会占用额外的存储空间
// - 索引会降低写入性能（INSERT、UPDATE、DELETE）
// - 需要根据实际查询模式创建合适的索引
// - 避免创建过多或冗余的索引
