/**
 * Medagil 前后端共享 API 类型（与 api-service / ai-service 约定一致）
 * MVP 阶段可按需补充 DTO、枚举等
 */

export type SubscriptionPlan = "free" | "pro" | "max";

export interface UserProfile {
  id: string;
  email?: string;
  nickname?: string;
  avatar?: string;
  plan: SubscriptionPlan;
  credits?: number;
}
