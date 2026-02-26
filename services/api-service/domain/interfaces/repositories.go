package interfaces

import "github.com/medagil/api-service/domain/entities"

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
	FindByID(id int64) (*entities.Task, error)
}

// OrderRepository 定义订单仓储接口
type OrderRepository interface {
	Create(order *entities.Order) error
	Update(order *entities.Order) error
	Delete(id int64) error
	FindPaginated(page, pageSize int) ([]entities.Order, int, error)
	FindByID(id int64) (*entities.Order, error)
	Count() (int64, error)
	CalculateMRR() (float64, error)
}

// KnowledgeRepository 定义知识库仓储接口
type KnowledgeRepository interface {
	FindPaginated(page, pageSize int) ([]entities.KnowledgeBase, int, error)
	FindByID(id int64) (*entities.KnowledgeBase, error)
}
