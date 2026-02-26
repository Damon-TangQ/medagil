// Package interfaces 提供仓储接口的模拟实现
// 用于单元测试和依赖倒置验证
package interfaces

import (
	"fmt"
	"github.com/medagil/api-service/domain/entities"
)

// ========================================
// MockProjectRepository 项目仓储的模拟实现
// ========================================
//
// 用途：
// 1. 用于单元测试，不依赖真实数据库
// 2. 验证依赖倒置的正确性
// 3. 模拟各种业务场景
//
// 使用场景：
// - 单元测试：测试业务逻辑而不依赖数据库
// - 集成测试：测试API层而不依赖真实数据
// - 开发调试：快速验证业务逻辑
//
// 使用方法：
// mockRepo := interfaces.NewMockProjectRepository()
// projectUC := usecases.NewProjectUseCase(mockRepo)
//
// 注意事项：
// - 仅用于测试和开发，不要在生产环境使用
// - 数据存储在内存中，重启后丢失
// - 并发访问时需要注意线程安全
// ========================================

type MockProjectRepository struct {
	projects map[int64]*entities.Project
	nextID   int64
}

// NewMockProjectRepository 创建项目仓储的模拟实例
//
// 返回：MockProjectRepository实例，包含预置的模拟数据
func NewMockProjectRepository() *MockProjectRepository {
	repo := &MockProjectRepository{
		projects: make(map[int64]*entities.Project),
		nextID:   1,
	}

	// 添加一些预置数据用于测试
	repo.projects[1] = &entities.Project{
		ID:          1,
		Name:        "示例项目1",
		Description: "这是一个示例项目",
		UserID:      1,
	}
	repo.projects[2] = &entities.Project{
		ID:          2,
		Name:        "示例项目2",
		Description: "这是另一个示例项目",
		UserID:      1,
	}
	repo.nextID = 3

	return repo
}

// Create 创建项目（模拟实现）
//
// 参数：
//   project: 要创建的项目实体
//
// 返回：
//   error: 创建失败时返回错误
func (r *MockProjectRepository) Create(project *entities.Project) error {
	project.ID = r.nextID
	r.nextID++
	r.projects[project.ID] = project
	return nil
}

// Update 更新项目（模拟实现）
//
// 参数：
//   project: 要更新的项目实体
//
// 返回：
//   error: 更新失败时返回错误
func (r *MockProjectRepository) Update(project *entities.Project) error {
	if _, exists := r.projects[project.ID]; !exists {
		return fmt.Errorf("project not found: %d", project.ID)
	}
	r.projects[project.ID] = project
	return nil
}

// Delete 删除项目（模拟实现）
//
// 参数：
//   id: 要删除的项目ID
//
// 返回：
//   error: 删除失败时返回错误
func (r *MockProjectRepository) Delete(id int64) error {
	if _, exists := r.projects[id]; !exists {
		return fmt.Errorf("project not found: %d", id)
	}
	delete(r.projects, id)
	return nil
}

