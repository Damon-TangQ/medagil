/**
 * 共享工具函数和常量
 */

/**
 * 格式化日期
 * @param date 日期字符串或时间戳
 * @param format 格式化模板，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | number | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 本地存储工具
 */
export const storage = {
  /**
   * 获取本地存储的值
   * @param key 存储键
   * @returns 存储的值
   */
  get<T = any>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  /**
   * 设置本地存储的值
   * @param key 存储键
   * @param value 存储的值
   */
  set<T = any>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to set storage:', error)
    }
  },

  /**
   * 删除本地存储的值
   * @param key 存储键
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove storage:', error)
    }
  },

  /**
   * 清空本地存储
   */
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  }
}
