// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
package entities

import (
	"time"
)

// CreditAccount 表示数据库中 credit_accounts 表的积分账户实体。
// 记录用户的积分余额信息，包括总积分、可用积分、冻结积分等。
type CreditAccount struct {
	ID        int64     `json:"id" db:"id"`               // 主键，自增
	UserID    int64     `json:"user_id" db:"user_id"`     // 用户ID，外键关联 users 表
	Total     int64     `json:"total" db:"total"`         // 总积分数量
	Available int64     `json:"available" db:"available"` // 可用积分数量
	Frozen    int64     `json:"frozen" db:"frozen"`       // 冻结积分数量
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}

// CreditTransaction 表示数据库中 credit_transactions 表的积分交易实体。
// 记录积分的变动历史，包括收入、支出、冻结、解冻等操作。
type CreditTransaction struct {
	ID          int64     `json:"id" db:"id"`                  // 主键，自增
	UserID      int64     `json:"user_id" db:"user_id"`        // 用户ID，外键关联 users 表
	Type        string    `json:"type" db:"type"`              // 交易类型（收入、支出、冻结、解冻等）
	Amount      int64     `json:"amount" db:"amount"`          // 交易积分数量（正数表示收入，负数表示支出）
	Balance     int64     `json:"balance" db:"balance"`        // 交易后的积分余额
	Reason      string    `json:"reason" db:"reason"`          // 交易原因描述
	ReferenceID *int64    `json:"reference_id" db:"reference_id"` // 关联的业务ID（可空）
	CreatedAt   time.Time `json:"created_at" db:"created_at"`  // 创建时间戳
}

// CreditRule 表示数据库中 credit_rules 表的积分规则实体。
// 定义积分的获取和消耗规则，如注册赠送、任务奖励等。
type CreditRule struct {
	ID          int64     `json:"id" db:"id"`                  // 主键，自增
	Name        string    `json:"name" db:"name"`              // 规则名称
	Type        string    `json:"type" db:"type"`              // 规则类型（注册赠送、任务奖励、消费扣除等）
	Amount      int64     `json:"amount" db:"amount"`          // 积分数量
	Description string    `json:"description" db:"description"` // 规则描述
	IsActive    bool      `json:"is_active" db:"is_active"`    // 是否激活
	CreatedAt   time.Time `json:"created_at" db:"created_at"`  // 创建时间戳
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`  // 最后更新时间戳
}