/**
 * 共享常量定义
 */

/**
 * 订阅级别
 */
export enum SUBSCRIPTION_LEVEL {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

/**
 * 订阅级别名称
 */
export const SUBSCRIPTION_LEVEL_NAMES: Record<SUBSCRIPTION_LEVEL, string> = {
  [SUBSCRIPTION_LEVEL.FREE]: '免费版',
  [SUBSCRIPTION_LEVEL.BASIC]: '基础版',
  [SUBSCRIPTION_LEVEL.PRO]: '专业版',
  [SUBSCRIPTION_LEVEL.ENTERPRISE]: '企业版'
}

/**
 * 支付状态
 */
export enum PAYMENT_STATUS {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

/**
 * 支付状态名称
 */
export const PAYMENT_STATUS_NAMES: Record<PAYMENT_STATUS, string> = {
  [PAYMENT_STATUS.PENDING]: '待支付',
  [PAYMENT_STATUS.SUCCESS]: '支付成功',
  [PAYMENT_STATUS.FAILED]: '支付失败',
  [PAYMENT_STATUS.REFUNDED]: '已退款'
}
