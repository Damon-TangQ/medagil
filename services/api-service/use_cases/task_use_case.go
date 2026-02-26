package usecases

import (
	"fmt"
	"github.com/medagil/api-service/domain/interfaces"
	"github.com/medagil/api-service/domain/entities"
)

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

// GetTasks 获取分页任务列表
func (uc *taskUseCase) GetTasks(page, pageSize int) ([]entities.Task, int, error) {
	// 业务参数校验
	if page < 1 {
		return nil, 0, fmt.Errorf("页码无效：页码必须≥1")
	}
	if pageSize < 1 || pageSize > 100 {
		return nil, 0, fmt.Errorf("每页条数无效：每页条数必须在1-100之间")
	}

	return uc.repo.FindPaginated(page, pageSize)
}