// Package repositories 提供数据访问层的实现
// 
// ========================================
// 架构说明
// ========================================
//
// 本包实现了domain/interfaces定义的仓储接口
// 遵循依赖倒置原则，提供数据访问的具体实现
//
// 层次结构：
// ┌─────────────────────────────────┐
// │  use_cases (业务层)         │
// │  - 依赖interfaces接口        │
// └──────────┬────────────────────┘
//            │
//            ├──────────────────┐
//            │                  │
// ┌───────────▼──────────┐  ┌───▼──────────────────┐
// │  domain/interfaces   │  │  adapters/repositories│
// │  - 定义仓储接口      │  │  - 实现仓储接口      │
// │  - 提供抽象契约      │  │  - 处理数据访问      │
// └──────────────────────┘  └────────────────────────┘
//
// ========================================
// 分页实现说明
// ========================================
//
// 分页逻辑位置：
// - domain层：domain/utils/paginate.go（分页辅助函数和常量）
// - 数据库层：各repository的FindPaginated方法
// - adapters层：仅实现仓储接口，不包含跨层调用
//
// 分页实现方式：
// 1. 数据库分页（推荐）：
//    - 使用GORM的Offset().Limit()实现
//    - 在数据库层面完成分页
//    - 优点：内存占用低，性能稳定
//    - 适用场景：大数据量（10万+条）
//
// 2. 内存分页（不推荐）：
//    - 先查询所有数据到内存
//    - 在内存中进行切片分页
//    - 缺点：内存占用高，大数据量时性能差
//    - 适用场景：小数据量，特殊需求
//
// 性能对比：
// 数据库分页 vs 内存分页：
// - 内存占用：低 vs 高
// - 响应时间：稳定 vs 随数据量增长
// - 并发性能：好 vs 差
// - 扩展性：强 vs 弱
//
// ========================================
// 索引建议
// ========================================
//
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
// 请参考 create_indexes_enhanced.sql 文件创建必要的索引
//
// 索引维护：
// - 定期分析索引：ANALYZE TABLE table_name;
// - 监控索引使用情况：SELECT * FROM pg_stat_user_indexes;
// - 删除未使用的索引：DROP INDEX index_name;
//
// ========================================
// 注意事项
// ========================================
//
// 1. 架构原则：
//    - adapters层仅实现仓储接口
//    - 不包含跨层调用的分页逻辑
//    - 分页逻辑位于domain层或数据库层
//
// 2. 性能优化：
//    - 索引会占用额外的存储空间
//    - 索引会降低写入性能（INSERT、UPDATE、DELETE）
//    - 需要根据实际查询模式创建合适的索引
//    - 避免创建过多或冗余的索引
//
// 3. 错误处理：
//    - 所有数据库操作都应返回error
//    - 使用适当的错误信息
//    - 记录详细的错误日志
package repositories
