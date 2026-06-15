<!--
  VitePress 自定义布局
  包装默认布局，提供：
  1. 图片预览功能（ImagePreview 全局挂载）
  2. Markdown 图片自动增强（点击放大）
-->
<template>
  <DefaultTheme.Layout />
  <ImagePreview ref="previewRef" />
  <!-- 主题色切换按钮：注入到导航栏控件区域 -->
  <Teleport to=".VPNavBarAppearance">
    <ColorThemeSwitcher />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, provide } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ImagePreview from './components/ImagePreview.vue'
import ColorThemeSwitcher from './components/ColorThemeSwitcher.vue'
import { KEY, type ImageViewerAPI } from './composables/useImageViewer'

const previewRef = ref<InstanceType<typeof ImagePreview> | null>(null)

// 通过 provide 暴露图片预览 API，后代组件（ImageViewer 等）可通过 useImageViewer() 调用
provide<ImageViewerAPI>(KEY, {
  open(src: string, alt?: string) {
    previewRef.value?.open(src, alt)
  },
  close() {
    previewRef.value?.close()
  },
})

// 已绑定的图片集合（避免重复绑定）
const boundImages = new WeakSet<HTMLImageElement>()

/**
 * 判断图片是否已有链接包裹
 */
function isInsideLink(img: HTMLImageElement): boolean {
  let parent = img.parentElement
  while (parent) {
    if (parent.tagName === 'A') return true
    if (parent.classList.contains('vp-doc') || parent.tagName === 'MAIN') break
    parent = parent.parentElement
  }
  return false
}

/**
 * 为文档中的图片绑定点击预览事件
 */
function bindImages(container: HTMLElement) {
  const images = container.querySelectorAll<HTMLImageElement>(
    '.vp-doc img, .content-container img, main img, article img'
  )
  images.forEach((img) => {
    if (boundImages.has(img)) return
    if (isInsideLink(img)) return
    if (img.naturalWidth < 20 || img.naturalHeight < 20) return
    if (img.src.startsWith('data:')) return
    if (img.classList.contains('no-preview')) return

    boundImages.add(img)

    img.style.cursor = 'zoom-in'
    img.title = img.title || '点击查看大图'

    img.addEventListener('click', () => {
      const src = img.getAttribute('src') || img.currentSrc
      const alt = img.getAttribute('alt') || ''
      if (src && previewRef.value) {
        previewRef.value.open(src, alt)
      }
    })
  })
}

let observer: MutationObserver | null = null

onMounted(() => {
  nextTick(() => {
    bindImages(document.body)
  })

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          bindImages(node)
        }
      })
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>
