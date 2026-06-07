/**
 * i18n 翻译组合式函数
 * 提供基于 VitePress 官方 locale 的翻译文本引用机制：
 * - 根据 VitePress 当前语言自动切换翻译
 * - 在 Vue 组件和 .md 文件中直接使用
 */

import { computed } from 'vue'
import { useData } from 'vitepress'
import { zh } from './zh'
import { en } from './en'

// ==================== 类型定义 ====================

export type Locale = 'zh' | 'en'

const messages: Record<Locale, typeof zh> = { zh, en }

/** 从翻译文件中推导出的扁平化键路径类型 */
type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? `${K}.${NestedKeyOf<T[K]>}`
    : K
}[keyof T & string]

export type I18nKey = NestedKeyOf<typeof zh>

// ==================== 工具函数 ====================

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return path
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === 'string' ? current : path
}

// ==================== 组合式函数 ====================

/**
 * 使用 i18n 翻译
 * 自动根据 VitePress 当前页面语言返回对应翻译
 *
 * @example
 * ```ts
 * const { t, locale, isZh, isEn } = useI18n()
 * t('common.confirm')  // '确认' | 'Confirm'
 * ```
 */
export function useI18n() {
  const { lang } = useData()

  /** 根据 VitePress lang 推导当前 locale */
  const locale = computed<Locale>(() => {
    const langVal = lang.value
    if (langVal === 'en-US' || langVal === 'en') return 'en'
    return 'zh'
  })

  const isZh = computed(() => locale.value === 'zh')
  const isEn = computed(() => locale.value === 'en')

  /** 翻译函数 */
  function t(key: I18nKey | string, fallback?: string): string {
    const msg = messages[locale.value]
    const result = getNestedValue(msg as unknown as Record<string, unknown>, key)
    if (result === key && fallback !== undefined) return fallback
    return result
  }

  return { t, locale, isZh, isEn }
}

export { zh, en }
export default useI18n
