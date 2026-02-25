// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// SubscriptionPlan 表示数据库中 subscription_plans 表的订阅计划实体。
// 定义不同的订阅套餐，包括价格、积分额度等。
type SubscriptionPlan struct {
	ID             int64                           `json:"id" db:"id"`               // 主键，自增
	Name           string                          `json:"name" db:"name"`           // 计划名称
	Type           valueobjects.SubscriptionPlanType `json:"type" db:"type"`         // 计划类型（免费、专业、最大）
	Price          float64                         `json:"price" db:"price"`         // 价格
	Currency       string                          `json:"currency" db:"currency"`   // 货币类型
	Period         string                          `json:"period" db:"period"`       // 周期（月度、年度等）
	CreditLimit    int64                           `json:"credit_limit" db:"credit_limit"` // 积分额度
	IsTeam         bool                            `json:"is_team" db:"is_team"`     // 是否为团队计划
	IsActive       bool                            `json:"is_active" db:"is_active"` // 是否激活
	CreatedAt      time.Time                       `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt      time.Time                       `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}

// Subscription 表示数据库中 subscriptions 表的用户订阅实体。
// 记录用户购买的订阅信息，包括状态、到期时间等。
type Subscription struct {
	ID             int64                            `json:"id" db:"id"`               // 主键，自增
	UserID         int64                            `json:"user_id" db:"user_id"`     // 用户ID，外键关联 users 表
	PlanID         int64                            `json:"plan_id" db:"plan_id"`     // 计划ID，外键关联 subscription_plans 表
	Status         valueobjects.SubscriptionStatus  `json:"status" db:"status"`       // 订阅状态（活跃、过期、取消等）
	StartAt        time.Time                        `json:"start_at" db:"start_at"`   // 开始时间
	EndAt          time.Time                        `json:"end_at" db:"end_at"`       // 结束时间
	AutoRenew      bool                             `json:"auto_renew" db:"auto_renew"` // 是否自动续费
	CreatedAt      time.Time                        `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt      time.Time                        `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}

// Order 表示数据库中 orders 表的订单实体。
// 记录用户购买订阅的订单信息，包括金额、状态等。
type Order struct {
	ID             int64                     `json:"id" db:"id"`                    // 主键，自增
	OrderNo        string                    `json:"order_no" db:"order_no"`        // 订单号，唯一标识
	UserID         int64                     `json:"user_id" db:"user_id"`          // 用户ID，外键关联 users 表
	PlanID         int64                     `json:"plan_id" db:"plan_id"`          // 计划ID，外键关联 subscription_plans 表
	Amount         float64                   `json:"amount" db:"amount"`            // 订单金额
	Currency       string                    `json:"currency" db:"currency"`        // 货币类型
	Status         valueobjects.OrderStatus  `json:"status" db:"status"`            // 订单状态（待支付、已支付、已取消等）
	PaymentStatus  valueobjects.PaymentStatus `json:"payment_status" db:"payment_status"` // 支付状态
	RefundStatus   string                    `json:"refund_status" db:"refund_status"` // 退款状态
	CreatedAt      time.Time                 `json:"created_at" db:"created_at"`    // 创建时间戳
	UpdatedAt      time.Time                 `json:"updated_at" db:"updated_at"`    // 最后更新时间戳
}

// PaymentTransaction 表示数据库中 payment_transactions 表的支付交易实体。
// 记录具体的支付交易信息，包括第三方支付平台的回调数据。
type PaymentTransaction struct {
	ID               int64     `json:"id" db:"id"`                               // 主键，自增
	OrderID          int64     `json:"order_id" db:"order_id"`                  // 订单ID，外键关联 orders 表
	OutTradeNo       string    `json:"out_trade_no" db:"out_trade_no"`          // 商户订单号
	TransactionID    string    `json:"transaction_id" db:"transaction_id"`     // 第三方交易号
	PaymentMethod    string    `json:"payment_method" db:"payment_method"`     // 支付方式（支付宝、微信等）
	Amount           float64   `json:"amount" db:"amount"`                      // 交易金额
	Currency         string    `json:"currency" db:"currency"`                  // 货币类型
	Status           valueobjects.PaymentStatus `json:"status" db:"status"`     // 支付状态
	CallbackData     string    `json:"callback_data" db:"callback_data"`       // 支付回调数据（JSON格式）
	CreatedAt        time.Time `json:"created_at" db:"created_at"`              // 创建时间戳
	UpdatedAt        time.Time `json:"updated_at" db:"updated_at"`              // 最后更新时间戳
}