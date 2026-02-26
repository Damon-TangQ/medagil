# 依赖倒置架构说明

## 概述

本文档详细说明Medagil API服务的依赖倒置架构设计，包括接口定义、实现方法和验证步骤。

## 架构原则

### 依赖倒置（Dependency Inversion）

**定义**:
高层模块不应依赖低层模块，两者都应依赖抽象（接口）。

**目的**:
1. 降低模块间的耦合度
2. 提高代码的可测试性
3. 便于替换实现
4. 提高代码的可维护性

**实现**:
- 在domain/interfaces层定义仓储接口
- use_cases层依赖接口而非具体实现
- adapters/repositories层实现接口
- 在初始化时注入具体实现

## 架构层次

```
┌─────────────────────────────────────┐
│         cmd/server (应用层)         │
│  - 初始化仓储和用例              │
│  - 配置依赖注入                  │
│  - 启动HTTP服务                  │
└──────────────┬──────────────────────┘
               │
               ├──────────────────┐
               │                  │
┌──────────────▼──────────┐  ┌───▼──────────────────────┐
│   use_cases (业务层)  │  │ adapters/repositories   │
│  - 依赖接口           │  │  - 实现接口           │
│  - 实现业务逻辑       │  │  - 处理数据访问       │
│  - 参数验证           │  │  - 数据库操作         │
└──────────────┬──────────┘  └────────────────────────┘
               │
               │
┌──────────────▼──────────────────────────┐
│  domain/interfaces (接口层)          │
│  - 定义仓储接口                     │
│  - 定义业务接口                     │
│  - 提供抽象契约                     │
└───────────────────────────────────────┘
```

## 接口定义

### 仓储接口

位置：`domain/interfaces/repositories.go`

```go
// ProjectRepository 定义项目仓储接口
// 遵循依赖倒置原则，use_cases层依赖接口而非具体实现
type ProjectRepository interface {
    Create(project *entities.Project) error
    Update(project *entities.Project) error
    Delete(id int64) error
    FindPaginated(page, pageSize int) ([]entities.Project, int, error)
}

// TaskRepository 定义任务仓储接口
type TaskRepository interface {
    Create(task *entities.Task) error
    Update(task *entities.Task) error
    Delete(id int64) error
    FindPaginated(page, pageSize int) ([]entities.Task, int, error)
}

// OrderRepository 定义订单仓储接口
type OrderRepository interface {
    Create(order *entities.Order) error
    Update(order *entities.Order) error
    Delete(id int64) error
    FindPaginated(page, pageSize int) ([]entities.Order, int, error)
}
```

### 用户仓储接口

位置：`domain/interfaces/user_repository.go`

```go
// UserRepository 定义用户相关数据库操作的接口
type UserRepository interface {
    Create(ctx context.Context, user *entities.User) error
    GetByID(ctx context.Context, id int64) (*entities.User, error)
    GetByEmail(ctx context.Context, email string) (*entities.User, error)
    GetByPhone(ctx context.Context, phone string) (*entities.User, error)
    Update(ctx context.Context, user *entities.User) error
    Delete(ctx context.Context, id int64) error
    List(ctx context.Context, offset, limit int) ([]*entities.User, error)
}
```

## 业务逻辑层

### ProjectUseCase

位置：`use_cases/project_use_case.go`

```go
// ProjectUseCase 定义项目业务逻辑接口
type ProjectUseCase interface {
    GetProjects(page, pageSize int) ([]entities.Project, int, error)
}

// projectUseCase 实现项目业务逻辑
type projectUseCase struct {
    repo interfaces.ProjectRepository  // 依赖接口而非具体实现
}

// NewProjectUseCase 创建项目业务逻辑实例
func NewProjectUseCase(repo interfaces.ProjectRepository) ProjectUseCase {
    return &projectUseCase{repo: repo}
}

// GetProjects 获取分页项目列表
func (uc *projectUseCase) GetProjects(page, pageSize int) ([]entities.Project, int, error) {
    // 业务参数校验
    if page < 1 {
        return nil, 0, fmt.Errorf("页码无效：页码必须≥1")
    }
    if pageSize < 1 || pageSize > 100 {
        return nil, 0, fmt.Errorf("每页条数无效：每页条数必须在1-100之间")
    }

    return uc.repo.FindPaginated(page, pageSize)
}
```

### TaskUseCase

位置：`use_cases/task_use_case.go`

