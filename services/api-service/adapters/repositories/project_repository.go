package repositories

import (
	"github.com/medagil/api-service/domain/entities"
	"gorm.io/gorm"
)

// ProjectRepository 定义项目仓储接口
type ProjectRepository interface {
	Create(project *entities.Project) error
	Update(project *entities.Project) error
	Delete(id int64) error
	FindPaginated(page, pageSize int) ([]entities.Project, int, error)
}

// projectRepository 实现项目仓储
type projectRepository struct {
	db *gorm.DB
}

// NewProjectRepository 创建项目仓储实例
func NewProjectRepository(db *gorm.DB) ProjectRepository {
	return &projectRepository{db: db}
}

// Create 创建项目
func (r *projectRepository) Create(project *entities.Project) error {
	return r.db.Create(project).Error
}

// Update 更新项目
func (r *projectRepository) Update(project *entities.Project) error {
	return r.db.Save(project).Error
}

// Delete 删除项目
func (r *projectRepository) Delete(id int64) error {
	return r.db.Delete(&entities.Project{}, id).Error
}

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