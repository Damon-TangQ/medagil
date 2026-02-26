// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
// 所有实体都遵循统一的命名规范和字段定义，确保数据一致性和可维护性。
package entities

import (
	"time"
)

// Credit 表示数据库中 credits 表的积分实体。
//
// 用途：记录用户的积分获取和使用情况，支持积分管理和激励。
//
// 数据库表：credits
//
// 字段说明：
//   - ID: 主键，自增，唯一标识积分记录
//   - UserID: 用户ID，外键关联users表
//   - Type: 积分类型，earn表示获取，spend表示消费
//   - Amount: 积分数量，正数表示获取，负数表示消费
//   - Description: 积分来源或用途说明
//   - CreatedAt: 积分创建时间，UTC时间戳
//
// 使用场景：
//   - 积分获取
//   - 积分消费
//   - 积分统计
//   - 积分对账
type Credit struct {
	ID          int64     `json:"id" gorm:"column:id;primaryKey" db:"id"`                     // 主键，自增，唯一标识积分记录
	UserID      int64     `json:"user_id" gorm:"column:user_id" db:"user_id"`           // 用户ID，外键关联users表
	Type        string    `json:"type" gorm:"column:type" db:"type"`                   // 积分类型，earn表示获取，spend表示消费
	Amount      int64     `json:"amount" gorm:"column:amount" db:"amount"`             // 积分数量，正数表示获取，负数表示消费
	Description *string   `json:"description" gorm:"column:description" db:"description"` // 积分来源或用途说明
	CreatedAt   time.Time `json:"created_at" gorm:"column:created_at" db:"created_at"`   // 积分创建时间，UTC时间戳
}

// TableName 指定Credit实体对应的数据库表名
func (Credit) TableName() string {
	return "credits"
}


// CreditAccount 表示数据库中 credit_accounts 表的积分账户实体。
// 
// 用途：记录用户的积分余额信息，包括总积分、可用积分、冻结积分等，是积分管理的核心实体。
// 
// 数据库表：credit_accounts
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识积分账户
//   - UserID: 用户ID，外键关联users表，表示账户的所有者
//   - Total: 总积分数量，包括可用积分和冻结积分
//   - Available: 可用积分数量，可以用于消费的积分
//   - Frozen: 冻结积分数量，暂时不可用的积分（如待确认的交易）
//   - CreatedAt: 账户创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 积分余额查询
//   - 积分消费
//   - 积分充值
//   - 积分冻结/解冻
type CreditAccount struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增，唯一标识积分账户
	UserID    int64     `json:"user_id" db:"user_id"`     // 用户ID，外键关联users表，表示账户的所有者
	Total     int64     `json:"total" db:"total"`         // 总积分数量，包括可用积分和冻结积分
	Available int64     `json:"available" db:"available"` // 可用积分数量，可以用于消费的积分
	Frozen    int64     `json:"frozen" db:"frozen"`       // 冻结积分数量，暂时不可用的积分（如待确认的交易）
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 账户创建时间，UTC时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}

// CreditTransaction 表示数据库中 credit_transactions 表的积分交易实体。
// 
// 用途：记录积分的变动历史，包括收入、支出、冻结、解冻等操作，支持积分对账和查询。
// 
// 数据库表：credit_transactions
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识积分交易
//   - UserID: 用户ID，外键关联users表，表示交易的用户
//   - Type: 交易类型，如"income"表示收入，"expense"表示支出，"freeze"表示冻结，"unfreeze"表示解冻
//   - Amount: 交易积分数量，正数表示收入，负数表示支出
//   - Balance: 交易后的积分余额，记录交易完成后的账户余额
//   - Reason: 交易原因描述，如"注册赠送"、"任务奖励"、"消费扣除"等
//   - ReferenceID: 关联的业务ID，可为空，如订单ID、任务ID等
//   - CreatedAt: 交易创建时间，UTC时间戳
// 
// 使用场景：
//   - 积分交易记录
//   - 积分对账
//   - 积分查询
//   - 积分统计
type CreditTransaction struct {
	ID          int64     `json:"id" db:"id"`                  // 主键，自增，唯一标识积分交易
	UserID      int64     `json:"user_id" db:"user_id"`        // 用户ID，外键关联users表，表示交易的用户
	Type        string    `json:"type" db:"type"`              // 交易类型，如"income"表示收入，"expense"表示支出，"freeze"表示冻结，"unfreeze"表示解冻
	Amount      int64     `json:"amount" db:"amount"`          // 交易积分数量，正数表示收入，负数表示支出
	Balance     int64     `json:"balance" db:"balance"`        // 交易后的积分余额，记录交易完成后的账户余额
	Reason      string    `json:"reason" db:"reason"`          // 交易原因描述，如"注册赠送"、"任务奖励"、"消费扣除"等
	ReferenceID *int64    `json:"reference_id" db:"reference_id"` // 关联的业务ID，可为空，如订单ID、任务ID等
	CreatedAt   time.Time `json:"created_at" db:"created_at"`  // 交易创建时间，UTC时间戳
}

// CreditRule 表示数据库中 credit_rules 表的积分规则实体。
// 
// 用途：定义积分的获取和消耗规则，如注册赠送、任务奖励等，支持灵活的积分管理。
// 
// 数据库表：credit_rules
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识积分规则
//   - Name: 规则名称，如"注册赠送"、"任务奖励"、"消费扣除"等
//   - Type: 规则类型，如"register"表示注册赠送，"task"表示任务奖励，"consume"表示消费扣除
//   - Amount: 积分数量，正数表示增加，负数表示扣除
//   - Description: 规则描述，详细说明规则的触发条件和效果
//   - IsActive: 是否激活，true表示当前生效，false表示已禁用
//   - CreatedAt: 规则创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 积分规则管理
//   - 积分自动发放
//   - 积分自动扣除
//   - 积分活动管理
type CreditRule struct {
	ID          int64     `json:"id" db:"id"`                  // 主键，自增，唯一标识积分规则
	Name        string    `json:"name" db:"name"`              // 规则名称，如"注册赠送"、"任务奖励"、"消费扣除"等
	Type        string    `json:"type" db:"type"`              // 规则类型，如"register"表示注册赠送，"task"表示任务奖励，"consume"表示消费扣除
	Amount      int64     `json:"amount" db:"amount"`          // 积分数量，正数表示增加，负数表示扣除
	Description string    `json:"description" db:"description"` // 规则描述，详细说明规则的触发条件和效果
	IsActive    bool      `json:"is_active" db:"is_active"`    // 是否激活，true表示当前生效，false表示已禁用
	CreatedAt   time.Time `json:"created_at" db:"created_at"`  // 规则创建时间，UTC时间戳
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`  // 最后更新时间，UTC时间戳
}