```go
// TaskUseCase 定义任务业务逻辑接口
type TaskUseCase interface {
    GetTasks(page, pageSize int) ([]entities.Task, int, error)
}

// taskUseCase 实现任务业务逻辑
type taskUseCase struct {
    repo interfaces.TaskRepository  // 依赖接口而非具体实现
}

// NewTaskUseCase 创建任务业务逻辑实例
func NewTaskUseCase(repo interfaces.TaskRepository) TaskUseCase {
    return &taskUseCase{repo: repo}
}
```

### OrderUseCase

位置：`use_cases/order_use_case.go`

```go
// OrderUseCase 定义订单业务逻辑接口
type OrderUseCase interface {
    GetOrders(page, pageSize int) ([]entities.Order, int, error)
}

// orderUseCase 实现订单业务逻辑
type orderUseCase struct {
    repo interfaces.OrderRepository  // 依赖接口而非具体实现
}

// NewOrderUseCase 创建订单业务逻辑实例
func NewOrderUseCase(repo interfaces.OrderRepository) OrderUseCase {
    return &orderUseCase{repo: repo}
}
```

## 仓储实现

### 真实仓储实现

位置：`adapters/repositories/project_repository.go`

```go
// projectRepository 实现项目仓储
type projectRepository struct {
    db *gorm.DB
}

// NewProjectRepository 创建项目仓储实例
func NewProjectRepository(db *gorm.DB) interfaces.ProjectRepository {
    return &projectRepository{db: db}
}

// FindPaginated 分页查询项目
func (r *projectRepository) FindPaginated(page, pageSize int) ([]entities.Project, int, error) {
    var projects []entities.Project
    var total int64

    offset := (page - 1) * pageSize

    err := r.db.Model(&entities.Project{}).Count(&total).Error
    if err != nil {
        return nil, 0, err
    }

    err = r.db.Offset(offset).Limit(pageSize).Order("id DESC").Find(&projects).Error
    if err != nil {
        return nil, 0, err
    }

    return projects, int(total), nil
}
```

### 模拟仓储实现

位置：`domain/interfaces/mock_repository.go`

```go
// MockProjectRepository 项目仓储的模拟实现
type MockProjectRepository struct {
    projects map[int64]*entities.Project
    nextID   int64
}

// NewMockProjectRepository 创建项目仓储的模拟实例
func NewMockProjectRepository() *MockProjectRepository {
    repo := &MockProjectRepository{
        projects: make(map[int64]*entities.Project),
        nextID:   1,
    }

    // 添加预置数据
    repo.projects[1] = &entities.Project{
        ID:          1,
        Name:        "示例项目1",
        Description: "这是一个示例项目",
        UserID:      1,
    }
    repo.nextID = 2

    return repo
}

// FindPaginated 分页查询项目（模拟实现）
func (r *MockProjectRepository) FindPaginated(page, pageSize int) ([]entities.Project, int, error) {
    // 参数验证
    if page < 1 {
        return nil, 0, fmt.Errorf("page must be >= 1")
    }
    if pageSize < 1 || pageSize > 100 {
        return nil, 0, fmt.Errorf("pageSize must be between 1 and 100")
    }

    // 模拟分页逻辑
    offset := (page - 1) * pageSize
    projects := make([]entities.Project, 0, len(r.projects))
    for _, p := range r.projects {
        projects = append(projects, *p)
    }

    total := len(projects)
    start := offset
    if start > total {
        start = total
    }
    end := start + pageSize
    if end > total {
        end = total
    }

    var result []entities.Project
    if start < end {
        result = projects[start:end]
    }

    return result, total, nil
}
```

## 依赖注入

### 初始化代码

位置：`cmd/server/main.go`

```go
// 初始化仓储层
projectRepo := repositories.NewProjectRepository(db)
taskRepo := repositories.NewTaskRepository(db)
orderRepo := repositories.NewOrderRepository(db)

// 初始化业务逻辑层（依赖倒置：use_cases依赖接口而非具体实现）
projectUC := usecases.NewProjectUseCase(projectRepo)
taskUC := usecases.NewTaskUseCase(taskRepo)
orderUC := usecases.NewOrderUseCase(orderRepo)
```

### 替换实现

#### 使用真实仓储

```go
// 初始化真实仓储
projectRepo := repositories.NewProjectRepository(db)
taskRepo := repositories.NewTaskRepository(db)
orderRepo := repositories.NewOrderRepository(db)

// 初始化业务逻辑
projectUC := usecases.NewProjectUseCase(projectRepo)
taskUC := usecases.NewTaskUseCase(taskRepo)
orderUC := usecases.NewOrderUseCase(orderRepo)
```

#### 使用模拟仓储

