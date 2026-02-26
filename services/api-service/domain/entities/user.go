// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
// 所有实体都遵循统一的命名规范和字段定义，确保数据一致性和可维护性。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// User 表示数据库中 users 表的用户实体。
// 
// 用途：用户是系统的核心实体，支持多种登录方式（微信、手机号、邮箱）。
// 
// 数据库表：users
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识用户
//   - Username: 用户名，用于登录和展示，全局唯一
//   - Email: 邮箱地址，可为空，用于邮箱登录和通知
//   - Phone: 手机号，可为空，用于手机号登录和短信通知
//   - Status: 用户状态，active表示正常可用，inactive表示未激活，banned表示封禁
//   - CreatedAt: 账户创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 用户登录
//   - 用户信息管理
//   - 权限控制
//   - 用户统计
type User struct {
	ID          int64                      `json:"id" gorm:"column:id;primaryKey" db:"id"`          // 主键，自增，唯一标识用户
	Username    string                    `json:"username" gorm:"column:username" db:"username"` // 用户名，用于登录和展示，全局唯一
	Email       *string                   `json:"email" gorm:"column:email" db:"email"`     // 邮箱地址，可为空，用于邮箱登录和通知
	Phone       *string                   `json:"phone" gorm:"column:phone" db:"phone"`     // 手机号，可为空，用于手机号登录和短信通知
	Status      valueobjects.UserStatus   `json:"status" gorm:"column:status" db:"status"`  // 用户状态，active表示正常可用，inactive表示未激活，banned表示封禁
	CreatedAt   time.Time                 `json:"created_at" gorm:"column:created_at" db:"created_at"` // 账户创建时间，UTC时间戳
	UpdatedAt   time.Time                 `json:"updated_at" gorm:"column:updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}

// UserAuthIdentity 表示数据库中 user_auth_identities 表的用户认证身份实体。
// 
// 用途：管理用户与第三方认证提供商的关联，支持多种登录方式。
// 
// 数据库表：user_auth_identities
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识认证身份
//   - UserID: 用户ID，外键关联users表
//   - Provider: 认证提供商，wechat表示微信，phone表示手机号，email表示邮箱
//   - ProviderUserID: 提供商用户ID，如微信openid、手机号、邮箱地址
//   - CreatedAt: 认证身份创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 多种登录方式支持
//   - 第三方登录集成
//   - 认证身份管理
type UserAuthIdentity struct {
	ID             int64                        `json:"id" db:"id"`             // 主键，自增，唯一标识认证身份
	UserID         int64                        `json:"user_id" db:"user_id"`   // 用户ID，外键关联users表
	Provider       valueobjects.AuthProvider   `json:"provider" db:"provider"` // 认证提供商，wechat表示微信，phone表示手机号，email表示邮箱
	ProviderUserID string                       `json:"provider_user_id" db:"provider_user_id"` // 提供商用户ID，如微信openid、手机号、邮箱地址
	CreatedAt      time.Time                    `json:"created_at" db:"created_at"` // 认证身份创建时间，UTC时间戳
	UpdatedAt      time.Time                    `json:"updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}

// UserTag 表示数据库中 user_tags 表的用户标签实体。
// 
// 用途：用于对用户进行分类和运营标签管理，支持用户分群和精准营销。
// 
// 数据库表：user_tags
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识标签
//   - Name: 标签名称，如"活跃用户"、"高价值用户"等
//   - Color: 标签颜色，用于前端展示，十六进制颜色值
//   - CreatedAt: 标签创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 用户分群
//   - 精准营销
//   - 用户分析
//   - 标签管理
type UserTag struct {
	ID        int64     `json:"id" db:"id"`         // 主键，自增，唯一标识标签
	Name      string    `json:"name" db:"name"`     // 标签名称，如"活跃用户"、"高价值用户"等
	Color     string    `json:"color" db:"color"`   // 标签颜色，用于前端展示，十六进制颜色值
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 标签创建时间，UTC时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}

// UserTagRelation 表示数据库中 user_tag_relations 表的用户标签关系实体。
// 
// 用途：管理用户与标签的多对多关系，实现灵活的用户标签分配。
// 
// 数据库表：user_tag_relations
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识用户标签关系
//   - UserID: 用户ID，外键关联users表
//   - TagID: 标签ID，外键关联user_tags表
//   - CreatedAt: 关系创建时间，UTC时间戳
// 
// 使用场景：
//   - 为用户分配标签
//   - 查询用户的所有标签
//   - 标签统计
//   - 用户分群查询
type UserTagRelation struct {
	ID        int64     `json:"id" db:"id"`         // 主键，自增，唯一标识用户标签关系
	UserID    int64     `json:"user_id" db:"user_id"` // 用户ID，外键关联users表
	TagID     int64     `json:"tag_id" db:"tag_id"` // 标签ID，外键关联user_tags表
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 关系创建时间，UTC时间戳
}