# AI路由配置说明

## 概述

本文档详细说明Medagil AI服务的AI处理路由，包括接口定义、请求/响应格式和使用方法。

## 路由信息

### 基本信息

- **路由路径**: `/api/v1/ai/process`
- **请求方法**: `POST`
- **Content-Type**: `application/json`
- **认证方式**: 当前无认证（MVP阶段）

### 功能说明

AI处理接口接收用户的AI处理请求，调用AI核心处理方法，返回处理结果。支持多种AI处理类型，包括论文大纲生成、论文润色、论文评审等。

## 请求格式

### 请求头

```
Content-Type: application/json
```

### 请求体

```json
{
  "input_text": "人工智能在医疗诊断中的应用研究",
  "agent_type": "paper-outline",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 1000
  }
}
```

### 字段说明

| 字段 | 类型 | 必需 | 说明 | 示例 |
|------|------|------|------|------|
| input_text | string | 是 | 输入文本，需要进行AI处理的内容 | "人工智能在医疗诊断中的应用研究" |
| agent_type | string | 否 | 智能体类型，决定使用哪种AI处理逻辑 | "paper-outline" |
| parameters | dict | 否 | 额外参数，用于控制AI处理行为 | {"temperature": 0.7} |

### agent_type说明

支持的agent_type类型：

| agent_type | 说明 | 输出示例 |
|------------|------|----------|
| paper-outline | 论文大纲生成 | 生成完整的论文大纲结构 |
| paper-polish | 论文润色 | 优化语言表达，提升学术性 |
| paper-review | 论文评审 | 提供论文评审意见和改进建议 |
| general | 通用AI处理 | 通用的文本处理和分析 |

### parameters说明

常用参数：

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| temperature | float | 控制输出的随机性，范围0-1 | 0.7 |
| max_tokens | int | 限制输出的最大token数 | 1000 |
| top_p | float | 核采样参数，范围0-1 | 1.0 |
| frequency_penalty | float | 降低重复词汇的频率 | 0.0 |
| presence_penalty | float | 鼓励使用新词 | 0.0 |

## 响应格式

### 响应体

```json
{
  "result": "论文大纲：人工智能在医疗诊断中的应用研究

一、引言...",
  "status": "success",
  "processing_time": 0.5,
  "metadata": {
    "agent_type": "paper-outline",
    "input_length": 50,
    "parameters": {}
  }
}
```

### 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| result | string | AI处理结果 | "论文大纲：人工智能在医疗诊断中的应用研究..." |
| status | string | 处理状态，成功时为success | "success" |
| processing_time | float | 处理耗时，单位秒 | 0.5 |
| metadata | dict | 元数据，包含处理过程信息 | {"agent_type": "paper-outline"} |

### 状态码

| 状态码 | 说明 | 处理建议 |
|--------|------|----------|
| 200 | 请求成功 | 正常处理响应 |
| 400 | 请求参数错误 | 检查请求体格式和字段 |
| 500 | 服务器内部错误 | 联系技术支持 |

## 使用方法

### cURL

```bash
# 基本请求
curl -X POST http://localhost:8000/api/v1/ai/process   -H "Content-Type: application/json"   -d '{
    "input_text": "人工智能在医疗诊断中的应用研究",
    "agent_type": "paper-outline"
  }'

# 带参数的请求
curl -X POST http://localhost:8000/api/v1/ai/process   -H "Content-Type: application/json"   -d '{
    "input_text": "测试文本",
    "agent_type": "general",
    "parameters": {
      "temperature": 0.7,
      "max_tokens": 1000
    }
  }'
```

### JavaScript (Fetch)

```javascript
// 基本请求
fetch('http://localhost:8000/api/v1/ai/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input_text: '人工智能在医疗诊断中的应用研究',
    agent_type: 'paper-outline'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));

// 带参数的请求
fetch('http://localhost:8000/api/v1/ai/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input_text: '测试文本',
    agent_type: 'general',
    parameters: {
      temperature: 0.7,
      max_tokens: 1000
    }
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

### Python (requests)

```python
import requests

# 基本请求
url = 'http://localhost:8000/api/v1/ai/process'
headers = {'Content-Type': 'application/json'}
data = {
    'input_text': '人工智能在医疗诊断中的应用研究',
    'agent_type': 'paper-outline'
}

response = requests.post(url, json=data, headers=headers)
print(response.json())

