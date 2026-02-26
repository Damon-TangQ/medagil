# 分页性能优化说明

## 概述

本文档详细说明Medagil API服务的分页查询优化方案，包括实现细节、索引策略和性能验证方法。

## 问题分析

### 旧方案（内存分页）

**实现方式**:
```go
// 1. 查询所有数据到内存
var projects []entities.Project
db.Find(&projects)

// 2. 在内存中切片分页
data := toInterfaceSlice(projects)
result, total, page, pageSize := Paginate(data, page, pageSize)
```

**存在的问题**:
1. **内存占用高**
   - 需要将所有数据加载到内存
   - 大数据量时（10万+条）内存消耗巨大
   - 可能导致OOM（内存溢出）

2. **性能差**
   - 数据传输开销大
   - 内存切片操作耗时
   - 随着数据量增长，性能线性下降

3. **不可扩展**
   - 无法应对大数据量场景
   - 并发请求时资源竞争严重
   - 数据库连接数不稳定

### 新方案（数据库分页）

**实现方式**:
```go
// 1. 使用GORM原生分页
offset := (page - 1) * pageSize

// 2. 查询总数
db.Model(&entities.Project{}).Count(&total)

// 3. 分页查询数据
db.Offset(offset).Limit(pageSize).Order("id DESC").Find(&projects)
```

**优势**:
1. **内存占用低**
   - 只查询当前页的数据
   - 内存占用恒定（pageSize大小）
   - 不会出现OOM

2. **性能稳定**
   - 数据库层面分页，效率高
   - 响应时间稳定，不随数据量增长而恶化
   - 大数据量（10万+条）响应时间<1s

3. **可扩展**
   - 支持任意数据量
   - 并发请求性能好
   - 数据库连接数稳定

## 实现细节

### 1. Repository层实现

**位置**: `adapters/repositories/*.go`

**示例代码**:
```go
// FindPaginated 分页查询项目，使用GORM原生分页提高效率
func (r *projectRepository) FindPaginated(page, pageSize int) ([]entities.Project, int, error) {
    var projects []entities.Project
    var total int64

    // 计算偏移量
    offset := (page - 1) * pageSize

    // 先查询总数
    err := r.db.Model(&entities.Project{}).Count(&total).Error
    if err != nil {
        return nil, 0, err
    }

    // 分页查询数据，按ID降序排序（可根据实际需求调整排序字段）
    err = r.db.Offset(offset).Limit(pageSize).Order("id DESC").Find(&projects).Error
    if err != nil {
        return nil, 0, err
    }

    return projects, int(total), nil
}
```

**关键点**:
- 使用 `Offset()` 和 `Limit()` 实现数据库层面分页
- 先查询总数，再查询当前页数据
- 使用 `Order()` 确保结果顺序一致
- 返回数据和总数，便于前端展示分页信息

### 2. 索引策略

#### projects表索引

```sql
-- 主键索引
CREATE INDEX idx_projects_id ON projects(id DESC);

-- 用户ID索引
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- 创建时间索引
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- 状态索引
CREATE INDEX idx_projects_status ON projects(status);

-- 复合索引
CREATE INDEX idx_projects_user_created ON projects(user_id, created_at DESC);
```

#### tasks表索引

```sql
-- 主键索引
CREATE INDEX idx_tasks_id ON tasks(id DESC);

-- 用户ID索引
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- 状态索引
CREATE INDEX idx_tasks_status ON tasks(status);

-- 创建时间索引
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- 任务编号索引
CREATE INDEX idx_tasks_task_no ON tasks(task_no);

-- 智能体类型索引
CREATE INDEX idx_tasks_agent_type ON tasks(agent_type);

-- 复合索引
CREATE INDEX idx_tasks_user_status_created ON tasks(user_id, status, created_at DESC);
```

#### orders表索引

```sql
-- 主键索引
CREATE INDEX idx_orders_id ON orders(id DESC);

-- 用户ID索引
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 状态索引
CREATE INDEX idx_orders_status ON orders(status);

-- 创建时间索引
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- 订单编号索引
CREATE INDEX idx_orders_order_no ON orders(order_no);

-- 支付状态索引
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- 复合索引
CREATE INDEX idx_orders_user_status_created ON orders(user_id, status, created_at DESC);
```

### 3. 索引选择原则

**适合创建索引的字段**:
- 经常用于查询条件（WHERE）
- 经常用于排序（ORDER BY）
- 经常用于连接（JOIN）
- 选择性高的字段（DISTINCT值多）

**不适合创建索引的字段**:
- 选择性低的字段（如性别、状态）
- 频繁更新的字段
- 很少查询的字段
- 数据类型很大的字段（如TEXT、BLOB）

**复合索引字段顺序**:
- 将选择性高的字段放在前面
- 将常用查询条件的字段放在前面
- 将排序字段放在最后

## 性能验证

### 1. 验证脚本

#### 批处理脚本

```bash
# 测试分页性能
verify_pagination_performance.bat test

# 压力测试
verify_pagination_performance.bat stress

# 监控性能
verify_pagination_performance.bat monitor
```

#### PowerShell脚本

```powershell
# 测试分页性能
powershell -ExecutionPolicy Bypass -File Verify-PaginationPerformance.ps1 -Action test

# 压力测试
powershell -ExecutionPolicy Bypass -File Verify-PaginationPerformance.ps1 -Action stress

# 监控性能
powershell -ExecutionPolicy Bypass -File Verify-PaginationPerformance.ps1 -Action monitor
```

