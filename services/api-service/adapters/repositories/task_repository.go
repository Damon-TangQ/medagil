package repositories

import (
	"strconv"
	"time"

	"github.com/medagil/api-service/domain/entities"
	"gorm.io/gorm"
)

// TaskRepository 定义任务仓储接口
type TaskRepository interface {
	Create(task *entities.Task) error
	Update(task *entities.Task) error
	Delete(id int64) error
	FindPaginated(page, pageSize int) ([]entities.Task, int, error)
	FindByID(id int64) (*entities.Task, error)
	GetTaskDetail(taskID int64) (*TaskDetail, error)
}

// TaskDetail 任务详情
type TaskDetail struct {
	ID            int64
	UserID        int64
	TaskNo        string
	AgentType     string
	Status        string
	InputText     *string
	FileIDs       []string
	ResultPreview  *string
	ProjectID     *int64
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

// taskRepository 实现任务仓储
type taskRepository struct {
	db *gorm.DB
}

// NewTaskRepository 创建任务仓储实例
func NewTaskRepository(db *gorm.DB) TaskRepository {
	return &taskRepository{db: db}
}

// Create 创建任务
func (r *taskRepository) Create(task *entities.Task) error {
	return r.db.Create(task).Error
}

// Update 更新任务
func (r *taskRepository) Update(task *entities.Task) error {
	return r.db.Save(task).Error
}

// Delete 删除任务
func (r *taskRepository) Delete(id int64) error {
	return r.db.Delete(&entities.Task{}, id).Error
}

// FindPaginated 分页查询任务，使用GORM原生分页提高效率
func (r *taskRepository) FindPaginated(page, pageSize int) ([]entities.Task, int, error) {
	var tasks []entities.Task
	var total int64

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 先查询总数
	err := r.db.Model(&entities.Task{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 分页查询数据，按ID降序排序
	err = r.db.Offset(offset).Limit(pageSize).Order("id DESC").Find(&tasks).Error
	if err != nil {
		return nil, 0, err
	}

	return tasks, int(total), nil
}

// FindByID 根据ID查找任务
func (r *taskRepository) FindByID(id int64) (*entities.Task, error) {
	var task entities.Task
	err := r.db.First(&task, id).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

// GetTaskDetail 获取任务详情，包括关联的文件和结果
func (r *taskRepository) GetTaskDetail(taskID int64) (*TaskDetail, error) {
	var task entities.Task
	err := r.db.First(&task, taskID).Error
	if err != nil {
		return nil, err
	}

	detail := &TaskDetail{
		ID:        task.ID,
		UserID:    task.UserID,
		TaskNo:    task.TaskNo,
		AgentType:  task.AgentType,
		Status:     string(task.Status),
		CreatedAt:  task.CreatedAt,
		UpdatedAt:  task.UpdatedAt,
	}

	// 查询任务关联的文件
	var taskFiles []entities.TaskFile
	err = r.db.Where("task_id = ?", taskID).Find(&taskFiles).Error
	if err != nil {
		return nil, err
	}

	var fileIDs []string
	for _, tf := range taskFiles {
		fileIDs = append(fileIDs, strconv.FormatInt(tf.FileID, 10))
	}
	detail.FileIDs = fileIDs

	// TODO: 从task_input表查询InputText
	// TODO: 从task_output表查询ResultPreview
	// TODO: 从project_task关联表查询ProjectID

	return detail, nil
}