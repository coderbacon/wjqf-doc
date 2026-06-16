<!--
  返回顶部浮动按钮
  在页面滚动超过 300px 后出现在右下角，点击平滑滚动回顶部
-->
<template>
  <Transition name="back-to-top-fade">
    <button
      v-show="visible"
      class="VPLocalNavBackToTop"
      :aria-label="label"
      :title="label"
      @click="scrollToTop"
    >
      <span class="vpi-arrow-up icon" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()
const visible = ref(false)

/** 按钮的无障碍标签，优先读取主题配置 */
const label = theme.value.returnToTopLabel || '返回顶部'

function onScroll() {
  visible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  // 初始检查（页面可能已经处于滚动状态，如刷新后）
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.VPLocalNavBackToTop {
  position: fixed;
  bottom: 2rem;
  right: 1.5rem;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: color 0.25s, background-color 0.25s, border-color 0.25s, box-shadow 0.25s;
}

.VPLocalNavBackToTop:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.VPLocalNavBackToTop:active {
  transform: scale(0.95);
}

.icon {
  display: block;
  font-size: 18px;
}

/* ========== 淡入淡出过渡动画 ========== */
.back-to-top-fade-enter-active,
.back-to-top-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.back-to-top-fade-enter-from,
.back-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
