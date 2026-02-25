// Package interfaces 定义了领域层的接口规范。
// 这些接口定义了数据访问层的契约，由具体实现类负责实现。
package interfaces

import (
	"context"

	"github.com/medagil/api-service/domain/entities"
)

// SubscriptionPlanRepository 定义订阅计划数据访问接口。
// 管理不同的订阅套餐，包括价格、积分额度等信息。
type SubscriptionPlanRepository interface {
	Create(ctx context.Context, plan *entities.SubscriptionPlan) error                    // 创建订阅计划
	GetByID(ctx context.Context, id int64) (*entities.SubscriptionPlan, error)           // 根据ID获取订阅计划
	Update(ctx context.Context, plan *entities.SubscriptionPlan) error                    // 更新订阅计划信息
	Delete(ctx context.Context, id int64) error                                           // 删除订阅计划
	List(ctx context.Context, offset, limit int) ([]*entities.SubscriptionPlan, error)   // 分页获取订阅计划列表
}

// SubscriptionRepository 定义用户订阅数据访问接口。
// 管理用户购买的订阅信息，包括状态、到期时间等。
type SubscriptionRepository interface {
	Create(ctx context.Context, subscription *entities.Subscription) error                    // 创建用户订阅
	GetByID(ctx context.Context, id int64) (*entities.Subscription, error)                    // 根据ID获取用户订阅
	GetByUserID(ctx context.Context, userID int64) ([]*entities.Subscription, error)          // 根据用户ID获取订阅列表
	Update(ctx context.Context, subscription *entities.Subscription) error                    // 更新用户订阅信息
	Delete(ctx context.Context, id int64) error                                                // 删除用户订阅
}

// OrderRepository 定义订单数据访问接口。
// 管理用户购买订阅的订单信息，包括金额、状态等。
type OrderRepository interface {
	Create(ctx context.Context, order *entities.Order) error                                                                 // 创建订单
	GetByID(ctx context.Context, id int64) (*entities.Order, error)                                                          // 根据ID获取订单
	GetByOrderNo(ctx context.Context, orderNo string) (*entities.Order, error)                                               // 根据订单号获取订单
	GetByUserID(ctx context.Context, userID int64, offset, limit int) ([]*entities.Order, error)                             // 根据用户ID分页获取订单列表
	Update(ctx context.Context, order *entities.Order) error                                                                  // 更新订单信息
}

// PaymentTransactionRepository 定义支付交易数据访问接口。
// 记录具体的支付交易信息，包括第三方支付平台的回调数据。
type PaymentTransactionRepository interface {
	Create(ctx context.Context, transaction *entities.PaymentTransaction) error                              // 创建支付交易记录
	GetByID(ctx context.Context, id int64) (*entities.PaymentTransaction, error)                             // 根据ID获取支付交易
	GetByOrderID(ctx context.Context, orderID int64) ([]*entities.PaymentTransaction, error)                 // 根据订单ID获取支付交易列表
	Update(ctx context.Context, transaction *entities.PaymentTransaction) error                              // 更新支付交易信息
}