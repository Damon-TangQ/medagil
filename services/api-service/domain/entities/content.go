// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
// 所有实体都遵循统一的命名规范和字段定义，确保数据一致性和可维护性。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// Skill 表示数据库中 skills 表的技能实体。
// 
// 用途：技能与Dify应用/工作流关联，可以是公开或私有的，用于AI能力扩展。
// 
// 数据库表：skills
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识技能
//   - UserID: 用户ID，外键关联users表，表示技能的创建者
//   - Name: 技能名称，如"论文大纲生成"、"论文润色"等
//   - Description: 技能详细描述，说明技能的功能和使用方法
//   - DifyAppID: 对应的Dify应用ID，用于关联Dify平台的应用
//   - Status: 技能当前状态，draft表示草稿，published表示已发布，archived表示已归档
//   - IsPublic: 技能是否公开可用，true表示公开，false表示私有
//   - CreatedAt: 技能创建时间，UTC时间戳
//   - UpdatedAt: 技能最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 技能创建
//   - 技能发布
//   - 技能共享
//   - AI能力扩展
type Skill struct {
	ID          int64                     `json:"id" db:"id"`          // 主键，自增，唯一标识技能
	UserID      int64                     `json:"user_id" db:"user_id"` // 用户ID，外键关联users表，表示技能的创建者
	Name        string                    `json:"name" db:"name"`       // 技能名称，如"论文大纲生成"、"论文润色"等
	Description string                    `json:"description" db:"description"` // 技能详细描述，说明技能的功能和使用方法
	DifyAppID   string                    `json:"dify_app_id" db:"dify_app_id"` // 对应的Dify应用ID，用于关联Dify平台的应用
	Status      valueobjects.SkillStatus  `json:"status" db:"status"`  // 技能当前状态，draft表示草稿，published表示已发布，archived表示已归档
	IsPublic    bool                      `json:"is_public" db:"is_public"` // 技能是否公开可用，true表示公开，false表示私有
	CreatedAt   time.Time                 `json:"created_at" db:"created_at"` // 技能创建时间，UTC时间戳
	UpdatedAt   time.Time                 `json:"updated_at" db:"updated_at"` // 技能最后更新时间，UTC时间戳
}

// Announcement 表示数据库中 announcements 表的公告实体。
// 
// 用途：公告是系统范围的通知或新闻项目，用于向用户传达重要信息。
// 
// 数据库表：announcements
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识公告
//   - Title: 公告标题，简短描述公告内容
//   - Content: 公告完整内容，支持Markdown格式
//   - Status: 公告状态，draft表示草稿，published表示已发布
//   - PublishAt: 计划发布时间，用于定时发布
//   - CreatedAt: 公告创建时间，UTC时间戳
//   - UpdatedAt: 公告最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 系统通知
//   - 功能更新
//   - 活动公告
//   - 重要提醒
type Announcement struct {
	ID          int64                            `json:"id" db:"id"`           // 主键，自增，唯一标识公告
	Title       string                           `json:"title" db:"title"`      // 公告标题，简短描述公告内容
	Content     string                           `json:"content" db:"content"`  // 公告完整内容，支持Markdown格式
	Status      valueobjects.AnnouncementStatus  `json:"status" db:"status"`   // 公告状态，draft表示草稿，published表示已发布
	PublishAt   time.Time                        `json:"publish_at" db:"publish_at"` // 计划发布时间，用于定时发布
	CreatedAt   time.Time                        `json:"created_at" db:"created_at"` // 公告创建时间，UTC时间戳
	UpdatedAt   time.Time                        `json:"updated_at" db:"updated_at"` // 公告最后更新时间，UTC时间戳
}

// Feedback 表示数据库中 feedbacks 表的用户反馈实体。
// 
// 用途：反馈由用户提交，可以分配给管理员处理，支持用户意见收集和问题跟踪。
// 
// 数据库表：feedbacks
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识反馈
//   - UserID: 用户ID，外键关联users表，表示反馈的提交者
//   - Source: 反馈来源，如"web"表示网页端，"miniapp"表示小程序
//   - Content: 反馈内容，用户提交的具体意见或问题描述
//   - Status: 反馈当前状态，open表示开放，in_progress表示处理中，resolved表示已解决，closed表示已关闭
//   - AssignedTo: 分配处理此反馈的管理员ID，可为空，外键关联admin_users表
//   - CreatedAt: 反馈创建时间，UTC时间戳
//   - UpdatedAt: 反馈最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 用户反馈收集
//   - 问题跟踪
//   - 意见处理
//   - 服务改进
type Feedback struct {
	ID          int64                        `json:"id" db:"id"`             // 主键，自增，唯一标识反馈
	UserID      int64                        `json:"user_id" db:"user_id"`   // 用户ID，外键关联users表，表示反馈的提交者
	Source      string                       `json:"source" db:"source"`     // 反馈来源，如"web"表示网页端，"miniapp"表示小程序
	Content     string                       `json:"content" db:"content"`   // 反馈内容，用户提交的具体意见或问题描述
	Status      valueobjects.FeedbackStatus  `json:"status" db:"status"`     // 反馈当前状态，open表示开放，in_progress表示处理中，resolved表示已解决，closed表示已关闭
	AssignedTo  *int64                       `json:"assigned_to" db:"assigned_to"` // 分配处理此反馈的管理员ID，可为空，外键关联admin_users表
	CreatedAt   time.Time                    `json:"created_at" db:"created_at"` // 反馈创建时间，UTC时间戳
	UpdatedAt   time.Time                    `json:"updated_at" db:"updated_at"` // 反馈最后更新时间，UTC时间戳
}

// SystemSetting 表示数据库中 system_settings 表的系统设置实体。
// 
// 用途：系统设置存储配置的键值对，以JSONB形式存储在数据库中，支持灵活的系统配置管理。
// 
// 数据库表：system_settings
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识系统设置
//   - Key: 设置键，如"api_key"、"storage_config"、"email_config"等
//   - Value: 设置值，通常为JSON字符串，存储复杂的配置信息
//   - CreatedAt: 设置创建时间，UTC时间戳
//   - UpdatedAt: 设置最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 系统配置管理
//   - 功能开关
//   - 第三方服务配置
//   - 动态参数调整
type SystemSetting struct {
	ID        int64     `json:"id" db:"id"`         // 主键，自增，唯一标识系统设置
	Key       string    `json:"key" db:"key"`       // 设置键，如"api_key"、"storage_config"、"email_config"等
	Value     string    `json:"value" db:"value"`   // 设置值，通常为JSON字符串，存储复杂的配置信息
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 设置创建时间，UTC时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 设置最后更新时间，UTC时间戳
}