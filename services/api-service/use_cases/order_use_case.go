package usecases

import (
	"fmt"
	"github.com/medagil/api-service/domain/interfaces"
	"github.com/medagil/api-service/domain/entities"
)

// OrderUseCase 定义订单业务逻辑接口
type OrderUseCase interface {
	GetOrders(page, pageSize int) ([]entities.Order, int, error)
}

// orderUseCase 实现订单业务逻辑
type orderUseCase struct {
	repo interfaces.OrderRepository  // 依赖接口而非具体实现
}

// NewOrderUseCase 创建订单业务逻辑实例
func NewOrderUseCase(repo interfaces.OrderRepository) OrderUseCase {
	return &orderUseCase{repo: repo}
}

// GetOrders 获取分页订单列表
func (uc *orderUseCase) GetOrders(page, pageSize int) ([]entities.Order, int, error) {
	// 业务参数校验
	if page < 1 {
		return nil, 0, fmt.Errorf("页码无效：页码必须≥1")
	}
	if pageSize < 1 || pageSize > 100 {
		return nil, 0, fmt.Errorf("每页条数无效：每页条数必须在1-100之间")
	}

	return uc.repo.FindPaginated(page, pageSize)
}