// FindPaginated 分页查询项目（模拟实现）
//
// 参数：
//   page: 页码，从1开始
//   pageSize: 每页条数
//
// 返回：
//   []entities.Project: 项目列表
//   int: 总记录数
//   error: 查询失败时返回错误
//
// 说明：
// - 模拟数据库分页查询
// - 返回指定页的数据
// - 总记录数固定为100（用于测试）
func (r *MockProjectRepository) FindPaginated(page, pageSize int) ([]entities.Project, int, error) {
	// 参数验证
	if page < 1 {
		return nil, 0, fmt.Errorf("page must be >= 1")
	}
	if pageSize < 1 || pageSize > 100 {
		return nil, 0, fmt.Errorf("pageSize must be between 1 and 100")
	}

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 转换为切片
	projects := make([]entities.Project, 0, len(r.projects))
	for _, p := range r.projects {
		projects = append(projects, *p)
	}

	// 模拟分页
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

// ========================================
// MockTaskRepository 任务仓储的模拟实现
// ========================================
//
// 用途和使用方法同MockProjectRepository
// ========================================

type MockTaskRepository struct {
	tasks  map[int64]*entities.Task
	nextID int64
}

// NewMockTaskRepository 创建任务仓储的模拟实例
func NewMockTaskRepository() *MockTaskRepository {
	repo := &MockTaskRepository{
		tasks:  make(map[int64]*entities.Task),
		nextID: 1,
	}

	// 添加预置数据
	repo.tasks[1] = &entities.Task{
		ID:        1,
		TaskNo:    "TASK001",
		AgentType: "paper-outline",
		Status:    "running",
		UserID:    1,
	}
	repo.tasks[2] = &entities.Task{
		ID:        2,
		TaskNo:    "TASK002",
		AgentType: "paper-polish",
		Status:    "completed",
		UserID:    1,
	}
	repo.nextID = 3

	return repo
}

// Create 创建任务（模拟实现）
func (r *MockTaskRepository) Create(task *entities.Task) error {
	task.ID = r.nextID
	r.nextID++
	r.tasks[task.ID] = task
	return nil
}

// Update 更新任务（模拟实现）
func (r *MockTaskRepository) Update(task *entities.Task) error {
	if _, exists := r.tasks[task.ID]; !exists {
		return fmt.Errorf("task not found: %d", task.ID)
	}
	r.tasks[task.ID] = task
	return nil
}

// Delete 删除任务（模拟实现）
func (r *MockTaskRepository) Delete(id int64) error {
	if _, exists := r.tasks[id]; !exists {
		return fmt.Errorf("task not found: %d", id)
	}
	delete(r.tasks, id)
	return nil
}

// FindPaginated 分页查询任务（模拟实现）
func (r *MockTaskRepository) FindPaginated(page, pageSize int) ([]entities.Task, int, error) {
	// 参数验证
	if page < 1 {
		return nil, 0, fmt.Errorf("page must be >= 1")
	}
	if pageSize < 1 || pageSize > 100 {
		return nil, 0, fmt.Errorf("pageSize must be between 1 and 100")
	}

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 转换为切片
	tasks := make([]entities.Task, 0, len(r.tasks))
	for _, t := range r.tasks {
		tasks = append(tasks, *t)
	}

	// 模拟分页
	total := len(tasks)
	start := offset
	if start > total {
		start = total
	}
	end := start + pageSize
	if end > total {
		end = total
	}

	var result []entities.Task
	if start < end {
		result = tasks[start:end]
	}

	return result, total, nil
}

// ========================================
// MockOrderRepository 订单仓储的模拟实现
// ========================================
//
// 用途和使用方法同MockProjectRepository
// ========================================

type MockOrderRepository struct {
	orders map[int64]*entities.Order
	nextID int64
}

// NewMockOrderRepository 创建订单仓储的模拟实例
func NewMockOrderRepository() *MockOrderRepository {
	repo := &MockOrderRepository{
		orders: make(map[int64]*entities.Order),
		nextID: 1,
	}

	// 添加预置数据
	repo.orders[1] = &entities.Order{
		ID:         1,
		OrderNo:    "ORD001",
		Amount:      100.00,
		Status:      "paid",
		UserID:     1,
	}
	repo.orders[2] = &entities.Order{
		ID:         2,
		OrderNo:    "ORD002",
		Amount:      200.00,
		Status:      "pending",
		UserID:     1,
	}
	repo.nextID = 3

	return repo
}

// Create 创建订单（模拟实现）
func (r *MockOrderRepository) Create(order *entities.Order) error {
	order.ID = r.nextID
	r.nextID++
	r.orders[order.ID] = order
	return nil
}

// Update 更新订单（模拟实现）
func (r *MockOrderRepository) Update(order *entities.Order) error {
	if _, exists := r.orders[order.ID]; !exists {
		return fmt.Errorf("order not found: %d", order.ID)
	}
	r.orders[order.ID] = order
	return nil
}

// Delete 删除订单（模拟实现）
func (r *MockOrderRepository) Delete(id int64) error {
	if _, exists := r.orders[id]; !exists {
		return fmt.Errorf("order not found: %d", id)
	}
	delete(r.orders, id)
	return nil
}

// FindPaginated 分页查询订单（模拟实现）
func (r *MockOrderRepository) FindPaginated(page, pageSize int) ([]entities.Order, int, error) {
	// 参数验证
	if page < 1 {
		return nil, 0, fmt.Errorf("page must be >= 1")
	}
	if pageSize < 1 || pageSize > 100 {
		return nil, 0, fmt.Errorf("pageSize must be between 1 and 100")
	}

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 转换为切片
	orders := make([]entities.Order, 0, len(r.orders))
	for _, o := range r.orders {
		orders = append(orders, *o)
	}

	// 模拟分页
	total := len(orders)
	start := offset
	if start > total {
		start = total
	}
	end := start + pageSize
	if end > total {
		end = total
	}

	var result []entities.Order
	if start < end {
		result = orders[start:end]
	}

	return result, total, nil
}
