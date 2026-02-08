/** 管理端 API 模型（由 Orval 生成） */
export type UserProfile = { id: string; email?: string; nickname?: string; avatar?: string; plan: 'free' | 'pro' | 'max'; credits?: number };
export type DashboardStats = { totalUsers: number; totalOrders: number; mrr: number };
