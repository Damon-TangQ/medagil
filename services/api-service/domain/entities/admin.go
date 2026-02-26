// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
// 所有实体都遵循统一的命名规范和字段定义，确保数据一致性和可维护性。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// AdminUser 表示数据库中 admin_users 表的管理员用户实体。
// 
// 用途：管理端用户，用于系统管理和运营，具有不同的角色和权限。
// 
// 数据库表：admin_users
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识管理员用户
//   - Username: 管理员用户名，用于登录，全局唯一
//   - Password: 密码哈希值，使用bcrypt等算法加密存储
//   - Status: 管理员状态，active表示正常可用，inactive表示暂时禁用
//   - CreatedAt: 账户创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 管理员登录验证
//   - 权限控制
//   - 操作审计
type AdminUser struct {
	ID        int64                        `json:"id" db:"id"`         // 主键，自增，唯一标识管理员用户
	Username  string                      `json:"username" db:"username"` // 管理员用户名，用于登录，全局唯一
	Password  string                      `json:"password" db:"password"` // 密码哈希值，使用bcrypt等算法加密存储
	Status    valueobjects.AdminUserStatus `json:"status" db:"status"`  // 管理员状态，active表示正常可用，inactive表示暂时禁用
	CreatedAt time.Time                   `json:"created_at" db:"created_at"` // 账户创建时间，UTC时间戳
	UpdatedAt time.Time                   `json:"updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}

// Role 表示数据库中 roles 表的角色实体。
// 
// 用途：定义管理员的角色类型和权限集合，实现基于角色的访问控制(RBAC)。
// 
// 数据库表：roles
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识角色
//   - Name: 角色名称，如"超级管理员"、"内容管理员"等
//   - Type: 角色类型，super_admin表示超级管理员，operator表示普通操作员
//   - Description: 角色描述，说明角色的职责和权限范围
//   - CreatedAt: 角色创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 权限管理
//   - 用户角色分配
//   - 访问控制
type Role struct {
	ID          int64                   `json:"id" db:"id"`           // 主键，自增，唯一标识角色
	Name        string                  `json:"name" db:"name"`       // 角色名称，如"超级管理员"、"内容管理员"等
	Type        valueobjects.RoleType   `json:"type" db:"type"`       // 角色类型，super_admin表示超级管理员，operator表示普通操作员
	Description string                  `json:"description" db:"description"` // 角色描述，说明角色的职责和权限范围
	CreatedAt   time.Time               `json:"created_at" db:"created_at"` // 角色创建时间，UTC时间戳
	UpdatedAt   time.Time               `json:"updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}

// Permission 表示数据库中 permissions 表的权限实体。
// 
// 用途：定义系统中的具体权限点，按资源和操作划分，实现细粒度的权限控制。
// 
// 数据库表：permissions
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识权限
//   - Name: 权限名称，如"create_user"、"delete_project"等
//   - Resource: 资源名称，如"user"、"project"、"order"等
//   - Action: 操作类型，如"create"、"read"、"update"、"delete"等
//   - Description: 权限描述，说明权限的具体作用
//   - CreatedAt: 权限创建时间，UTC时间戳
//   - UpdatedAt: 最后更新时间，UTC时间戳
// 
// 使用场景：
//   - 权限管理
//   - 角色权限分配
//   - 访问控制
type Permission struct {
	ID          int64     `json:"id" db:"id"`           // 主键，自增，唯一标识权限
	Name        string    `json:"name" db:"name"`       // 权限名称，如"create_user"、"delete_project"等
	Resource    string    `json:"resource" db:"resource"` // 资源名称，如"user"、"project"、"order"等
	Action      string    `json:"action" db:"action"`   // 操作类型，如"create"、"read"、"update"、"delete"等
	Description string    `json:"description" db:"description"` // 权限描述，说明权限的具体作用
	CreatedAt   time.Time `json:"created_at" db:"created_at"` // 权限创建时间，UTC时间戳
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间，UTC时间戳
}

// RolePermission 表示数据库中 role_permissions 表的角色权限关系实体。
// 
// 用途：管理角色与权限的多对多关系，实现灵活的权限分配。
// 
// 数据库表：role_permissions
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识角色权限关系
//   - RoleID: 角色ID，外键关联roles表
//   - PermissionID: 权限ID，外键关联permissions表
//   - CreatedAt: 关系创建时间，UTC时间戳
// 
// 使用场景：
//   - 为角色分配权限
//   - 查询角色的所有权限
//   - 权限继承
type RolePermission struct {
	ID           int64     `json:"id" db:"id"`             // 主键，自增，唯一标识角色权限关系
	RoleID       int64     `json:"role_id" db:"role_id"`   // 角色ID，外键关联roles表
	PermissionID int64     `json:"permission_id" db:"permission_id"` // 权限ID，外键关联permissions表
	CreatedAt    time.Time `json:"created_at" db:"created_at"` // 关系创建时间，UTC时间戳
}

// AdminUserRole 表示数据库中 admin_user_roles 表的管理员用户角色关系实体。
// 
// 用途：管理管理员用户与角色的多对多关系，实现灵活的用户角色分配。
// 
// 数据库表：admin_user_roles
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识用户角色关系
//   - AdminUserID: 管理员用户ID，外键关联admin_users表
//   - RoleID: 角色ID，外键关联roles表
//   - CreatedAt: 关系创建时间，UTC时间戳
// 
// 使用场景：
//   - 为用户分配角色
//   - 查询用户的所有角色
//   - 权限继承
type AdminUserRole struct {
	ID         int64     `json:"id" db:"id"`           // 主键，自增，唯一标识用户角色关系
	AdminUserID int64    `json:"admin_user_id" db:"admin_user_id"` // 管理员用户ID，外键关联admin_users表
	RoleID     int64     `json:"role_id" db:"role_id"` // 角色ID，外键关联roles表
	CreatedAt  time.Time `json:"created_at" db:"created_at"` // 关系创建时间，UTC时间戳
}

// AuditLog 表示数据库中 audit_logs 表的审计日志实体。
// 
// 用途：记录系统中的重要操作日志，用于审计和追踪，满足合规要求。
// 
// 数据库表：audit_logs
// 
// 字段说明：
//   - ID: 主键，自增，唯一标识审计日志
//   - ActorType: 操作者类型，如"admin_user"、"user"等
//   - ActorID: 操作者ID，关联到具体的用户或管理员
//   - ResourceType: 资源类型，如"user"、"project"、"order"等
//   - ResourceID: 资源ID，关联到具体的资源
//   - Action: 操作类型，create/update/delete/view
//   - Details: 操作详情，JSON格式存储具体的操作内容
//   - IPAddress: 操作来源IP地址
//   - UserAgent: 操作来源的User-Agent信息
//   - CreatedAt: 操作时间，UTC时间戳
// 
// 使用场景：
//   - 安全审计
//   - 操作追踪
//   - 异常排查
//   - 合规报告
type AuditLog struct {
	ID           int64                      `json:"id" db:"id"`             // 主键，自增，唯一标识审计日志
	ActorType    string                    `json:"actor_type" db:"actor_type"` // 操作者类型，如"admin_user"、"user"等
	ActorID      int64                     `json:"actor_id" db:"actor_id"` // 操作者ID，关联到具体的用户或管理员
	ResourceType string                    `json:"resource_type" db:"resource_type"` // 资源类型，如"user"、"project"、"order"等
	ResourceID   int64                     `json:"resource_id" db:"resource_id"` // 资源ID，关联到具体的资源
	Action       valueobjects.AuditLogAction `json:"action" db:"action"`   // 操作类型，create/update/delete/view
	Details      string                    `json:"details" db:"details"`   // 操作详情，JSON格式存储具体的操作内容
	IPAddress    string                    `json:"ip_address" db:"ip_address"` // 操作来源IP地址
	UserAgent    string                    `json:"user_agent" db:"user_agent"` // 操作来源的User-Agent信息
	CreatedAt    time.Time                 `json:"created_at" db:"created_at"` // 操作时间，UTC时间戳
}