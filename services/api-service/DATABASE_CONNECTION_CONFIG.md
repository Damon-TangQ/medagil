# 数据库连接配置说明

## 概述

本文档详细说明Medagil API服务的数据库连接配置，包括连接池参数、性能优化建议和验证方法。

## 连接池配置

### 配置参数

在 `cmd/server/main.go` 中，数据库连接池配置如下：

```go
// 获取底层sql.DB对象以配置连接池
sqlDB, err := db.DB()
if err != nil {
    log.Fatalf("Failed to get underlying sql.DB: %v", err)
}

// 配置数据库连接池参数
sqlDB.SetMaxOpenConns(20)           // 最大打开连接数
sqlDB.SetMaxIdleConns(10)           // 最大空闲连接数
sqlDB.SetConnMaxLifetime(time.Hour)   // 连接最大生命周期
sqlDB.SetConnMaxIdleTime(30 * time.Minute)  // 空闲连接最大空闲时间
```

### 参数详解

#### 1. SetMaxOpenConns(20)

**作用**: 设置数据库的最大打开连接数

**说明**:
- 限制同时打开的数据库连接总数
- 防止连接数过多导致数据库压力过大
- 当达到最大值时，新的请求将等待，直到有连接释放

**推荐值**:
- 根据应用并发量和数据库性能调整
- 通常设置为 20-100
- 对于小型应用：20-30
- 对于中型应用：50-80
- 对于大型应用：80-100

**注意事项**:
- 设置为0表示无限制，但不推荐
- 过高的值可能导致数据库资源耗尽
- 过低的值可能导致请求排队等待

#### 2. SetMaxIdleConns(10)

**作用**: 设置数据库的最大空闲连接数

**说明**:
- 保持一定数量的空闲连接，避免频繁创建和销毁连接
- 当连接使用完毕后，如果空闲连接数未达到此值，连接将被保留
- 超过此值的空闲连接将被关闭

**推荐值**:
- 通常设置为 MaxOpenConns 的 50% 左右
- 对于 MaxOpenConns=20，设置为 10 是合理的
- 可以根据实际使用情况调整

**注意事项**:
- 设置为0表示不保留任何空闲连接，每次使用后立即关闭
- 过高的值可能浪费数据库资源
- 过低的值可能导致频繁创建连接，影响性能

#### 3. SetConnMaxLifetime(time.Hour)

**作用**: 设置连接的最大生命周期

**说明**:
- 定期关闭长时间使用的连接，防止连接老化导致的性能问题
- 连接使用时间超过此值后，将被关闭并创建新连接
- 有助于释放可能被占用的资源

**推荐值**:
- 通常设置为 30分钟 到 2小时
- 对于生产环境：1小时是常见选择
- 可以根据数据库服务器的配置调整

**注意事项**:
- 设置为0表示连接永不过期，但可能导致连接泄漏
- 过短的值可能导致频繁重建连接，影响性能
- 应配合数据库服务器的 `max_connections` 和 `timeout` 参数

#### 4. SetConnMaxIdleTime(30 * time.Minute)

**作用**: 设置空闲连接的最大空闲时间

**说明**:
- 关闭长时间未使用的空闲连接，释放资源
- 即使空闲连接数未达到 MaxIdleConns，超时的空闲连接也会被关闭
- 有助于释放数据库服务器资源

**推荐值**:
- 通常设置为 5分钟 到 30分钟
- 对于生产环境：30分钟是合理选择
- 可以根据应用的使用模式调整

**注意事项**:
- 设置为0表示不关闭空闲连接
- 过短的值可能导致频繁重建连接
- 应与 SetConnMaxLifetime 配合使用

## GORM配置

### 当前配置

```go
db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
    SkipDefaultTransaction: true,
    PrepareStmt:            true,
})
```

### 配置说明

#### SkipDefaultTransaction: true

**作用**: 禁用默认事务

**优点**:
- 提高查询性能，减少事务开销
- 对于只读操作，不需要事务保护
- 减少数据库锁竞争

**适用场景**:
- 大部分只读查询
- 不需要事务保护的操作
- 对性能要求较高的场景

**注意事项**:
- 需要事务的操作必须显式使用 `db.Transaction()`
- 写操作应考虑是否需要事务保护

#### PrepareStmt: true

**作用**: 启用预编译语句缓存

**优点**:
- 提高查询性能，减少SQL解析开销
- 防止SQL注入
- 重复查询的性能提升明显

**适用场景**:
- 大量重复查询
- 参数化查询
- 对性能要求较高的场景

