// Package interfaces 定义了领域层的接口规范。
// 这些接口定义了数据访问层的契约，由具体实现类负责实现。
package interfaces

import (
	"context"

	"github.com/medagil/api-service/domain/entities"
)

// AdminUserRepository 定义管理员用户数据访问接口。
// 提供管理员用户的CRUD操作和查询功能。
type AdminUserRepository interface {
	Create(ctx context.Context, adminUser *entities.AdminUser) error                    // 创建管理员用户
	GetByID(ctx context.Context, id int64) (*entities.AdminUser, error)                 // 根据ID获取管理员用户
	GetByUsername(ctx context.Context, username string) (*entities.AdminUser, error)   // 根据用户名获取管理员用户
	Update(ctx context.Context, adminUser *entities.AdminUser) error                    // 更新管理员用户信息
	Delete(ctx context.Context, id int64) error                                         // 删除管理员用户
	List(ctx context.Context, offset, limit int) ([]*entities.AdminUser, error)         // 分页获取管理员用户列表
}

// RoleRepository 定义角色数据访问接口。
// 提供角色的CRUD操作和查询功能。
type RoleRepository interface {
	Create(ctx context.Context, role *entities.Role) error                    // 创建角色
	GetByID(ctx context.Context, id int64) (*entities.Role, error)           // 根据ID获取角色
	Update(ctx context.Context, role *entities.Role) error                    // 更新角色信息
	Delete(ctx context.Context, id int64) error                               // 删除角色
	List(ctx context.Context, offset, limit int) ([]*entities.Role, error)   // 分页获取角色列表
}

// PermissionRepository 定义权限数据访问接口。
// 提供权限的CRUD操作和查询功能。
type PermissionRepository interface {
	Create(ctx context.Context, permission *entities.Permission) error                    // 创建权限
	GetByID(ctx context.Context, id int64) (*entities.Permission, error)                 // 根据ID获取权限
	Update(ctx context.Context, permission *entities.Permission) error                    // 更新权限信息
	Delete(ctx context.Context, id int64) error                                           // 删除权限
	List(ctx context.Context, offset, limit int) ([]*entities.Permission, error)         // 分页获取权限列表
}

// RolePermissionRepository 定义角色权限关联数据访问接口。
// 管理角色与权限之间的多对多关系。
type RolePermissionRepository interface {
	Create(ctx context.Context, rp *entities.RolePermission) error                              // 创建角色权限关联
	GetByRoleID(ctx context.Context, roleID int64) ([]*entities.RolePermission, error)          // 根据角色ID获取权限列表
	Delete(ctx context.Context, roleID, permissionID int64) error                               // 删除角色权限关联
}

// AdminUserRoleRepository 定义管理员用户角色关联数据访问接口。
// 管理管理员用户与角色之间的多对多关系。
type AdminUserRoleRepository interface {
	Create(ctx context.Context, aur *entities.AdminUserRole) error                              // 创建管理员用户角色关联
	GetByAdminUserID(ctx context.Context, adminUserID int64) ([]*entities.AdminUserRole, error)  // 根据管理员用户ID获取角色列表
	Delete(ctx context.Context, adminUserID, roleID int64) error                                // 删除管理员用户角色关联
}

// AuditLogRepository 定义审计日志数据访问接口。
// 记录系统操作日志，用于审计和追踪。
type AuditLogRepository interface {
	Create(ctx context.Context, log *entities.AuditLog) error                                                                 // 创建审计日志
	List(ctx context.Context, actorType string, actorID int64, offset, limit int) ([]*entities.AuditLog, error)               // 根据操作者分页获取审计日志列表
}