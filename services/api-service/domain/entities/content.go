// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// Skill 表示数据库中 skills 表的技能实体。
// 技能与 Dify 应用/工作流关联，可以是公开或私有的。
type Skill struct {
	ID          int64                     `json:"id" db:"id"`          // 主键，自增
	UserID      int64                     `json:"user_id" db:"user_id"` // 创建技能的用户 ID
	Name        string                    `json:"name" db:"name"`       // 技能名称
	Description string                    `json:"description" db:"description"` // 技能详细描述
	DifyAppID   string                    `json:"dify_app_id" db:"dify_app_id"` // 对应的 Dify 应用 ID
	Status      valueobjects.SkillStatus  `json:"status" db:"status"`  // 技能当前状态（草稿、已发布、已归档）
	IsPublic    bool                      `json:"is_public" db:"is_public"` // 技能是否公开可用
	CreatedAt   time.Time                 `json:"created_at" db:"created_at"` // 技能创建时间戳
	UpdatedAt   time.Time                 `json:"updated_at" db:"updated_at"` // 技能最后更新时间戳
}

// Announcement 表示数据库中 announcements 表的公告实体。
// 公告是系统范围的通知或新闻项目。
type Announcement struct {
	ID          int64                            `json:"id" db:"id"`           // 主键，自增
	Title       string                           `json:"title" db:"title"`      // 公告标题
	Content     string                           `json:"content" db:"content"`  // 公告完整内容
	Status      valueobjects.AnnouncementStatus  `json:"status" db:"status"`   // 公告状态（草稿、已发布）
	PublishAt   time.Time                        `json:"publish_at" db:"publish_at"` // 计划发布时间
	CreatedAt   time.Time                        `json:"created_at" db:"created_at"` // 公告创建时间戳
	UpdatedAt   time.Time                        `json:"updated_at" db:"updated_at"` // 公告最后更新时间戳
}

// Feedback 表示数据库中 feedbacks 表的用户反馈实体。
// 反馈由用户提交，可以分配给管理员处理。
type Feedback struct {
	ID          int64                        `json:"id" db:"id"`             // 主键，自增
	UserID      int64                        `json:"user_id" db:"user_id"`   // 提交反馈的用户 ID
	Source      string                       `json:"source" db:"source"`     // 反馈来源（例如：web、小程序）
	Content     string                       `json:"content" db:"content"`   // 反馈内容
	Status      valueobjects.FeedbackStatus  `json:"status" db:"status"`     // 反馈当前状态（开放、进行中、已解决、已关闭）
	AssignedTo  *int64                       `json:"assigned_to" db:"assigned_to"` // 分配处理此反馈的管理员 ID，可为空
	CreatedAt   time.Time                    `json:"created_at" db:"created_at"` // 反馈创建时间戳
	UpdatedAt   time.Time                    `json:"updated_at" db:"updated_at"` // 反馈最后更新时间戳
}

// SystemSetting 表示数据库中 system_settings 表的系统设置实体。
// 系统设置存储配置的键值对，以 JSONB 形式存储在数据库中。
type SystemSetting struct {
	ID        int64     `json:"id" db:"id"`         // 主键，自增
	Key       string    `json:"key" db:"key"`       // 设置键（例如：api_key、storage_config）
	Value     string    `json:"value" db:"value"`   // 设置值，通常为 JSON 字符串
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 设置创建时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 设置最后更新时间戳
}