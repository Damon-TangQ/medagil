// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
// 所有实体都遵循统一的命名规范和字段定义，确保数据一致性和可维护性。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// SubscriptionPlan 表示数据库中 subscription_plans 表的订阅计划实体。
// 
// 用途：定义不同的订阅套餐，包括价格、积分额度等，支持灵活的订阅管理。
// 
// 数据库表：subscription_plans
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识订阅计划
//   - Name: 计划名称，如"免费版"、"专业版"、"企业版"等
//   - Type: 计划类型，free表示免费，pro表示专业，max表示最大
//   - Price: 价格，单位为元
//   - Currency: 货币类型，如"CNY"表示人民币
//   - Period: 周期，如"monthly"表示月度，"yearly"表示年度
//   - CreditLimit: 积分额度，表示该计划包含的积分数量
//   - IsTeam: 是否为团队计划，true表示团队计划，false表示个人计划
//   - IsActive: 是否激活，true表示当前可用，false表示已下架
//   - CreatedAt: 计划创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 订阅计划管理
//   - 价格管理
//   - 积分额度管理
//   - 订阅推广
type SubscriptionPlan struct {
	ID             int64                           `json:"id" db:"id"`               // 主键，自增，唯一标识订阅计划
	Name           string                          `json:"name" db:"name"`           // 计划名称，如"免费版"、"专业版"、"企业版"等
	Type           valueobjects.SubscriptionPlanType `json:"type" db:"type"`         // 计划类型，free表示免费，pro表示专业，max表示最大
	Price          float64                         `json:"price" db:"price"`         // 价格，单位为元
	Currency       string                          `json:"currency" db:"currency"`   // 货币类型，如"CNY"表示人民币
	Period         string                          `json:"period" db:"period"`       // 周期，如"monthly"表示月度，"yearly"表示年度
	CreditLimit    int64                           `json:"credit_limit" db:"credit_limit"` // 积分额度，表示该计划包含的积分数量
	IsTeam         bool                            `json:"is_team" db:"is_team"`     // 是否为团队计划，true表示团队计划，false表示个人计划
	IsActive       bool                            `json:"is_active" db:"is_active"` // 是否激活，true表示当前可用，false表示已下架
	CreatedAt      time.Time                       `json:"created_at" db:"created_at"` // 计划创建时间，UTC时间戳
	UpdatedAt      time.Time                       `json:"updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}

// Subscription 表示数据库中 subscriptions 表的用户订阅实体。
// 
// 用途：记录用户购买的订阅信息，包括状态、到期时间等，是订阅管理的核心实体。
// 
// 数据库表：subscriptions
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识订阅
//   - UserID: 用户ID，外键关联users表，表示订阅的所有者
//   - PlanID: 计划ID，外键关联subscription_plans表
//   - Status: 订阅状态，active表示活跃，expired表示过期，cancelled表示已取消
//   - StartAt: 开始时间，订阅生效时间
//   - EndAt: 结束时间，订阅到期时间
//   - AutoRenew: 是否自动续费，true表示到期自动续费，false表示需要手动续费
//   - CreatedAt: 订阅创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 订阅管理
//   - 订阅续费
//   - 权限控制
//   - 订阅统计
type Subscription struct {
	ID        int64                           `json:"id" gorm:"column:id;primaryKey" db:"id"`                     // 主键，自增，唯一标识订阅
	UserID    int64                           `json:"user_id" gorm:"column:user_id" db:"user_id"`           // 用户ID，外键关联users表，表示订阅的所有者
	Plan      string                          `json:"plan" gorm:"column:plan" db:"plan"`                 // 订阅计划，free表示免费，pro表示专业，max表示最大
	Status    valueobjects.SubscriptionStatus `json:"status" gorm:"column:status" db:"status"`       // 订阅状态，active表示活跃，expired表示过期，cancelled表示已取消
	StartDate  time.Time                        `json:"start_date" gorm:"column:start_date" db:"start_date"`   // 开始时间，订阅生效时间
	EndDate    time.Time                        `json:"end_date" gorm:"column:end_date" db:"end_date"`       // 结束时间，订阅到期时间
	CreatedAt  time.Time                        `json:"created_at" gorm:"column:created_at" db:"created_at"` // 订阅创建时间，UTC时间戳
	UpdatedAt  time.Time                        `json:"updated_at" gorm:"column:updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}

// TableName 指定Subscription实体对应的数据库表名
func (Subscription) TableName() string {
	return "subscriptions"
}

// Order 表示数据库中 orders 表的订单实体。
// 
// 用途：记录用户购买订阅的订单信息，包括金额、状态等，是订单管理的核心实体。
// 
// 数据库表：orders
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识订单
//   - OrderNo: 订单号，全局唯一，用于外部引用和查询
//   - UserID: 用户ID，外键关联users表，表示订单的创建者
//   - PlanID: 计划ID，外键关联subscription_plans表
//   - Amount: 订单金额，单位为元
//   - Currency: 货币类型，如"CNY"表示人民币
//   - Status: 订单状态，pending表示待支付，paid表示已支付，cancelled表示已取消，refunded表示已退款
//   - PaymentStatus: 支付状态，pending表示待处理，success表示成功，failed表示失败
//   - RefundStatus: 退款状态，如"none"表示无退款，"partial"表示部分退款，"full"表示全额退款
//   - CreatedAt: 订单创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 订单创建
//   - 订单支付
//   - 订单退款
//   - 订单查询
type Order struct {
	ID             int64                     `json:"id" db:"id"`                    // 主键，自增，唯一标识订单
	OrderNo        string                    `json:"order_no" db:"order_no"`        // 订单号，全局唯一，用于外部引用和查询
	UserID         int64                     `json:"user_id" db:"user_id"`          // 用户ID，外键关联users表，表示订单的创建者
	PlanID         int64                     `json:"plan_id" db:"plan_id"`          // 计划ID，外键关联subscription_plans表
	Amount         float64                   `json:"amount" db:"amount"`            // 订单金额，单位为元
	Currency       string                    `json:"currency" db:"currency"`        // 货币类型，如"CNY"表示人民币
	Status         valueobjects.OrderStatus  `json:"status" db:"status"`            // 订单状态，pending表示待支付，paid表示已支付，cancelled表示已取消，refunded表示已退款
	PaymentStatus  valueobjects.PaymentStatus `json:"payment_status" db:"payment_status"` // 支付状态，pending表示待处理，success表示成功，failed表示失败
	RefundStatus   string                    `json:"refund_status" db:"refund_status"` // 退款状态，如"none"表示无退款，"partial"表示部分退款，"full"表示全额退款
	CreatedAt      time.Time                 `json:"created_at" db:"created_at"`    // 订单创建时间，UTC时间戳
	UpdatedAt      time.Time                 `json:"updated_at" db:"updated_at"`    // 最后更新时间，UTC时间戳
}

// PaymentTransaction 表示数据库中 payment_transactions 表的支付交易实体。
// 
// 用途：记录具体的支付交易信息，包括第三方支付平台的回调数据，支持支付对账和查询。
// 
// 数据库表：payment_transactions
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识支付交易
//   - OrderID: 订单ID，外键关联orders表
//   - OutTradeNo: 商户订单号，用于关联商户系统的订单
//   - TransactionID: 第三方交易号，如支付宝交易号、微信支付订单号
//   - PaymentMethod: 支付方式，如"alipay"表示支付宝，"wechat"表示微信支付
//   - Amount: 交易金额，单位为元
//   - Currency: 货币类型，如"CNY"表示人民币
//   - Status: 支付状态，pending表示待处理，success表示成功，failed表示失败
//   - CallbackData: 支付回调数据，JSON格式存储，包含第三方支付平台返回的完整信息
//   - CreatedAt: 交易创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 支付处理
//   - 支付对账
//   - 支付查询
//   - 退款处理
type PaymentTransaction struct {
	ID               int64     `json:"id" db:"id"`                               // 主键，自增，唯一标识支付交易
	OrderID          int64     `json:"order_id" db:"order_id"`                  // 订单ID，外键关联orders表
	OutTradeNo       string    `json:"out_trade_no" db:"out_trade_no"`          // 商户订单号，用于关联商户系统的订单
	TransactionID    string    `json:"transaction_id" db:"transaction_id"`     // 第三方交易号，如支付宝交易号、微信支付订单号
	PaymentMethod    string    `json:"payment_method" db:"payment_method"`     // 支付方式，如"alipay"表示支付宝，"wechat"表示微信支付
	Amount           float64   `json:"amount" db:"amount"`                      // 交易金额，单位为元
	Currency         string    `json:"currency" db:"currency"`                  // 货币类型，如"CNY"表示人民币
	Status           valueobjects.PaymentStatus `json:"status" db:"status"`     // 支付状态，pending表示待处理，success表示成功，failed表示失败
	CallbackData     string    `json:"callback_data" db:"callback_data"`       // 支付回调数据，JSON格式存储，包含第三方支付平台返回的完整信息
	CreatedAt        time.Time `json:"created_at" db:"created_at"`              // 交易创建时间，UTC时间戳
	UpdatedAt        time.Time `json:"updated_at" db:"updated_at"`              // 最后更新时间，UTC时间戳
}