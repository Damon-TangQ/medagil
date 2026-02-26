// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
// 所有实体都遵循统一的命名规范和字段定义，确保数据一致性和可维护性。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// Task 表示数据库中 tasks 表的任务实体。
// 
// 用途：记录用户创建的任务信息，包括任务编号、智能体类型、状态等，是AI任务执行的核心实体。
// 
// 数据库表：tasks
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识任务
//   - UserID: 用户ID，外键关联users表，表示任务的创建者
//   - TaskNo: 任务编号，全局唯一，用于外部引用和查询
//   - AgentType: 智能体类型，如"paper-outline"、"paper-polish"等，表示任务的AI处理类型
//   - Status: 任务状态，pending表示待处理，running表示进行中，completed表示已完成，failed表示失败
//   - DifyTaskID: Dify平台任务ID，可为空，用于关联Dify平台的任务
//   - CreatedAt: 任务创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 任务创建
//   - 任务执行
//   - 任务跟踪
//   - 任务结果查询
type Task struct {
	ID             int64                   `json:"id" gorm:"column:id;primaryKey" db:"id"`                        // 主键，自增，唯一标识任务
	UserID         int64                   `json:"user_id" gorm:"column:user_id" db:"user_id"`              // 用户ID，外键关联users表，表示任务的创建者
	TaskNo         string                  `json:"task_no" gorm:"column:task_no" db:"task_no"`              // 任务编号，全局唯一，用于外部引用和查询
	AgentType      string                  `json:"agent_type" gorm:"column:agent_type" db:"agent_type"`       // 智能体类型，如"paper-outline"、"paper-polish"等，表示任务的AI处理类型
	Status         valueobjects.TaskStatus `json:"status" gorm:"column:status" db:"status"`                // 任务状态，pending表示待处理，running表示进行中，completed表示已完成，failed表示失败
	DifyTaskID     *string                 `json:"dify_task_id" gorm:"column:dify_task_id" db:"dify_task_id"`    // Dify平台任务ID，可为空，用于关联Dify平台的任务
	CreatedAt      time.Time               `json:"created_at" gorm:"column:created_at" db:"created_at"`       // 任务创建时间，UTC时间戳
	UpdatedAt      time.Time               `json:"updated_at" gorm:"column:updated_at" db:"updated_at"`       // 最后更新时间，UTC时间戳
}

// TaskFile 表示数据库中 task_files 表的任务文件关联实体。
// 
// 用途：记录任务与上传文件之间的关联关系，支持任务输入输出文件管理。
// 
// 数据库表：task_files
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识任务文件关系
//   - TaskID: 任务ID，外键关联tasks表
//   - FileID: 文件ID，外键关联files表
//   - Type: 文件类型，如"input"表示输入文件，"output"表示输出文件
//   - CreatedAt: 关系创建时间，UTC时间戳
// 
// 使用场景：
//   - 任务输入文件管理
//   - 任务输出文件管理
//   - 文件关联查询
//   - 文件版本管理
type TaskFile struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增，唯一标识任务文件关系
	TaskID    int64     `json:"task_id" db:"task_id"`     // 任务ID，外键关联tasks表
	FileID    int64     `json:"file_id" db:"file_id"`     // 文件ID，外键关联files表
	Type      string    `json:"type" db:"type"`           // 文件类型，如"input"表示输入文件，"output"表示输出文件
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 关系创建时间，UTC时间戳
}

// TaskFeedback 表示数据库中 task_feedbacks 表的任务反馈实体。
// 
// 用途：记录用户对任务执行结果的评价和反馈，支持任务质量评估和改进。
// 
// 数据库表：task_feedbacks
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识反馈
//   - TaskID: 任务ID，外键关联tasks表
//   - UserID: 用户ID，外键关联users表，表示反馈的提交者
//   - Rating: 评分，1-5星，5星表示最高评价
//   - Comment: 评论内容，用户对任务执行结果的具体评价
//   - CreatedAt: 反馈创建时间，UTC时间戳
// 
// 使用场景：
//   - 任务质量评估
//   - 用户反馈收集
//   - 任务改进
//   - 服务质量监控
type TaskFeedback struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增，唯一标识反馈
	TaskID    int64     `json:"task_id" db:"task_id"`     // 任务ID，外键关联tasks表
	UserID    int64     `json:"user_id" db:"user_id"`     // 用户ID，外键关联users表，表示反馈的提交者
	Rating    int       `json:"rating" db:"rating"`       // 评分，1-5星，5星表示最高评价
	Comment   string    `json:"comment" db:"comment"`     // 评论内容，用户对任务执行结果的具体评价
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 反馈创建时间，UTC时间戳
}