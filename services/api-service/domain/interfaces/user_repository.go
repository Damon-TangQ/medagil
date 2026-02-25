// Package interfaces 定义数据访问的仓储接口。
// 这些接口提供与数据库层交互的契约。
package interfaces

import (
	"context"

	"github.com/medagil/api-service/domain/entities"
)

// UserRepository 定义用户相关数据库操作的接口。
// 它提供创建、检索、更新和删除用户实体的方法。
type UserRepository interface {
	Create(ctx context.Context, user *entities.User) error                                    // 创建新用户
	GetByID(ctx context.Context, id int64) (*entities.User, error)                             // 根据 ID 获取用户
	GetByEmail(ctx context.Context, email string) (*entities.User, error)                      // 根据邮箱获取用户
	GetByPhone(ctx context.Context, phone string) (*entities.User, error)                      // 根据手机号获取用户
	Update(ctx context.Context, user *entities.User) error                                     // 更新用户信息
	Delete(ctx context.Context, id int64) error                                                 // 根据 ID 删除用户
	List(ctx context.Context, offset, limit int) ([]*entities.User, error)                      // 分页列出用户
}

// UserAuthIdentityRepository 定义用户认证身份操作的接口。
// 它管理链接到用户的第三方认证身份。
type UserAuthIdentityRepository interface {
	Create(ctx context.Context, identity *entities.UserAuthIdentity) error                      // 创建新的认证身份
	GetByUserIDAndProvider(ctx context.Context, userID int64, provider string) (*entities.UserAuthIdentity, error) // 根据用户和提供商获取身份
	Update(ctx context.Context, identity *entities.UserAuthIdentity) error                      // 更新认证身份
	Delete(ctx context.Context, id int64) error                                                 // 根据 ID 删除认证身份
}

// UserTagRepository 定义用户标签操作的接口。
// 它管理可分配给用户进行分类的标签。
type UserTagRepository interface {
	Create(ctx context.Context, tag *entities.UserTag) error                                    // 创建新的用户标签
	GetByID(ctx context.Context, id int64) (*entities.UserTag, error)                           // 根据 ID 获取标签
	Update(ctx context.Context, tag *entities.UserTag) error                                    // 更新标签信息
	Delete(ctx context.Context, id int64) error                                                 // 根据 ID 删除标签
	List(ctx context.Context, offset, limit int) ([]*entities.UserTag, error)                   // 分页列出标签
}

// UserTagRelationRepository 定义用户-标签关系操作的接口。
// 它管理用户和标签之间的多对多关系。
type UserTagRelationRepository interface {
	Create(ctx context.Context, relation *entities.UserTagRelation) error                       // 创建用户-标签关系
	GetByUserID(ctx context.Context, userID int64) ([]*entities.UserTagRelation, error)         // 获取用户的所有标签
	Delete(ctx context.Context, userID, tagID int64) error                                      // 从用户移除标签
}