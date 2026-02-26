package repositories

import (
	"github.com/medagil/api-service/domain/entities"
	"gorm.io/gorm"
)

// UserRepository 定义用户仓储接口
type UserRepository interface {
	FindPaginated(page, pageSize int) ([]entities.User, int, error)
	FindByID(id int64) (*entities.User, error)
	Count() (int64, error)
	GetUserPlan(userID int64) (string, error)
	GetUserCredits(userID int64) (int64, error)
}

// userRepository 实现用户仓储
type userRepository struct {
	db *gorm.DB
}

// NewUserRepository 创建用户仓储实例
func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

// FindPaginated 分页查询用户
func (r *userRepository) FindPaginated(page, pageSize int) ([]entities.User, int, error) {
	var users []entities.User
	var total int64

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 先查询总数
	err := r.db.Model(&entities.User{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 分页查询数据，按ID降序排序
	err = r.db.Offset(offset).Limit(pageSize).Order("id DESC").Find(&users).Error
	if err != nil {
		return nil, 0, err
	}

	return users, int(total), nil
}

// FindByID 根据ID查找用户
func (r *userRepository) FindByID(id int64) (*entities.User, error) {
	var user entities.User
	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// Count 获取用户总数
func (r *userRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&entities.User{}).Count(&count).Error
	return count, err
}

// GetUserPlan 获取用户的订阅计划
func (r *userRepository) GetUserPlan(userID int64) (string, error) {
	var subscription entities.Subscription
	err := r.db.Where("user_id = ? AND status = ?", userID, "active").
		Order("end_date DESC").
		First(&subscription).Error
	if err != nil {
		return "free", nil // 没有订阅时返回free
	}
	return subscription.Plan, nil
}

// GetUserCredits 获取用户的积分余额
func (r *userRepository) GetUserCredits(userID int64) (int64, error) {
	var totalCredits int64
	err := r.db.Model(&entities.CreditTransaction{}).
		Where("user_id = ?", userID).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&totalCredits).Error
	return totalCredits, err
}
