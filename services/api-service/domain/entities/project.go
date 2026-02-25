// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// ProjectCategory 表示数据库中 project_categories 表的项目分类实体。
// 用于对项目进行分类管理，支持多级分类结构。
type ProjectCategory struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增
	UserID    int64     `json:"user_id" db:"user_id"`     // 用户ID，外键关联 users 表
	Name      string    `json:"name" db:"name"`           // 分类名称
	ParentID  *int64    `json:"parent_id" db:"parent_id"` // 父分类ID，支持多级分类（可空）
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}

// Project 表示数据库中 projects 表的项目实体。
// 记录用户创建的项目信息，包括名称、描述、全局提示等。
type Project struct {
	ID             int64                      `json:"id" db:"id"`                        // 主键，自增
	UserID         int64                      `json:"user_id" db:"user_id"`              // 用户ID，外键关联 users 表
	CategoryID     *int64                     `json:"category_id" db:"category_id"`     // 分类ID，外键关联 project_categories 表（可空）
	Name           string                     `json:"name" db:"name"`                    // 项目名称
	Description    string                     `json:"description" db:"description"`     // 项目描述
	Status         valueobjects.ProjectStatus `json:"status" db:"status"`                // 项目状态（活跃、归档等）
	GlobalPrompt   string                     `json:"global_prompt" db:"global_prompt"`  // 全局提示词，用于AI交互
	CreatedAt      time.Time                  `json:"created_at" db:"created_at"`        // 创建时间戳
	UpdatedAt      time.Time                  `json:"updated_at" db:"updated_at"`        // 最后更新时间戳
}

// Achievement 表示数据库中 achievements 表的成就实体。
// 记录用户在项目、任务、文件等方面的成就和收藏。
type Achievement struct {
	ID          int64                           `json:"id" db:"id"`                          // 主键，自增
	UserID      int64                           `json:"user_id" db:"user_id"`                // 用户ID，外键关联 users 表
	ProjectID   *int64                          `json:"project_id" db:"project_id"`          // 项目ID，外键关联 projects 表（可空）
	TaskID      *int64                          `json:"task_id" db:"task_id"`                // 任务ID，外键关联 tasks 表（可空）
	FileID      *int64                          `json:"file_id" db:"file_id"`                // 文件ID，外键关联 files 表（可空）
	Title       string                          `json:"title" db:"title"`                    // 成就标题
	Type        string                          `json:"type" db:"type"`                      // 成就类型
	Status      valueobjects.AchievementStatus  `json:"status" db:"status"`                  // 成就状态
	IsFavorited bool                            `json:"is_favorited" db:"is_favorited"`     // 是否收藏
	CreatedAt   time.Time                       `json:"created_at" db:"created_at"`          // 创建时间戳
	UpdatedAt   time.Time                       `json:"updated_at" db:"updated_at"`          // 最后更新时间戳
}

// File 表示数据库中 files 表的项目文件实体。
// 记录上传的文件信息，包括文件名、大小、类型等。
type File struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增
	UserID    int64     `json:"user_id" db:"user_id"`     // 用户ID，外键关联 users 表
	Name      string    `json:"name" db:"name"`           // 文件名
	Key       string    `json:"key" db:"key"`             // 文件存储键（用于云存储）
	Size      int64     `json:"size" db:"size"`           // 文件大小（字节）
	Type      string    `json:"type" db:"type"`           // 文件类型（MIME类型）
	BelongsTo string    `json:"belongs_to" db:"belongs_to"` // 所属对象类型（project、task等）
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}