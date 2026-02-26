// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
// 所有实体都遵循统一的命名规范和字段定义，确保数据一致性和可维护性。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// ProjectCategory 表示数据库中 project_categories 表的项目分类实体。
// 
// 用途：用于对项目进行分类管理，支持多级分类结构，便于项目组织和检索。
// 
// 数据库表：project_categories
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识分类
//   - UserID: 用户ID，外键关联users表，表示分类的创建者
//   - Name: 分类名称，如"临床研究"、"课题项目"等
//   - ParentID: 父分类ID，支持多级分类结构，为空表示顶级分类
//   - CreatedAt: 分类创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 项目分类管理
//   - 项目组织
//   - 项目检索
//   - 多级分类展示
type ProjectCategory struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增，唯一标识分类
	UserID    int64     `json:"user_id" db:"user_id"`     // 用户ID，外键关联users表，表示分类的创建者
	Name      string    `json:"name" db:"name"`           // 分类名称，如"临床研究"、"课题项目"等
	ParentID  *int64    `json:"parent_id" db:"parent_id"` // 父分类ID，支持多级分类结构，为空表示顶级分类
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 分类创建时间，UTC时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}

// Project 表示数据库中 projects 表的项目实体。
// 
// 用途：记录用户创建的项目信息，包括名称、描述、全局提示等，是系统的核心业务实体。
// 
// 数据库表：projects
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识项目
//   - UserID: 用户ID，外键关联users表，表示项目的创建者
//   - CategoryID: 分类ID，外键关联project_categories表，可为空
//   - Name: 项目名称，用户自定义
//   - Description: 项目描述，详细说明项目的目标和内容
//   - Status: 项目状态，active表示活跃，archived表示已归档
//   - GlobalPrompt: 全局提示词，用于AI交互，影响AI生成的内容风格
//   - CreatedAt: 项目创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 项目管理
//   - 项目展示
//   - 项目检索
//   - AI交互
type Project struct {
	ID             int64                      `json:"id" gorm:"column:id;primaryKey" db:"id"`                        // 主键，自增，唯一标识项目
	UserID         int64                      `json:"user_id" gorm:"column:user_id" db:"user_id"`              // 用户ID，外键关联users表，表示项目的创建者
	CategoryID     *int64                     `json:"category_id" gorm:"column:category_id" db:"category_id"`     // 分类ID，外键关联project_categories表，可为空
	Name           string                     `json:"name" gorm:"column:name" db:"name"`                    // 项目名称，用户自定义
	Description    string                     `json:"description" gorm:"column:description" db:"description"`     // 项目描述，详细说明项目的目标和内容
	Status         valueobjects.ProjectStatus `json:"status" gorm:"column:status" db:"status"`                // 项目状态，active表示活跃，archived表示已归档
	GlobalPrompt   string                     `json:"global_prompt" gorm:"column:global_prompt" db:"global_prompt"`  // 全局提示词，用于AI交互，影响AI生成的内容风格
	CreatedAt      time.Time                  `json:"created_at" gorm:"column:created_at" db:"created_at"`        // 项目创建时间，UTC时间戳
	UpdatedAt      time.Time                  `json:"updated_at" gorm:"column:updated_at" db:"updated_at"`        // 最后更新时间，UTC时间戳
}

// Achievement 表示数据库中 achievements 表的成就实体。
// 
// 用途：记录用户在项目、任务、文件等方面的成就和收藏，支持用户成果管理和展示。
// 
// 数据库表：achievements
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识成就
//   - UserID: 用户ID，外键关联users表，表示成就的所有者
//   - ProjectID: 项目ID，外键关联projects表，可为空，表示成就所属的项目
//   - TaskID: 任务ID，外键关联tasks表，可为空，表示成就所属的任务
//   - FileID: 文件ID，外键关联files表，可为空，表示成就所属的文件
//   - Title: 成就标题，如"论文初稿"、"数据分析报告"等
//   - Type: 成就类型，如"论文"、"报告"、"图表"等
//   - Status: 成就状态，draft表示草稿，published表示已发布，archived表示已归档
//   - IsFavorited: 是否收藏，true表示已收藏
//   - CreatedAt: 成就创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 成果管理
//   - 成果展示
//   - 成果检索
//   - 收藏管理
type Achievement struct {
	ID          int64                           `json:"id" db:"id"`                          // 主键，自增，唯一标识成就
	UserID      int64                           `json:"user_id" db:"user_id"`                // 用户ID，外键关联users表，表示成就的所有者
	ProjectID   *int64                          `json:"project_id" db:"project_id"`          // 项目ID，外键关联projects表，可为空，表示成就所属的项目
	TaskID      *int64                          `json:"task_id" db:"task_id"`                // 任务ID，外键关联tasks表，可为空，表示成就所属的任务
	FileID      *int64                          `json:"file_id" db:"file_id"`                // 文件ID，外键关联files表，可为空，表示成就所属的文件
	Title       string                          `json:"title" db:"title"`                    // 成就标题，如"论文初稿"、"数据分析报告"等
	Type        string                          `json:"type" db:"type"`                      // 成就类型，如"论文"、"报告"、"图表"等
	Status      valueobjects.AchievementStatus  `json:"status" db:"status"`                  // 成就状态，draft表示草稿，published表示已发布，archived表示已归档
	IsFavorited bool                            `json:"is_favorited" db:"is_favorited"`     // 是否收藏，true表示已收藏
	CreatedAt   time.Time                       `json:"created_at" db:"created_at"`          // 成就创建时间，UTC时间戳
	UpdatedAt   time.Time                       `json:"updated_at" db:"updated_at"`          // 最后更新时间，UTC时间戳
}

// File 表示数据库中 files 表的项目文件实体。
// 
// 用途：记录上传的文件信息，包括文件名、大小、类型等，支持文件管理和云存储。
// 
// 数据库表：files
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识文件
//   - UserID: 用户ID，外键关联users表，表示文件的上传者
//   - Name: 文件名，包含扩展名
//   - Key: 文件存储键，用于云存储（如OSS、S3等）的文件标识
//   - Size: 文件大小，单位为字节
//   - Type: 文件类型，MIME类型，如"application/pdf"、"image/png"等
//   - BelongsTo: 所属对象类型，如"project"、"task"等，表示文件的归属
//   - CreatedAt: 文件创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 文件上传
//   - 文件管理
//   - 文件检索
//   - 云存储集成
type File struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增，唯一标识文件
	UserID    int64     `json:"user_id" db:"user_id"`     // 用户ID，外键关联users表，表示文件的上传者
	Name      string    `json:"name" db:"name"`           // 文件名，包含扩展名
	Key       string    `json:"key" db:"key"`             // 文件存储键，用于云存储（如OSS、S3等）的文件标识
	Size      int64     `json:"size" db:"size"`           // 文件大小，单位为字节
	Type      string    `json:"type" db:"type"`           // 文件类型，MIME类型，如"application/pdf"、"image/png"等
	BelongsTo string    `json:"belongs_to" db:"belongs_to"` // 所属对象类型，如"project"、"task"等，表示文件的归属
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 文件创建时间，UTC时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}