// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// User 表示数据库中 users 表的用户实体。
// 用户是系统的核心实体，支持多种登录方式。
type User struct {
	ID          int64                      `json:"id" db:"id"`          // 主键，自增
	Username    string                    `json:"username" db:"username"` // 用户名
	Email       *string                   `json:"email" db:"email"`     // 邮箱，可为空
	Phone       *string                   `json:"phone" db:"phone"`     // 手机号，可为空
	Status      valueobjects.UserStatus   `json:"status" db:"status"`  // 用户状态（激活、未激活、封禁）
	CreatedAt   time.Time                 `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt   time.Time                 `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}

// UserAuthIdentity 表示数据库中 user_auth_identities 表的用户认证身份实体。
// 管理用户与第三方认证提供商的关联。
type UserAuthIdentity struct {
	ID             int64                        `json:"id" db:"id"`             // 主键，自增
	UserID         int64                        `json:"user_id" db:"user_id"`   // 用户 ID
	Provider       valueobjects.AuthProvider   `json:"provider" db:"provider"` // 认证提供商（微信、手机号、邮箱）
	ProviderUserID string                       `json:"provider_user_id" db:"provider_user_id"` // 提供商用户 ID
	CreatedAt      time.Time                    `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt      time.Time                    `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}

// UserTag 表示数据库中 user_tags 表的用户标签实体。
// 用于对用户进行分类和运营标签管理。
type UserTag struct {
	ID        int64     `json:"id" db:"id"`         // 主键，自增
	Name      string    `json:"name" db:"name"`     // 标签名称
	Color     string    `json:"color" db:"color"`   // 标签颜色
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}

// UserTagRelation 表示数据库中 user_tag_relations 表的用户标签关系实体。
// 管理用户与标签的多对多关系。
type UserTagRelation struct {
	ID        int64     `json:"id" db:"id"`         // 主键，自增
	UserID    int64     `json:"user_id" db:"user_id"` // 用户 ID
	TagID     int64     `json:"tag_id" db:"tag_id"` // 标签 ID
	CreatedAt time.Time `json:"created_at" db:"created_at"` // 创建时间戳
}