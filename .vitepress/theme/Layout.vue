<!--
  VitePress 自定义布局
  包装默认布局，提供：
  1. 图片预览功能（ImagePreview 全局挂载）
  2. Markdown 图片自动增强（点击放大）
-->
<template>
  <DefaultTheme.Layout />
  <ImagePreview ref="previewRef" />
  <!-- 返回顶部浮动按钮 -->
  <BackToTop />
  <!-- 主题色切换按钮：注入到导航栏控件区域 -->
  <Teleport to=".VPNavBarAppearance">
    <ColorThemeSwitcher />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, provide } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ImagePreview from './components/ImagePreview.vue'
import ColorThemeSwitcher from './components/ColorThemeSwitcher.vue'
import BackToTop from './components/BackToTop.vue'
import { KEY, type ImageViewerAPI } from './composables/useImageViewer'

const { isDark } = useData()
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
function bindImage(img: HTMLImageElement) {
  if (boundImages.has(img)) return
  if (isInsideLink(img)) return
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
}

function bindImages(container: HTMLElement) {
  const images = container.querySelectorAll<HTMLImageElement>(
    '.vp-doc img, .content-container img, main img, article img'
  )
  images.forEach((img) => {
    // 图片已加载完成：直接绑定
    if (img.complete && img.naturalWidth > 0) {
      bindImage(img)
    } else {
      // 图片尚未加载：监听 load 事件，加载后再绑定
      img.addEventListener('load', () => bindImage(img), { once: true })
    }
  })
}

let observer: MutationObserver | null = null
let vtObserver: MutationObserver | null = null

/**
 * 圆形扩散/收缩主题切换（Vben 风格）
 * - 深色 → 明亮：新主题从点击处圆形扩张
 * - 明亮 → 深色：旧主题向点击处圆形收缩
 */
function handleThemeToggle(e: MouseEvent) {
  // 阻止 VitePress 原生的主题切换（捕获阶段优先）
  e.stopImmediatePropagation()
  e.preventDefault()

  const x = e.clientX
  const y = e.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  const html = document.documentElement
  html.style.setProperty('--vt-x', `${x}px`)
  html.style.setProperty('--vt-y', `${y}px`)
  html.style.setProperty('--vt-r', `${endRadius}px`)

  // 根据当前主题决定动画方向
  if (isDark.value) {
    // 深色 → 明亮：仅新主题（亮色）在上层扩张
    html.style.setProperty('--vt-z-old', '1')
    html.style.setProperty('--vt-z-new', '9999')
    html.style.setProperty('--vt-anim-old', 'none')
    html.style.setProperty('--vt-anim-new', 'vt-expand')
  } else {
    // 明亮 → 深色：仅旧主题（亮色）在上层收缩
    html.style.setProperty('--vt-z-old', '9999')
    html.style.setProperty('--vt-z-new', '1')
    html.style.setProperty('--vt-anim-old', 'vt-shrink')
    html.style.setProperty('--vt-anim-new', 'none')
  }

  // View Transition API（Chrome 111+）
  if (document.startViewTransition) {
    html.classList.add('vt-running')
    const vt = document.startViewTransition(() => {
      isDark.value = !isDark.value
    })
    vt.finished.then(() => {
      html.classList.remove('vt-running')
    })
  } else {
    // 降级：直接切换
    isDark.value = !isDark.value
  }
}

/**
 * 为桌面端和移动端的主题切换按钮绑定捕获阶段事件
 * 使用 MutationObserver 确保 Vue 渲染后仍能正确绑定
 */
function hookThemeButtons() {
  document.querySelectorAll('button.VPSwitchAppearance').forEach((btn) => {
    if ((btn as any).__vtHooked) return
    ;(btn as any).__vtHooked = true
    // capture: true 确保优先于 VitePress 的 bubble 阶段 click
    btn.addEventListener('click', handleThemeToggle, { capture: true })
  })
}

onMounted(() => {
  // 初次绑定主题按钮（可能尚未渲染）
  hookThemeButtons()

  // 使用 MutationObserver 监听后续渲染（移动端菜单、SPA 路由切换等）
  vtObserver = new MutationObserver(() => {
    hookThemeButtons()
  })
  vtObserver.observe(document.body, { childList: true, subtree: true })

  // 启用明暗主题切换过渡动画（延后一帧，避免页面首次渲染闪烁）
  requestAnimationFrame(() => {
    document.documentElement.classList.add('theme-transition-ready')
  })

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
  vtObserver?.disconnect()
  observer?.disconnect()
})
</script>