```go
// 初始化模拟仓储
projectRepo := interfaces.NewMockProjectRepository()
taskRepo := interfaces.NewMockTaskRepository()
orderRepo := interfaces.NewMockOrderRepository()

// 初始化业务逻辑（代码无需修改）
projectUC := usecases.NewProjectUseCase(projectRepo)
taskUC := usecases.NewTaskUseCase(taskRepo)
orderUC := usecases.NewOrderUseCase(orderRepo)
```

## 验证步骤

### 1. 验证接口定义

```bash
# 检查接口文件是否存在
ls domain/interfaces/repositories.go
ls domain/interfaces/user_repository.go

# 检查接口方法是否定义
grep "type ProjectRepository interface" domain/interfaces/repositories.go
grep "type TaskRepository interface" domain/interfaces/repositories.go
grep "type OrderRepository interface" domain/interfaces/repositories.go
```

### 2. 验证依赖倒置

```bash
# 检查use_cases是否依赖接口
grep "repo interfaces.ProjectRepository" use_cases/project_use_case.go
grep "repo interfaces.TaskRepository" use_cases/task_use_case.go
grep "repo interfaces.OrderRepository" use_cases/order_use_case.go
```

### 3. 验证依赖注入

```bash
# 检查main.go中的初始化代码
grep "NewProjectUseCase(projectRepo)" cmd/server/main.go
grep "NewTaskUseCase(taskRepo)" cmd/server/main.go
grep "NewOrderUseCase(orderRepo)" cmd/server/main.go
```

### 4. 验证替换实现

#### 批处理脚本

```bash
# 测试模拟仓储
verify_dependency_inversion.bat mock

# 测试真实仓储
verify_dependency_inversion.bat real

# 完整测试
verify_dependency_inversion.bat test
```

#### PowerShell脚本

```powershell
# 测试模拟仓储
powershell -ExecutionPolicy Bypass -File Verify-DependencyInversion.ps1 -Action mock

# 测试真实仓储
powershell -ExecutionPolicy Bypass -File Verify-DependencyInversion.ps1 -Action real

# 完整测试
powershell -ExecutionPolicy Bypass -File Verify-DependencyInversion.ps1 -Action test
```

## 验证标准

✓ **use_cases层依赖接口而非具体实现**
- use_cases文件中导入的是interfaces包
- use_cases结构体中的字段类型是接口类型
- 不直接依赖adapters/repositories包

✓ **可以替换仓储实现（模拟/真实）**
- 可以使用NewMockProjectRepository()
- 可以使用NewProjectRepository(db)
- 两者都实现了相同的接口

✓ **替换仓储实现时use_cases层无需修改代码**
- 只需修改初始化代码
- 业务逻辑代码无需修改
- 接口契约保持不变

✓ **模拟仓储可用于单元测试**
- 模拟仓储使用内存存储
- 不依赖真实数据库
- 测试速度快且稳定

✓ **真实仓储可用于生产环境**
- 真实仓储使用PostgreSQL
- 使用GORM进行数据库操作
- 适合生产环境使用

## 优势

### 1. 降低耦合度

**问题**:
- 直接依赖具体实现导致高耦合
- 修改实现需要修改所有依赖代码

**解决**:
- 依赖抽象接口降低耦合
- 修改实现不影响依赖代码

### 2. 提高可测试性

**问题**:
- 直接依赖数据库导致测试困难
- 需要准备测试数据库

**解决**:
- 使用模拟仓储进行单元测试
- 测试不依赖外部资源

### 3. 便于替换实现

**问题**:
- 替换实现需要修改大量代码
- 容易引入错误

**解决**:
- 实现相同的接口即可替换
- 业务逻辑代码无需修改

### 4. 提高可维护性

**问题**:
- 代码分散难以维护
- 修改影响范围大

**解决**:
- 接口定义清晰
- 修改影响范围小

## 最佳实践

### 1. 接口设计

- 接口应该简洁明了
- 接口应该职责单一
- 接口应该稳定不变
- 接口应该有清晰的文档

### 2. 依赖注入

- 使用构造函数注入依赖
- 避免全局变量
- 使用接口类型声明
- 提供清晰的初始化方法

### 3. 实现替换

- 确保实现满足接口契约
- 保持接口行为一致
- 添加必要的错误处理
- 提供清晰的文档

### 4. 测试策略

- 单元测试使用模拟实现
- 集成测试使用真实实现
- 测试覆盖所有接口方法
- 测试边界条件和错误情况

## 相关文档

- [依赖倒置原则](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [SOLID原则](https://en.wikipedia.org/wiki/SOLID)
- [Go接口设计](https://go.dev/doc/effective_go#interfaces)

## 更新日志

- 2024-01-XX: 初始版本，实现依赖倒置架构
