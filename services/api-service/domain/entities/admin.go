// Package entities 包含 Medagil API 服务的领域实体。
// 这些实体表示核心业务对象，直接映射到数据库表。
package entities

import (
	"time"

	"github.com/medagil/api-service/domain/value_objects"
)

// AdminUser 表示数据库中 admin_users 表的管理员用户实体。
// 管理端用户，用于系统管理和运营。
type AdminUser struct {
	ID        int64                        `json:"id" db:"id"`         // 主键，自增
	Username  string                      `json:"username" db:"username"` // 用户名
	Password  string                      `json:"password" db:"password"` // 密码哈希
	Status    valueobjects.AdminUserStatus `json:"status" db:"status"`  // 管理员状态（激活、未激活）
	CreatedAt time.Time                   `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt time.Time                   `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}

// Role 表示数据库中 roles 表的角色实体。
// 定义管理员的角色类型和权限集合。
type Role struct {
	ID          int64                   `json:"id" db:"id"`           // 主键，自增
	Name        string                  `json:"name" db:"name"`       // 角色名称
	Type        valueobjects.RoleType   `json:"type" db:"type"`       // 角色类型（超级管理员、操作员）
	Description string                  `json:"description" db:"description"` // 角色描述
	CreatedAt   time.Time               `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt   time.Time               `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}

// Permission 表示数据库中 permissions 表的权限实体。
// 定义系统中的具体权限点，按资源和操作划分。
type Permission struct {
	ID          int64     `json:"id" db:"id"`           // 主键，自增
	Name        string    `json:"name" db:"name"`       // 权限名称
	Resource    string    `json:"resource" db:"resource"` // 资源名称
	Action      string    `json:"action" db:"action"`   // 操作类型
	Description string    `json:"description" db:"description"` // 权限描述
	CreatedAt   time.Time `json:"created_at" db:"created_at"` // 创建时间戳
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"` // 最后更新时间戳
}

// RolePermission 表示数据库中 role_permissions 表的角色权限关系实体。
// 管理角色与权限的多对多关系。
type RolePermission struct {
	ID           int64     `json:"id" db:"id"`             // 主键，自增
	RoleID       int64     `json:"role_id" db:"role_id"`   // 角色 ID
	PermissionID int64     `json:"permission_id" db:"permission_id"` // 权限 ID
	CreatedAt    time.Time `json:"created_at" db:"created_at"` // 创建时间戳
}

// AdminUserRole 表示数据库中 admin_user_roles 表的管理员用户角色关系实体。
// 管理管理员用户与角色的多对多关系。
type AdminUserRole struct {
	ID         int64     `json:"id" db:"id"`           // 主键，自增
	AdminUserID int64    `json:"admin_user_id" db:"admin_user_id"` // 管理员用户 ID
	RoleID     int64     `json:"role_id" db:"role_id"` // 角色 ID
	CreatedAt  time.Time `json:"created_at" db:"created_at"` // 创建时间戳
}

// AuditLog 表示数据库中 audit_logs 表的审计日志实体。
// 记录系统中的重要操作日志，用于审计和追踪。
type AuditLog struct {
	ID           int64                      `json:"id" db:"id"`             // 主键，自增
	ActorType    string                    `json:"actor_type" db:"actor_type"` // 操作者类型
	ActorID      int64                     `json:"actor_id" db:"actor_id"` // 操作者 ID
	ResourceType string                    `json:"resource_type" db:"resource_type"` // 资源类型
	ResourceID   int64                     `json:"resource_id" db:"resource_id"` // 资源 ID
	Action       valueobjects.AuditLogAction `json:"action" db:"action"`   // 操作类型（创建、更新、删除、查看）
	Details      string                    `json:"details" db:"details"`   // 操作详情
	IPAddress    string                    `json:"ip_address" db:"ip_address"` // IP 地址
	UserAgent    string                    `json:"user_agent" db:"user_agent"` // 用户代理
	CreatedAt    time.Time                 `json:"created_at" db:"created_at"` // 创建时间戳
}