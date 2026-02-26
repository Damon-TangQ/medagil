# 管理端鉴权配置说明

## 概述

本文档详细说明Medagil API服务的管理端鉴权机制，包括中间件实现、配置方法和验证步骤。

## 鉴权机制

### 中间件位置

`cmd/server/main.go` 中的 `adminAuthMiddleware` 函数

### 鉴权流程

```
客户端请求
    ↓
检查请求头 X-Admin-Token
    ↓
Token是否存在？
    ├─ 否 → 返回 401 "missing X-Admin-Token header"
    └─ 是 → 继续
        ↓
    从配置文件读取预期的token
        ↓
    Token是否匹配？
        ├─ 否 → 返回 401 "invalid admin token"
        └─ 是 → 继续
            ↓
        将adminID存入context
            ↓
        继续处理请求
```

## 配置方法

### 1. 配置文件设置

在 `config.yaml` 中添加管理员token：

```yaml
admin:
  token: your_secure_admin_token_here
```

### 2. 环境变量设置

也可以通过环境变量设置：

```bash
# Windows
set ADMIN_TOKEN=your_secure_admin_token_here

# Linux/Mac
export ADMIN_TOKEN=your_secure_admin_token_here
```

### 3. 默认Token

MVP阶段使用默认token：`admin_default_token`

**安全警告**：
- 默认token仅用于开发和测试
- 生产环境必须配置自定义token
- 不要将token提交到版本控制系统

## 使用方法

### 客户端请求示例

#### cURL

```bash
# 使用有效token访问管理端接口
curl -X GET http://localhost:8080/api/v1/admin/dashboard/stats   -H "X-Admin-Token: your_admin_token_here"

# 使用有效token获取用户列表
curl -X GET http://localhost:8080/api/v1/admin/users   -H "X-Admin-Token: your_admin_token_here"
```

#### JavaScript (Fetch)

```javascript
// 使用有效token访问管理端接口
fetch('http://localhost:8080/api/v1/admin/dashboard/stats', {
  method: 'GET',
  headers: {
    'X-Admin-Token': 'your_admin_token_here'
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Python (requests)

```python
import requests

# 设置请求头
headers = {
    'X-Admin-Token': 'your_admin_token_here'
}

# 访问管理端接口
response = requests.get(
    'http://localhost:8080/api/v1/admin/dashboard/stats',
    headers=headers
)

