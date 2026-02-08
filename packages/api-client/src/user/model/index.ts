/** 用户端 API 模型（由 Orval 生成） */
export type UserProfile = { id: string; email?: string; nickname?: string; avatar?: string; plan: 'free' | 'pro' | 'max'; credits?: number };
export type ProjectSummary = { id: string; name: string; createdAt: string };
export type ProjectListResponse = { items: ProjectSummary[]; total: number };
