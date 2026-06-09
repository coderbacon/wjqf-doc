/**
 * 图片预览全局 API
 * 通过 provide/inject 模式让任意后代组件调用图片预览功能
 */
import { inject, type InjectionKey } from 'vue'

export interface ImageViewerAPI {
  /** 打开图片预览 */
  open: (src: string, alt?: string) => void
  /** 关闭预览 */
  close: () => void
}

const KEY: InjectionKey<ImageViewerAPI> = Symbol('image-viewer')

/**
 * 注入图片预览 API（需在先辈组件中 provide）
 */
export function useImageViewer(): ImageViewerAPI {
  const api = inject(KEY)
  if (!api) {
    throw new Error('[useImageViewer] 未找到图片预览 API，请确保 Layout 组件已挂载')
  }
  return api
}

export { KEY }
