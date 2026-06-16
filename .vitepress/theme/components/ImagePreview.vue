<template>
  <Teleport to="body">
    <Transition name="ip-fade">
      <div
        v-if="visibleRef"
        class="ip-overlay"
        @click.self="handleClose"
        @wheel.prevent="handleWheel"
      >
        <!-- 工具栏 -->
        <div class="ip-toolbar">
          <div class="ip-toolbar__left">
            <span class="ip-toolbar__scale">{{ Math.round(scaleRef * 100) }}%</span>
          </div>
          <div class="ip-toolbar__actions">
            <button
              class="ip-btn"
              title="放大"
              :disabled="scaleRef >= maxScale"
              @click="zoomIn"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6M8 11h6" />
              </svg>
            </button>
            <button
              class="ip-btn"
              title="缩小"
              :disabled="scaleRef <= minScale"
              @click="zoomOut"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M8 11h6" />
              </svg>
            </button>
            <button
              class="ip-btn"
              title="向左旋转 90°"
              @click="rotateLeft"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10" />
                <polyline points="12 6 8 10 12 14" />
              </svg>
            </button>
            <button
              class="ip-btn"
              title="向右旋转 90°"
              @click="rotateRight"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10" />
                <polyline points="12 18 16 14 12 10" />
              </svg>
            </button>
            <button
              class="ip-btn"
              title="重置"
              @click="reset"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
            <button
              class="ip-btn ip-btn--close"
              title="关闭 (ESC)"
              @click="handleClose"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 图片容器 -->
        <div
          class="ip-stage"
          @click.self="handleClose"
          @mousedown="handleDragStart"
          @mousemove="handleDragMove"
          @mouseup="handleDragEnd"
          @mouseleave="handleDragEnd"
          @touchstart.prevent="handleTouchStart"
          @touchmove.prevent="handleTouchMove"
          @touchend="handleDragEnd"
          @dblclick="handleDoubleClick"
        >
          <img
            ref="imgRef"
            :src="srcRef"
            :alt="altRef"
            class="ip-image"
            :class="{ 'ip-image--dragging': isDraggingRef }"
            :style="imgStyle"
            draggable="false"
            @load="handleImageLoad"
          />
        </div>

        <!-- 页脚提示 -->
        <div class="ip-footer">
          <span>{{ altRef || srcRef }}</span>
          <span class="ip-footer__tips">滚轮缩放 · 拖拽移动 · ESC 关闭</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ==================== Props / State ====================
const srcRef = ref('')
const altRef = ref('')
const visibleRef = ref(false)

const scaleRef = ref(1)
const rotationRef = ref(0)
const translateXRef = ref(0)
const translateYRef = ref(0)
const isDraggingRef = ref(false)

const imgRef = ref<HTMLImageElement | null>(null)
const imgNaturalSize = ref({ width: 0, height: 0 })

const dragStart = { x: 0, y: 0 }
const translateStart = { x: 0, y: 0 }

// 触摸双指缩放
let touchStartDistance = 0
let touchStartScale = 1

const minScale = 0.1
const maxScale = 10
const zoomStep = 0.25

// ==================== 对外暴露的方法 ====================
function open(src: string, alt?: string) {
  srcRef.value = src
  altRef.value = alt || ''
  visibleRef.value = true
  // 阻止 body 滚动
  document.body.style.overflow = 'hidden'
}

function close() {
  visibleRef.value = false
  document.body.style.overflow = ''
  reset()
}

// 供外部调用（template ref）
defineExpose({ open, close })

// ==================== 图片样式 ====================
const imgStyle = computed(() => ({
  transform: `translate(${translateXRef.value}px, ${translateYRef.value}px) scale(${scaleRef.value}) rotate(${rotationRef.value}deg)`,
  cursor: isDraggingRef.value ? 'grabbing' : scaleRef.value > 1 ? 'grab' : 'default',
  transition: isDraggingRef.value ? 'none' : 'transform 0.3s ease',
}))

// ==================== 缩放操作 ====================
function zoomIn() {
  setScale(Math.min(scaleRef.value + zoomStep, maxScale))
}

function zoomOut() {
  setScale(Math.max(scaleRef.value - zoomStep, minScale))
}

function setScale(newScale: number) {
  scaleRef.value = Math.min(Math.max(newScale, minScale), maxScale)
}

function handleWheel(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -zoomStep : zoomStep
  setScale(scaleRef.value + delta)
}