# 带参数的请求
data = {
    'input_text': '测试文本',
    'agent_type': 'general',
    'parameters': {
        'temperature': 0.7,
        'max_tokens': 1000
    }
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

### Axios

```javascript
import axios from 'axios';

// 基本请求
axios.post('http://localhost:8000/api/v1/ai/process', {
  input_text: '人工智能在医疗诊断中的应用研究',
  agent_type: 'paper-outline'
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

// 带参数的请求
axios.post('http://localhost:8000/api/v1/ai/process', {
  input_text: '测试文本',
  agent_type: 'general',
  parameters: {
    temperature: 0.7,
    max_tokens: 1000
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
```

## 验证步骤

### 1. 启动服务

```bash
cd services/ai-service
python app/main.py
```

### 2. 运行验证脚本

#### 批处理脚本

```bash
# 完整测试（所有场景）
verify_ai_route.bat test

# 测试有效请求
verify_ai_route.bat valid

# 测试无效agent_type
verify_ai_route.bat invalid

# 测试缺失input_text
verify_ai_route.bat missing

# 测试所有支持的agent_type
verify_ai_route.bat types
```

#### PowerShell脚本

```powershell
# 完整测试（所有场景）
powershell -ExecutionPolicy Bypass -File Verify-AIRoute.ps1 -Action test

# 测试有效请求
powershell -ExecutionPolicy Bypass -File Verify-AIRoute.ps1 -Action valid

# 测试无效agent_type
powershell -ExecutionPolicy Bypass -File Verify-AIRoute.ps1 -Action invalid

# 测试缺失input_text
powershell -ExecutionPolicy Bypass -File Verify-AIRoute.ps1 -Action missing

# 测试所有支持的agent_type
powershell -ExecutionPolicy Bypass -File Verify-AIRoute.ps1 -Action types
```

### 3. 验证标准

✓ **POST请求/api/v1/ai/process可正常返回响应**
- 返回200状态码
- 返回完整的JSON响应

✓ **有效请求返回200状态码**
- 请求格式正确
- 所有字段验证通过

✓ **无效agent_type返回400状态码**
- 返回400状态码
- 包含详细的错误信息

✓ **缺失input_text返回400状态码**
- 返回400状态码
- 包含详细的错误信息

✓ **所有支持的agent_type都能正常处理**
- paper-outline处理成功
- paper-polish处理成功
- paper-review处理成功
- general处理成功

## 错误处理

### 参数验证错误

**错误示例**:
```json
{
  "detail": "input_text cannot be empty"
}
```

**处理建议**:
- 检查input_text是否为空
- 检查agent_type是否在支持列表中
- 检查请求体是否为有效的JSON

### 服务器错误

**错误示例**:
```json
{
  "detail": "Internal server error: AI processing failed"
}
```

**处理建议**:
- 检查服务日志
- 确认AI服务是否正常
- 联系技术支持

## 性能优化

### 请求优化

1. **批量处理**
   - 对于多个AI请求，考虑批量处理
   - 减少网络往返时间

2. **异步处理**
   - 使用异步方式发送请求
   - 提高并发性能

3. **缓存策略**
   - 缓存相似请求的结果
   - 减少重复计算

### 响应优化

1. **流式响应**
   - 对于长文本，考虑流式返回
   - 提高用户体验

2. **结果压缩**
   - 对大结果进行压缩
   - 减少网络传输时间

3. **分页返回**
   - 对于长结果，考虑分页返回
   - 避免超时

## 安全建议

### 1. 输入验证

- 验证input_text长度（最大10000字符）
- 验证agent_type是否在支持列表中
- 验证parameters中的参数值

### 2. 速率限制

- 实现请求速率限制
- 防止滥用和DDoS攻击
- 建议限制：每分钟10-20次

### 3. 内容过滤

- 过滤敏感内容
- 检测恶意输入
- 实现内容审核

### 4. 日志记录

- 记录所有请求
- 包含时间戳、IP、用户信息
- 定期审计日志

## 后续扩展

### 1. 认证鉴权

```python
# 添加认证中间件
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

async def verify_token(token: str = Depends(HTTPBearer())):
    # 验证token
    if not validate_token(token):
        raise HTTPException(status_code=401, detail="Invalid token")
    return token

@app.post("/api/v1/ai/process", dependencies=[Depends(verify_token)])
async def process_ai(request: AIProcessRequest, token: str = Depends(verify_token)):
    # 处理请求
    pass
```

### 2. 请求限流

```python
# 添加限流中间件
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/v1/ai/process")
@limiter.limit("10/minute")
async def process_ai(request: AIProcessRequest):
    # 处理请求
    pass
```

### 3. 异步处理

```python
# 使用Celery进行异步处理
from celery import Celery

celery_app = Celery('ai_service')

@celery_app.task
def process_ai_task(input_text: str, agent_type: str):
    # 异步处理AI请求
    return ai_service.process(input_text, agent_type)

@app.post("/api/v1/ai/process")
async def process_ai(request: AIProcessRequest):
    # 提交异步任务
    task = process_ai_task.delay(
        request.input_text,
        request.agent_type
    )
    return {"task_id": task.id}
```

### 4. 结果缓存

```python
# 使用Redis缓存结果
import redis

redis_client = redis.Redis()

@app.post("/api/v1/ai/process")
async def process_ai(request: AIProcessRequest):
    # 生成缓存键
    cache_key = f"ai:{request.agent_type}:{hash(request.input_text)}"

    # 检查缓存
    cached_result = redis_client.get(cache_key)
    if cached_result:
        return json.loads(cached_result)

    # 处理请求
    result = ai_service.process(request.input_text, request.agent_type)

    # 缓存结果
    redis_client.setex(cache_key, 3600, json.dumps(result))  # 缓存1小时

    return result
```

## 故障排查

### 问题1: 404错误

**症状**:
- 请求返回404 Not Found

**解决方案**:
1. 检查路由路径是否正确
2. 确认服务是否正常运行
3. 检查FastAPI配置

### 问题2: 400错误

**症状**:
- 请求返回400 Bad Request

**解决方案**:
1. 检查请求体格式
2. 验证必需字段
3. 检查字段值是否有效

### 问题3: 500错误

**症状**:
- 请求返回500 Internal Server Error

**解决方案**:
1. 检查服务日志
2. 确认AI服务是否正常
3. 检查资源使用情况

## 相关文档

- [FastAPI官方文档](https://fastapi.tiangolo.com/)
- [Pydantic验证文档](https://docs.pydantic.dev/)
- [OpenAPI规范](https://swagger.io/specification/)

## 更新日志

- 2024-01-XX: 初始版本，实现AI处理路由
