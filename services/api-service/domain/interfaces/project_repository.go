// Package interfaces 定义了领域层的接口规范。
// 这些接口定义了数据访问层的契约，由具体实现类负责实现。
package interfaces

import (
	"context"

	"github.com/medagil/api-service/domain/entities"
)

// ProjectCategoryRepository 定义项目分类数据访问接口。
// 管理项目的分类信息，支持多级分类结构。
type ProjectCategoryRepository interface {
	Create(ctx context.Context, category *entities.ProjectCategory) error                    // 创建项目分类
	GetByID(ctx context.Context, id int64) (*entities.ProjectCategory, error)               // 根据ID获取项目分类
	GetByUserID(ctx context.Context, userID int64) ([]*entities.ProjectCategory, error)     // 根据用户ID获取项目分类列表
	Update(ctx context.Context, category *entities.ProjectCategory) error                    // 更新项目分类信息
	Delete(ctx context.Context, id int64) error                                               // 删除项目分类
}

// ProjectRepository 定义项目数据访问接口。
// 管理用户创建的项目信息，包括名称、描述、状态等。
type ProjectRepository interface {
	Create(ctx context.Context, project *entities.Project) error                                                                 // 创建项目
	GetByID(ctx context.Context, id int64) (*entities.Project, error)                                                             // 根据ID获取项目
	GetByUserID(ctx context.Context, userID int64, offset, limit int) ([]*entities.Project, error)                                // 根据用户ID分页获取项目列表
	Update(ctx context.Context, project *entities.Project) error                                                                  // 更新项目信息
	Delete(ctx context.Context, id int64) error                                                                                    // 删除项目
}

// AchievementRepository 定义成就数据访问接口。
// 管理用户在项目、任务、文件等方面的成就和收藏。
type AchievementRepository interface {
	Create(ctx context.Context, achievement *entities.Achievement) error                                                                 // 创建成就记录
	GetByID(ctx context.Context, id int64) (*entities.Achievement, error)                                                                // 根据ID获取成就
	GetByUserID(ctx context.Context, userID int64, offset, limit int) ([]*entities.Achievement, error)                                   // 根据用户ID分页获取成就列表
	Update(ctx context.Context, achievement *entities.Achievement) error                                                                 // 更新成就信息
	Delete(ctx context.Context, id int64) error                                                                                           // 删除成就记录
}

// FileRepository 定义文件数据访问接口。
// 管理上传的文件信息，包括文件名、大小、类型等。
type FileRepository interface {
	Create(ctx context.Context, file *entities.File) error                                                                 // 创建文件记录
	GetByID(ctx context.Context, id int64) (*entities.File, error)                                                         // 根据ID获取文件信息
	GetByUserID(ctx context.Context, userID int64, offset, limit int) ([]*entities.File, error)                            // 根据用户ID分页获取文件列表
	Update(ctx context.Context, file *entities.File) error                                                                  // 更新文件信息
	Delete(ctx context.Context, id int64) error                                                                             // 删除文件记录
}