function handleDoubleClick() {
  if (scaleRef.value > 1) {
    reset()
  } else {
    setScale(2)
  }
}

// ==================== 旋转操作 ====================
function rotateLeft() {
  rotationRef.value = (rotationRef.value - 90 + 360) % 360
}

function rotateRight() {
  rotationRef.value = (rotationRef.value + 90) % 360
}

// ==================== 拖拽操作 ====================
function handleDragStart(e: MouseEvent) {
  if (e.button !== 0) return
  isDraggingRef.value = true
  dragStart.x = e.clientX
  dragStart.y = e.clientY
  translateStart.x = translateXRef.value
  translateStart.y = translateYRef.value
}

function handleDragMove(e: MouseEvent) {
  if (!isDraggingRef.value) return
  translateXRef.value = translateStart.x + (e.clientX - dragStart.x)
  translateYRef.value = translateStart.y + (e.clientY - dragStart.y)
}

function handleDragEnd() {
  isDraggingRef.value = false
}

// 触摸支持
function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 2) {
    // 双指缩放
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    touchStartDistance = Math.sqrt(dx * dx + dy * dy)
    touchStartScale = scaleRef.value
  } else if (e.touches.length === 1) {
    isDraggingRef.value = true
    dragStart.x = e.touches[0].clientX
    dragStart.y = e.touches[0].clientY
    translateStart.x = translateXRef.value
    translateStart.y = translateYRef.value
  }
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (touchStartDistance > 0) {
      setScale(touchStartScale * (distance / touchStartDistance))
    }
  } else if (e.touches.length === 1 && isDraggingRef.value) {
    translateXRef.value = translateStart.x + (e.touches[0].clientX - dragStart.x)
    translateYRef.value = translateStart.y + (e.touches[0].clientY - dragStart.y)
  }
}

// ==================== 重置 ====================
function reset() {
  scaleRef.value = 1
  rotationRef.value = 0
  translateXRef.value = 0
  translateYRef.value = 0
}

// ==================== 关闭 ====================
function handleClose() {
  close()
}

function handleImageLoad() {
  if (imgRef.value) {
    imgNaturalSize.value = {
      width: imgRef.value.naturalWidth,
      height: imgRef.value.naturalHeight,
    }
  }
}

// ==================== 键盘操作 ====================
function handleKeydown(e: KeyboardEvent) {
  if (!visibleRef.value) return

  switch (e.key) {
    case 'Escape':
      close()
      break
    case '+':
    case '=':
      zoomIn()
      break
    case '-':
      zoomOut()
      break
    case '0':
      reset()
      break
    case 'r':
    case 'R':
      rotateRight()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ==================== 遮罩层 ==================== */
.ip-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
}

/* ==================== 过渡动画 ==================== */
.ip-fade-enter-active,
.ip-fade-leave-active {
  transition: opacity 0.25s ease;
}
.ip-fade-enter-from,
.ip-fade-leave-to {
  opacity: 0;
}

/* ==================== 工具栏 ==================== */
.ip-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
}

.ip-toolbar__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ip-toolbar__scale {
  color: #fff;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  min-width: 48px;
  text-align: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  padding: 4px 8px;
  backdrop-filter: blur(8px);
}

.ip-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ip-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
  backdrop-filter: blur(8px);
}

.ip-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.ip-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.ip-btn:disabled:hover {
  background: rgba(255, 255, 255, 0.1);
}

.ip-btn--close {
  margin-left: 8px;
}

.ip-btn--close:hover {
  background: rgba(255, 80, 80, 0.5);
}

/* ==================== 图片舞台 ==================== */
.ip-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: default;
}

.ip-image {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  transform-origin: center center;
  will-change: transform;
}

.ip-image--dragging {
  transition: none !important;
}

/* ==================== 页脚 ==================== */
.ip-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
}

.ip-footer__tips {
  opacity: 0.7;
  font-size: 12px;
}

/* ==================== 移动端适配 ==================== */
@media (max-width: 640px) {
  .ip-toolbar {
    padding: 8px 12px;
  }

  .ip-btn {
    width: 32px;
    height: 32px;
  }

  .ip-footer {
    gap: 12px;
    font-size: 12px;
  }

  .ip-footer__tips {
    display: none;
  }

  .ip-image {
    max-width: 95vw;
    max-height: 80vh;
  }
}
</style>
