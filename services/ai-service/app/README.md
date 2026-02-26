# AI Service 应用层说明

## 概述

本目录包含Medagil AI服务的核心实现，采用分层架构设计，遵循领域驱动设计(DDD)原则。

## 分层架构

```
app/
├── adapters/          # 适配器层
│   ├── controllers/   # 控制器：处理HTTP请求和响应
│   ├── gateways/      # 网关：外部服务集成
│   └── repositories/  # 仓储：数据访问
├── domain/           # 领域层
│   ├── entities/      # 实体：核心业务对象
│   ├── interfaces/   # 接口：定义服务契约
│   └── value_objects/# 值对象：不可变的数据结构
├── use_cases/        # 用例层：业务逻辑实现
└── main.py          # 应用入口
```

## 核心组件

### 1. AIController

AI控制器类，负责处理AI相关的HTTP请求。

**位置**: `app/adapters/controllers/ai_controller.py`

**主要方法**:
- `process(request)`: 处理AI处理请求
- `get_models(request)`: 获取可用的AI模型列表
- `handle_request(request)`: 处理HTTP请求的主入口

**使用示例**:
```python
from app.adapters.controllers import AIController
from app.use_cases import AIService

# 创建服务实例
ai_service = AIService()

# 创建控制器实例
ai_controller = AIController(ai_service=ai_service)

# 处理请求
response = ai_controller.process(request)
```

### 2. AIService

AI服务实现类，负责处理AI相关的业务逻辑。

**位置**: `app/use_cases/ai_service.py`

**主要方法**:
- `process_ai_request(request)`: 处理AI请求
- `get_ai_models()`: 获取可用的AI模型列表
- `validate_ai_request(request)`: 验证AI请求参数

**支持的模型类型**:
- `paper-outline`: 论文大纲生成
- `paper-polish`: 论文润色
- `paper-review`: 论文评审
- `general`: 通用AI处理

### 3. 值对象

#### AIRequest
AI请求值对象，包含：
- `model`: 模型类型
- `prompt`: 输入提示
- `parameters`: 额外参数

#### AIResponse
AI响应值对象，包含：
- `content`: 处理结果
- `model_used`: 使用的模型
- `tokens_used`: 使用的token数
- `metadata`: 元数据

## 使用示例

完整示例请参考 `app/example_usage.py`。

### 基本使用流程

1. **创建AI服务实例**
```python
from app.use_cases import AIService

ai_service = AIService()
```

2. **创建AI控制器实例**
```python
from app.adapters.controllers import AIController

ai_controller = AIController(ai_service=ai_service)
```

3. **处理AI请求**
```python
from app.domain.value_objects import AIRequest

# 创建请求
request = AIRequest(
    model="paper-outline",
    prompt="人工智能在医疗诊断中的应用研究",
    parameters={}
)

# 处理请求
response = ai_service.process_ai_request(request)
print(response.content)
```

## 设计原则

1. **单一职责原则**: 每个类只负责一项功能
2. **依赖倒置原则**: 高层模块依赖接口而非具体实现
3. **开闭原则**: 对扩展开放，对修改关闭
4. **接口隔离原则**: 使用细粒度的接口
5. **里氏替换原则**: 子类可以替换父类

## 测试验证

运行示例代码验证功能：
```bash
cd services/ai-service
python app/example_usage.py
```

预期输出：
```
============================================================
AIController使用示例
============================================================

1. 创建AI服务实例...
   ✓ AI服务创建成功

2. 创建AI控制器实例...
   ✓ AI控制器创建成功

3. 获取可用的AI模型列表...
   可用模型: paper-outline, paper-polish, paper-review, general

4. 测试处理不同类型的AI请求...

   测试用例 1: 论文大纲生成
   输入: 人工智能在医疗诊断中的应用研究...
   输出预览: 论文大纲：人工智能在医疗诊断中的应用研究...
   ✓ 处理成功

   ...
```

## 注意事项

1. 所有业务逻辑都应在`use_cases`层实现
2. 控制器层只负责请求/响应处理，不包含业务逻辑
3. 使用值对象传递数据，确保数据不可变
4. 所有接口都应通过`__init__.py`导出
5. 遵循PEP 8代码规范
