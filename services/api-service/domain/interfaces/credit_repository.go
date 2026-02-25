// Package interfaces 定义了领域层的接口规范。
// 这些接口定义了数据访问层的契约，由具体实现类负责实现。
package interfaces

import (
	"context"

	"github.com/medagil/api-service/domain/entities"
)

// CreditAccountRepository 定义积分账户数据访问接口。
// 管理用户的积分账户信息，包括总积分、可用积分、冻结积分等。
type CreditAccountRepository interface {
	Create(ctx context.Context, account *entities.CreditAccount) error                    // 创建积分账户
	GetByUserID(ctx context.Context, userID int64) (*entities.CreditAccount, error)      // 根据用户ID获取积分账户
	Update(ctx context.Context, account *entities.CreditAccount) error                    // 更新积分账户信息
}

// CreditTransactionRepository 定义积分交易数据访问接口。
// 记录积分的变动历史，包括收入、支出、冻结、解冻等操作。
type CreditTransactionRepository interface {
	Create(ctx context.Context, transaction *entities.CreditTransaction) error                                                                 // 创建积分交易记录
	GetByUserID(ctx context.Context, userID int64, offset, limit int) ([]*entities.CreditTransaction, error)                                   // 根据用户ID分页获取积分交易记录
}

// CreditRuleRepository 定义积分规则数据访问接口。
// 管理积分获取和消耗的规则，如注册赠送、任务奖励等。
type CreditRuleRepository interface {
	Create(ctx context.Context, rule *entities.CreditRule) error                    // 创建积分规则
	GetByID(ctx context.Context, id int64) (*entities.CreditRule, error)           // 根据ID获取积分规则
	Update(ctx context.Context, rule *entities.CreditRule) error                    // 更新积分规则
	Delete(ctx context.Context, id int64) error                                     // 删除积分规则
	List(ctx context.Context, offset, limit int) ([]*entities.CreditRule, error)   // 分页获取积分规则列表
}