### 2. 验证标准

✓ **大数据量（10万+条）分页查询响应时间<1s**
- 测试不同页码（1、100、1000）的查询时间
- 所有页码的查询时间都应小于1秒
- 响应时间稳定，不随页码增长而恶化

✓ **无内存溢出**
- 监控服务进程内存占用
- 内存占用应保持稳定
- 不应随请求次数线性增长

✓ **数据库连接数稳定**
- 监控数据库连接数
- 连接数应在配置范围内（MaxOpenConns）
- 不应出现连接泄漏

### 3. 性能指标

#### 响应时间

| 数据量 | 页码 | 预期响应时间 | 最大响应时间 |
|--------|------|--------------|--------------|
| < 1万  | 任意  | < 100ms      | < 200ms      |
| 1-10万 | 任意  | < 500ms      | < 800ms      |
| > 10万  | 任意  | < 1000ms     | < 1500ms     |

#### 内存占用

| 数据量 | 预期内存占用 | 最大内存占用 |
|--------|--------------|--------------|
| < 1万  | < 50MB       | < 100MB      |
| 1-10万 | < 100MB      | < 200MB      |
| > 10万  | < 200MB      | < 500MB      |

#### 数据库连接

| 并发请求数 | 预期连接数 | 最大连接数 |
|------------|------------|----------|
| < 10       | 5-10       | 15       |
| 10-50      | 10-20      | 25       |
| > 50       | 15-25      | 30       |

## 索引维护

### 1. 定期分析

```sql
-- 分析表统计信息
ANALYZE TABLE projects;
ANALYZE TABLE tasks;
ANALYZE TABLE orders;

-- 查看统计信息
SELECT 
    tablename,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze
FROM pg_stat_user_tables
WHERE schemaname = 'public';
```

### 2. 重建索引

```sql
-- 重建碎片化的索引
REINDEX TABLE projects;
REINDEX TABLE tasks;
REINDEX TABLE orders;

-- 或重建特定索引
REINDEX INDEX idx_projects_id;
REINDEX INDEX idx_tasks_id;
REINDEX INDEX idx_orders_id;
```

### 3. 删除未使用的索引

```sql
-- 查找未使用的索引
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
ORDER BY tablename, indexname;

-- 删除未使用的索引
DROP INDEX IF EXISTS idx_unused_index;
```

## 性能监控

### 1. 慢查询监控

```sql
-- 启用pg_stat_statements扩展
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 查看慢查询
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time,
    rows
FROM pg_stat_statements
WHERE mean_time > 100  -- 平均执行时间超过100ms
ORDER BY mean_time DESC
LIMIT 20;
```

### 2. 索引使用监控

```sql
-- 查看索引使用情况
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan / idx_tup_read AS scan_ratio
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### 3. 表大小监控

```sql
-- 查看表大小
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 最佳实践

### 1. 分页参数

- **pageSize**: 建议设置为20-50
  - 太小：请求次数多，总时间长
  - 太大：单次查询慢，内存占用高

- **最大页码**: 限制最大页码
  - 防止恶意请求超大页码
  - 建议最大值为10000

### 2. 查询优化

- **只查询需要的字段**
  - 避免SELECT *
  - 减少数据传输量

- **使用索引字段**
  - WHERE条件使用索引字段
  - ORDER BY使用索引字段

- **避免全表扫描**
  - 确保查询使用索引
  - 定期分析表统计信息

### 3. 缓存策略

- **缓存热门数据**
  - 第一页数据
  - 最近访问的数据

- **缓存总数**
  - 避免每次都查询总数
  - 使用Redis等缓存

- **缓存过期策略**
  - 设置合理的过期时间
  - 数据更新时清除缓存

### 4. 连接池配置

```go
sqlDB.SetMaxOpenConns(20)           // 最大打开连接数
sqlDB.SetMaxIdleConns(10)           // 最大空闲连接数
sqlDB.SetConnMaxLifetime(time.Hour)   // 连接最大生命周期
sqlDB.SetConnMaxIdleTime(30 * time.Minute)  // 空闲连接最大空闲时间
```

## 故障排查

### 问题1: 查询慢

**症状**:
- 分页查询响应时间>1s
- 数据库CPU占用高

**解决方案**:
1. 检查是否使用索引
2. 分析慢查询日志
3. 优化查询条件
4. 调整索引策略

### 问题2: 内存占用高

**症状**:
- 服务进程内存持续增长
- 出现OOM错误

**解决方案**:
1. 确认使用数据库分页
2. 检查是否有内存泄漏
3. 调整pageSize大小
4. 增加内存监控

### 问题3: 连接泄漏

**症状**:
- 数据库连接数持续增长
- 服务停止后连接不关闭

**解决方案**:
1. 检查连接池配置
2. 确保连接正确释放
3. 使用验证脚本检测
4. 调整连接生命周期

## 相关文档

- [PostgreSQL索引优化](https://www.postgresql.org/docs/current/indexes.html)
- [GORM分页查询](https://gorm.io/docs/scopes.html#pagination)
- [数据库性能优化](https://wiki.postgresql.org/wiki/Performance_Optimization)

## 更新日志

- 2024-01-XX: 初始版本，实现数据库分页和索引优化
