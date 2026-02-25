// Package valueobjects 包含域中使用的值对象和枚举。
// 这些是不可变的对象，表示没有身份的概念。
package valueobjects

// UserStatus 表示用户账户的状态
type UserStatus string

const (
	UserStatusActive   UserStatus = "active"   // 用户账户激活，可以使用系统
	UserStatusInactive UserStatus = "inactive" // 用户账户未激活，暂时禁用
	UserStatusBanned   UserStatus = "banned"   // 用户账户被封禁，无法访问系统
)

// AuthProvider 表示用于登录的认证提供商
type AuthProvider string

const (
	AuthProviderWechat AuthProvider = "wechat" // 微信认证
	AuthProviderPhone  AuthProvider = "phone"  // 手机号认证
	AuthProviderEmail  AuthProvider = "email"  // 邮箱认证
)

// AdminUserStatus 表示管理员用户账户的状态
type AdminUserStatus string

const (
	AdminUserStatusActive   AdminUserStatus = "active"   // 管理员账户激活
	AdminUserStatusInactive AdminUserStatus = "inactive" // 管理员账户未激活
)

// RoleType 表示管理员用户的角色类型
type RoleType string

const (
	RoleTypeSuperAdmin RoleType = "super_admin" // 超级管理员，具有完全访问权限
	RoleTypeOperator  RoleType = "operator"    // 操作员，具有有限的管理访问权限
)

// SubscriptionPlanType 表示订阅计划的类型
type SubscriptionPlanType string

const (
	SubscriptionPlanTypeFree SubscriptionPlanType = "free" // 免费计划
	SubscriptionPlanTypePro  SubscriptionPlanType = "pro"  // 专业计划
	SubscriptionPlanTypeMax  SubscriptionPlanType = "max"  // 最大计划
)

// SubscriptionStatus 表示订阅的状态
type SubscriptionStatus string

const (
	SubscriptionStatusActive    SubscriptionStatus = "active"    // 订阅激活
	SubscriptionStatusExpired   SubscriptionStatus = "expired"   // 订阅已过期
	SubscriptionStatusCancelled SubscriptionStatus = "cancelled" // 订阅已取消
)

// OrderStatus 表示订单的状态
type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"   // 订单待支付
	OrderStatusPaid      OrderStatus = "paid"      // 订单已支付
	OrderStatusCancelled OrderStatus = "cancelled" // 订单已取消
	OrderStatusRefunded  OrderStatus = "refunded"  // 订单已退款
)

// PaymentStatus 表示支付交易的状态
type PaymentStatus string

const (
	PaymentStatusPending PaymentStatus = "pending" // 支付待处理
	PaymentStatusSuccess PaymentStatus = "success" // 支付成功
	PaymentStatusFailed  PaymentStatus = "failed"  // 支付失败
)

// ProjectStatus 表示项目的状态
type ProjectStatus string

const (
	ProjectStatusActive   ProjectStatus = "active"   // 项目激活
	ProjectStatusArchived ProjectStatus = "archived" // 项目已归档
)

// AchievementStatus 表示成果的状态
type AchievementStatus string

const (
	AchievementStatusDraft     AchievementStatus = "draft"     // 成果草稿
	AchievementStatusPublished AchievementStatus = "published" // 成果已发布
	AchievementStatusArchived  AchievementStatus = "archived"  // 成果已归档
)

// TaskStatus 表示任务的状态
type TaskStatus string

const (
	TaskStatusPending   TaskStatus = "pending"   // 任务待处理
	TaskStatusRunning   TaskStatus = "running"   // 任务运行中
	TaskStatusCompleted TaskStatus = "completed" // 任务已完成
	TaskStatusFailed    TaskStatus = "failed"    // 任务失败
)

// KnowledgeBaseVisibility 表示知识库的可见性
type KnowledgeBaseVisibility string

const (
	KnowledgeBaseVisibilityPrivate KnowledgeBaseVisibility = "private" // 私有知识库
	KnowledgeBaseVisibilityPublic  KnowledgeBaseVisibility = "public"  // 公共知识库
)

// SkillStatus 表示技能的状态
type SkillStatus string

const (
	SkillStatusDraft     SkillStatus = "draft"     // 技能草稿
	SkillStatusPublished SkillStatus = "published" // 技能已发布
	SkillStatusArchived  SkillStatus = "archived"  // 技能已归档
)

// AnnouncementStatus 表示公告的状态
type AnnouncementStatus string

const (
	AnnouncementStatusDraft     AnnouncementStatus = "draft"     // 公告草稿
	AnnouncementStatusPublished AnnouncementStatus = "published" // 公告已发布
)

// FeedbackStatus 表示反馈的状态
type FeedbackStatus string

const (
	FeedbackStatusOpen       FeedbackStatus = "open"         // 反馈开放
	FeedbackStatusInProgress FeedbackStatus = "in_progress" // 反馈处理中
	FeedbackStatusResolved   FeedbackStatus = "resolved"    // 反馈已解决
	FeedbackStatusClosed     FeedbackStatus = "closed"      // 反馈已关闭
)

// AuditLogAction 表示审计日志中执行的操作
type AuditLogAction string

const (
	AuditLogActionCreate AuditLogAction = "create" // 创建操作
	AuditLogActionUpdate AuditLogAction = "update" // 更新操作
	AuditLogActionDelete AuditLogAction = "delete" // 删除操作
	AuditLogActionView   AuditLogAction = "view"   // 查看操作
)