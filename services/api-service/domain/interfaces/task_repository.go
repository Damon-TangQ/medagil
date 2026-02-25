// Package interfaces 定义了领域层的接口规范。
// 这些接口定义了数据访问层的契约，由具体实现类负责实现。
package interfaces

import (
	"context"

	"github.com/medagil/api-service/domain/entities"
)

// TaskRepository 定义任务数据访问接口。
// 管理用户创建的任务信息，包括任务编号、智能体类型、状态等。
type TaskRepository interface {
	Create(ctx context.Context, task *entities.Task) error                                                                 // 创建任务
	GetByID(ctx context.Context, id int64) (*entities.Task, error)                                                         // 根据ID获取任务
	GetByUserID(ctx context.Context, userID int64, offset, limit int) ([]*entities.Task, error)                            // 根据用户ID分页获取任务列表
	Update(ctx context.Context, task *entities.Task) error                                                                  // 更新任务信息
	Delete(ctx context.Context, id int64) error                                                                             // 删除任务
}

// TaskFileRepository 定义任务文件关联数据访问接口。
// 管理任务与上传文件之间的关联关系。
type TaskFileRepository interface {
	Create(ctx context.Context, taskFile *entities.TaskFile) error                    // 创建任务文件关联
	GetByTaskID(ctx context.Context, taskID int64) ([]*entities.TaskFile, error)     // 根据任务ID获取文件列表
	Delete(ctx context.Context, taskID, fileID int64) error                           // 删除任务文件关联
}

// TaskFeedbackRepository 定义任务反馈数据访问接口。
// 管理用户对任务执行结果的评价和反馈。
type TaskFeedbackRepository interface {
	Create(ctx context.Context, feedback *entities.TaskFeedback) error                    // 创建任务反馈
	GetByTaskID(ctx context.Context, taskID int64) ([]*entities.TaskFeedback, error)     // 根据任务ID获取反馈列表
	Update(ctx context.Context, feedback *entities.TaskFeedback) error                    // 更新任务反馈
}