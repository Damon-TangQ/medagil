package repositories

import (
	"github.com/medagil/api-service/domain/entities"
	"gorm.io/gorm"
)

// KnowledgeRepository 定义知识库仓储接口
type KnowledgeRepository interface {
	FindPaginated(page, pageSize int) ([]entities.KnowledgeBase, int, error)
	FindByID(id int64) (*entities.KnowledgeBase, error)
}

// knowledgeRepository 实现知识库仓储
type knowledgeRepository struct {
	db *gorm.DB
}

// NewKnowledgeRepository 创建知识库仓储实例
func NewKnowledgeRepository(db *gorm.DB) KnowledgeRepository {
	return &knowledgeRepository{db: db}
}

// FindPaginated 分页查询知识库
func (r *knowledgeRepository) FindPaginated(page, pageSize int) ([]entities.KnowledgeBase, int, error) {
	var bases []entities.KnowledgeBase
	var total int64

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 先查询总数
	err := r.db.Model(&entities.KnowledgeBase{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 分页查询数据，按ID降序排序
	err = r.db.Offset(offset).Limit(pageSize).Order("id DESC").Find(&bases).Error
	if err != nil {
		return nil, 0, err
	}

	return bases, int(total), nil
}

// FindByID 根据ID查找知识库
func (r *knowledgeRepository) FindByID(id int64) (*entities.KnowledgeBase, error) {
	var base entities.KnowledgeBase
	err := r.db.First(&base, id).Error
	if err != nil {
		return nil, err
	}
	return &base, nil
}
