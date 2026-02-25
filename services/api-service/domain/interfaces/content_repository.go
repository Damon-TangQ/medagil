// Package interfaces 定义了领域层的接口规范。
// 这些接口定义了数据访问层的契约，由具体实现类负责实现。
package interfaces

import (
	"context"

	"github.com/medagil/api-service/domain/entities"
)

// SkillRepository 定义技能数据访问接口。
// 管理用户技能信息，包括个人技能和公开技能展示。
type SkillRepository interface {
	Create(ctx context.Context, skill *entities.Skill) error                                                                 // 创建技能记录
	GetByID(ctx context.Context, id int64) (*entities.Skill, error)                                                          // 根据ID获取技能
	GetByUserID(ctx context.Context, userID int64, offset, limit int) ([]*entities.Skill, error)                             // 根据用户ID分页获取技能列表
	Update(ctx context.Context, skill *entities.Skill) error                                                                  // 更新技能信息
	Delete(ctx context.Context, id int64) error                                                                                // 删除技能记录
	ListPublic(ctx context.Context, offset, limit int) ([]*entities.Skill, error)                                             // 分页获取公开技能列表
}

// AnnouncementRepository 定义公告数据访问接口。
// 管理系统公告信息，包括发布、更新、删除等操作。
type AnnouncementRepository interface {
	Create(ctx context.Context, announcement *entities.Announcement) error                                                      // 创建公告
	GetByID(ctx context.Context, id int64) (*entities.Announcement, error)                                                      // 根据ID获取公告
	Update(ctx context.Context, announcement *entities.Announcement) error                                                      // 更新公告信息
	Delete(ctx context.Context, id int64) error                                                                                  // 删除公告
	ListPublished(ctx context.Context, offset, limit int) ([]*entities.Announcement, error)                                     // 分页获取已发布公告列表
}

// FeedbackRepository 定义反馈数据访问接口。
// 管理用户反馈信息，包括创建、处理、查询等操作。
type FeedbackRepository interface {
	Create(ctx context.Context, feedback *entities.Feedback) error                                                              // 创建反馈记录
	GetByID(ctx context.Context, id int64) (*entities.Feedback, error)                                                          // 根据ID获取反馈
	Update(ctx context.Context, feedback *entities.Feedback) error                                                              // 更新反馈信息
	Delete(ctx context.Context, id int64) error                                                                                  // 删除反馈记录
	List(ctx context.Context, status string, offset, limit int) ([]*entities.Feedback, error)                                   // 根据状态分页获取反馈列表
}

// SystemSettingRepository 定义系统设置数据访问接口。
// 管理系统的配置参数和设置项。
type SystemSettingRepository interface {
	Create(ctx context.Context, setting *entities.SystemSetting) error                    // 创建系统设置
	GetByKey(ctx context.Context, key string) (*entities.SystemSetting, error)           // 根据键获取系统设置
	Update(ctx context.Context, setting *entities.SystemSetting) error                    // 更新系统设置
	Delete(ctx context.Context, key string) error                                         // 删除系统设置
	List(ctx context.Context, offset, limit int) ([]*entities.SystemSetting, error)       // 分页获取系统设置列表
}