**注意事项**:
- 占用一定的内存缓存预编译语句
- 对于一次性查询，性能提升不明显

## 性能优化建议

### 1. 根据并发量调整连接池

```go
// 低并发场景（< 10 QPS）
sqlDB.SetMaxOpenConns(20)
sqlDB.SetMaxIdleConns(10)

// 中并发场景（10-100 QPS）
sqlDB.SetMaxOpenConns(50)
sqlDB.SetMaxIdleConns(25)

// 高并发场景（> 100 QPS）
sqlDB.SetMaxOpenConns(100)
sqlDB.SetMaxIdleConns(50)
```

### 2. 根据数据库服务器配置调整

确保应用配置与数据库服务器配置匹配：

```sql
-- 查看数据库最大连接数
SHOW max_connections;

-- 查看当前连接数
SELECT count(*) FROM pg_stat_activity;

-- 查看连接状态
SELECT state, count(*) FROM pg_stat_activity GROUP BY state;
```

### 3. 监控连接池状态

定期监控以下指标：
- 当前打开的连接数
- 空闲连接数
- 连接等待时间
- 连接创建/销毁频率

### 4. 优化查询性能

- 使用索引优化查询
- 避免全表扫描
- 合理使用预编译语句
- 批量操作代替循环单条操作

## 连接泄漏检测

### 检测方法

#### 1. 使用验证脚本

```bash
# Windows批处理
cd services/api-service
verify_db_connection.bat stress

# PowerShell
cd services/api-service
powershell -ExecutionPolicy Bypass -File Verify-DatabaseConnection.ps1 -Action stress
```

#### 2. 手动监控连接数

```bash
# Windows
netstat -an | findstr :5432 | find /c /v ""

# Linux/Mac
netstat -an | grep 5432 | wc -l
# 或
ss -ant | grep 5432 | wc -l
```

#### 3. 查询数据库

```sql
-- 查看当前连接数
SELECT count(*) FROM pg_stat_activity;

-- 查看连接详情
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    state_change,
    query
FROM pg_stat_activity
ORDER BY state_change;
```

### 判断标准

**正常情况**:
- 压力测试后，连接数应回落到接近初始值
- 服务停止后，所有连接应关闭
- 空闲连接数应在 MaxIdleConns 范围内

**连接泄漏迹象**:
- 连接数持续增长，不回落
- 服务停止后仍有大量连接
- 空闲连接数远超 MaxIdleConns

### 常见原因

1. **未关闭连接**
   - 问题：获取连接后忘记释放
   - 解决：使用 defer 确保连接释放

2. **事务未提交/回滚**
   - 问题：事务未正确结束
   - 解决：确保事务有明确的 Commit 或 Rollback

3. **连接对象未正确管理**
   - 问题：连接对象被长期持有
   - 解决：及时释放连接对象

4. **goroutine泄漏**
   - 问题：goroutine持有连接未退出
   - 解决：使用 context 控制 goroutine 生命周期

## 故障排查

### 问题1: 连接数不足

**症状**:
- 请求超时
- 日志显示 "too many connections"

**解决方案**:
1. 增加 SetMaxOpenConns 值
2. 检查数据库服务器的 max_connections
3. 优化慢查询，减少连接占用时间

### 问题2: 连接泄漏

**症状**:
- 连接数持续增长
- 服务停止后连接不关闭

**解决方案**:
1. 使用验证脚本检测泄漏点
2. 检查代码中的连接使用
3. 确保 defer sqlDB.Close() 被调用
4. 使用 pprof 分析 goroutine

### 问题3: 性能问题

**症状**:
- 查询响应慢
- CPU/内存占用高

**解决方案**:
1. 检查慢查询日志
2. 分析查询计划 (EXPLAIN)
3. 添加适当的索引
4. 优化连接池参数

## 最佳实践

1. **合理配置连接池**
   - 根据实际负载调整参数
   - 定期监控和优化

2. **正确使用连接**
   - 及时释放连接
   - 使用 defer 确保资源释放
   - 避免长时间持有连接

3. **监控和告警**
   - 监控连接池指标
   - 设置合理的告警阈值
   - 定期检查连接状态

4. **测试和验证**
   - 使用压力测试验证配置
   - 模拟各种场景
   - 确保无连接泄漏

## 相关文档

- [PostgreSQL连接管理](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [GORM数据库配置](https://gorm.io/docs/connecting_to_the_database.html)
- [Go数据库最佳实践](https://go.dev/doc/database/manage-connections)

## 更新日志

- 2024-01-XX: 初始版本，添加连接池配置和验证脚本
