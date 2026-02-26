package usecases

import (
	"fmt"
	"github.com/medagil/api-service/domain/interfaces"
	"github.com/medagil/api-service/domain/entities"
)

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