print(response.json())
```

### 受保护的接口

所有 `/api/v1/admin/*` 路由都需要管理员鉴权：

- `/api/v1/admin/ping` - 管理端心跳接口
- `/api/v1/admin/dashboard/stats` - 数据看板统计
- `/api/v1/admin/users` - 用户列表
- `/api/v1/admin/tasks` - 任务列表
- `/api/v1/admin/tasks/:taskId` - 任务详情
- `/api/v1/admin/orders` - 订单列表
- `/api/v1/admin/orders/:orderId` - 订单详情
- `/api/v1/admin/knowledge/sources` - 知识源列表

## 验证步骤

### 1. 启动服务

```bash
cd services/api-service
bin\server.exe
```

### 2. 运行验证脚本

#### 批处理脚本

```bash
# 完整测试（所有场景）
verify_admin_auth.bat test

# 测试有效token
verify_admin_auth.bat valid

# 测试无效token
verify_admin_auth.bat invalid

# 测试缺失token
verify_admin_auth.bat missing
```

#### PowerShell脚本

```powershell
# 完整测试（所有场景）
powershell -ExecutionPolicy Bypass -File Verify-AdminAuth.ps1 -Action test

# 测试有效token
powershell -ExecutionPolicy Bypass -File Verify-AdminAuth.ps1 -Action valid

# 测试无效token
powershell -ExecutionPolicy Bypass -File Verify-AdminAuth.ps1 -Action invalid

# 测试缺失token
powershell -ExecutionPolicy Bypass -File Verify-AdminAuth.ps1 -Action missing
```

### 3. 验证标准

✓ **有效token可以正常访问**
- 返回200状态码
- 返回正确的响应数据

✓ **无效token返回401**
- 返回401状态码
- 返回错误信息："invalid admin token"

✓ **缺失token返回401**
- 返回401状态码
- 返回错误信息："missing X-Admin-Token header"

✓ **所有受保护接口都需要鉴权**
- 无token无法访问任何 `/api/v1/admin/*` 接口
- 有效token可以访问所有受保护接口

## 安全建议

### 1. Token管理

- 使用强随机字符串作为token
- 定期更换token
- 不要在代码中硬编码token
- 使用环境变量或配置管理工具存储token

### 2. 日志记录

当前实现包含以下日志：

```go
// 成功鉴权日志
log.Printf("INFO: Admin authenticated: adminID=admin_demo, IP=%s", c.ClientIP())

// 失败鉴权日志
log.Printf("WARNING: Failed admin auth attempt from %s to %s", clientIP, requestPath)
```

建议：
- 记录所有鉴权尝试
- 包含时间戳、IP、请求路径
- 定期审计日志，发现异常访问

### 3. 错误处理

当前实现：
- 不暴露具体的错误信息
- 返回通用的错误消息
- 防止信息泄露

建议：
- 限制失败尝试次数
- 实现账户锁定机制
- 添加验证码保护

### 4. 传输安全

- 使用HTTPS传输token
- 避免在URL中传递token
- 使用安全的请求头

## 后续扩展

### 1. RBAC（基于角色的访问控制）

```go
// 扩展adminAuthMiddleware，添加角色验证
func adminAuthMiddlewareWithRBAC(requiredRole string) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 验证token
        // 验证角色
        // 检查权限
        c.Next()
    }
}
```

### 2. JWT Token

```go
// 使用JWT进行更安全的身份验证
import "github.com/golang-jwt/jwt/v5"

func validateJWTToken(tokenString string) (*jwt.Token, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return []byte(secretKey), nil
    })
    return token, err
}
```

### 3. Redis Session

```go
// 将会话信息存储在Redis中
import "github.com/go-redis/redis/v8"

func validateSession(sessionID string) (bool, error) {
    val, err := redis.Get(ctx, sessionID).Result()
    if err != nil {
        return false, err
    }
    return val == "valid", nil
}
```

### 4. 多因素认证

```go
// 添加二次验证机制
func validateMFA(adminID string, mfaCode string) (bool, error) {
    // 验证MFA代码
    // 返回验证结果
}
```

## 故障排查

### 问题1: 401错误

**症状**:
- 所有请求返回401
- 日志显示 "Failed admin auth attempt"

**解决方案**:
1. 检查token是否正确
2. 确认配置文件中的token
3. 检查请求头格式

### 问题2: 配置未生效

**症状**:
- 使用默认token仍能访问
- 配置文件中的token无效

**解决方案**:
1. 确认配置文件路径正确
2. 检查配置文件格式
3. 重启服务使配置生效

### 问题3: 日志未记录

**症状**:
- 鉴权操作未记录日志

**解决方案**:
1. 检查日志级别配置
2. 确认日志输出路径
3. 检查文件权限

## 最佳实践

1. **Token安全**
   - 使用强随机字符串
   - 定期更换token
   - 安全存储token

2. **日志审计**
   - 记录所有鉴权操作
   - 定期审计日志
   - 设置告警机制

3. **错误处理**
   - 不暴露敏感信息
   - 返回友好的错误消息
   - 实现限流机制

4. **测试验证**
   - 定期测试鉴权功能
   - 模拟各种场景
   - 确保安全性

## 相关文档

- [Gin中间件文档](https://gin-gonic.com/docs/examples/custom-group/)
- [HTTP认证机制](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
- [安全最佳实践](https://owasp.org/www-project-top-ten/)

## 更新日志

- 2024-01-XX: 初始版本，完善adminAuthMiddleware实现
