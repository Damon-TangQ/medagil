package repositories

import (
	"github.com/medagil/api-service/domain/entities"
	"gorm.io/gorm"
)

// OrderRepository 定义订单仓储接口
type OrderRepository interface {
	Create(order *entities.Order) error
	Update(order *entities.Order) error
	Delete(id int64) error
	FindPaginated(page, pageSize int) ([]entities.Order, int, error)
	FindByID(id int64) (*entities.Order, error)
	Count() (int64, error)
	CalculateMRR() (float64, error)
}

// orderRepository 实现订单仓储
type orderRepository struct {
	db *gorm.DB
}

// NewOrderRepository 创建订单仓储实例
func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: db}
}

// Create 创建订单
func (r *orderRepository) Create(order *entities.Order) error {
	return r.db.Create(order).Error
}

// Update 更新订单
func (r *orderRepository) Update(order *entities.Order) error {
	return r.db.Save(order).Error
}

// Delete 删除订单
func (r *orderRepository) Delete(id int64) error {
	return r.db.Delete(&entities.Order{}, id).Error
}

// FindPaginated 分页查询订单，使用GORM原生分页提高效率
func (r *orderRepository) FindPaginated(page, pageSize int) ([]entities.Order, int, error) {
	var orders []entities.Order
	var total int64

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 先查询总数
	err := r.db.Model(&entities.Order{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 分页查询数据，按ID降序排序
	err = r.db.Offset(offset).Limit(pageSize).Order("id DESC").Find(&orders).Error
	if err != nil {
		return nil, 0, err
	}

	return orders, int(total), nil
}

// FindByID 根据ID查找订单
func (r *orderRepository) FindByID(id int64) (*entities.Order, error) {
	var order entities.Order
	err := r.db.First(&order, id).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

// Count 获取订单总数
func (r *orderRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&entities.Order{}).Count(&count).Error
	return count, err
}

// CalculateMRR 计算月度经常性收入
// MRR = 所有活跃订阅的月度收入总和
// 注意：当前schema中没有orders表，MRR基于订阅计划类型计算
// TODO: 后续添加orders表后，应该从订单实际支付金额计算
func (r *orderRepository) CalculateMRR() (float64, error) {
	var mrr float64

	// 查询所有状态为active的订阅
	var subscriptions []entities.Subscription
	err := r.db.Where("status = ?", "active").Find(&subscriptions).Error
	if err != nil {
		return 0, err
	}

	// 计算每个订阅的月度收入
	for _, sub := range subscriptions {
		// 计算订阅时长（月）
		durationMonths := sub.EndDate.Sub(sub.StartDate).Hours() / (24 * 30)

		// 根据订阅计划类型估算月度收入
		// TODO: 后续应该从subscription_plans表查询实际价格
		var monthlyAmount float64
		switch sub.Plan {
		case "free":
			monthlyAmount = 0
		case "pro":
			monthlyAmount = 199 / durationMonths // 假设pro计划199元
		case "max":
			monthlyAmount = 399 / durationMonths // 假设max计划399元
		default:
			monthlyAmount = 0
		}

		mrr += monthlyAmount
	}

	return mrr, nil
}
