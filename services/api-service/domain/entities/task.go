// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// Task 表示数据库中 tasks 表的任务实体。
// 记录用户创建的任务信息，包括任务编号、智能体类型、状态等。
type Task struct {
	ID             int64                   `json:"id" db:"id"`                        // 主键，自增
	UserID         int64                   `json:"user_id" db:"user_id"`              // 用户ID，外键关联 users 表
	TaskNo         string                  `json:"task_no" db:"task_no"`              // 任务编号，唯一标识
	AgentType      string                  `json:"agent_type" db:"agent_type"`       // 智能体类型
	Status         valueobjects.TaskStatus `json:"status" db:"status"`                // 任务状态（待处理、进行中、已完成等）
	DifyTaskID     *string                 `json:"dify_task_id" db:"dify_task_id"`    // Dify平台任务ID（可空）
	CreatedAt      time.Time               `json:"created_at" db:"created_at"`       // 创建时间戳
	UpdatedAt      time.Time               `json:"updated_at" db:"updated_at"`       // 最后更新时间戳
}

// TaskFile 表示数据库中 task_files 表的任务文件关联实体。
// 记录任务与上传文件之间的关联关系。
type TaskFile struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增
	TaskID    int64     `json:"task_id" db:"task_id"`     // 任务ID，外键关联 tasks 表
	FileID    int64     `json:"file_id" db:"file_id"`     // 文件ID，外键关联 files 表
	Type      string    `json:"type" db:"type"`           // 文件类型（输入文件、输出文件等）
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 创建时间戳
}

// TaskFeedback 表示数据库中 task_feedbacks 表的任务反馈实体。
// 记录用户对任务执行结果的评价和反馈。
type TaskFeedback struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增
	TaskID    int64     `json:"task_id" db:"task_id"`     // 任务ID，外键关联 tasks 表
	UserID    int64     `json:"user_id" db:"user_id"`     // 用户ID，外键关联 users 表
	Rating    int       `json:"rating" db:"rating"`       // 评分（1-5星）
	Comment   string    `json:"comment" db:"comment"`     // 评论内容
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 创建时间戳
}