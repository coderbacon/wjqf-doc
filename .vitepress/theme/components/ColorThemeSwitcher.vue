<script setup lang="ts">
/**
 * 主题色快速切换组件
 * 通过 CSS 变量动态切换品牌色和 Hero 区域配色
 * 选择结果持久化到 localStorage
 */
import { ref, onMounted, watch } from 'vue'

interface ThemePreset {
  key: string
  label: string
  desc: string
  // 标题渐变
  nameGradient: string
  // Logo 背景渐变
  imageBg: string
  // 品牌色
  brand1: string
  brand2: string
  brand3: string
  brandSoft: string
}

const presets: ThemePreset[] = [
  {
    key: 'default',
    label: '默认',
    desc: '原生',
    nameGradient: '120deg, #bd34fe 30%, #41d1ff',
    imageBg: '-45deg, #bd34fe 50%, #47caff 50%',
    brand1: 'var(--vp-c-indigo-1)',
    brand2: 'var(--vp-c-indigo-2)',
    brand3: 'var(--vp-c-indigo-3)',
    brandSoft: 'var(--vp-c-indigo-soft)',
  },
  {
    key: 'business',
    label: '沉稳商务',
    desc: '深蓝 × 亮蓝',
    nameGradient: '120deg, #1e3a5f 30%, #3b82f6',
    imageBg: '-45deg, #1e3a5f 50%, #3b82f6 50%',
    brand1: '#2563eb',
    brand2: '#3b82f6',
    brand3: '#1d4ed8',
    brandSoft: 'rgba(59,130,246,0.14)',
  },
  {
    key: 'gold',
    label: '暗金奢华',
    desc: '深蓝 × 香槟金',
    nameGradient: '120deg, #c9a96e 30%, #e8d5a3',
    imageBg: '-45deg, #1a1a2e 50%, #c9a96e 50%',
    brand1: '#b8942e',
    brand2: '#c9a96e',
    brand3: '#8b6914',
    brandSoft: 'rgba(201,169,110,0.14)',
  },
  {
    key: 'warm',
    label: '暖色经典',
    desc: '棕 × 琥珀金',
    nameGradient: '120deg, #8b4513 30%, #f59e0b',
    imageBg: '-45deg, #8b4513 50%, #f59e0b 50%',
    brand1: '#d97706',
    brand2: '#f59e0b',
    brand3: '#b45309',
    brandSoft: 'rgba(245,158,11,0.14)',
  },
  {
    key: 'mono',
    label: '极简黑白',
    desc: '暗灰 × 中灰',
    nameGradient: '120deg, #1a1a1a 30%, #6b7280',
    imageBg: '-45deg, #2d2d2d 50%, #9ca3af 50%',
    brand1: '#4b5563',
    brand2: '#6b7280',
    brand3: '#374151',
    brandSoft: 'rgba(107,114,128,0.14)',
  },
  {
    key: 'ocean',
    label: '深海碧波',
    desc: '青蓝 × 薄荷绿',
    nameGradient: '120deg, #0d9488 30%, #06b6d4',
    imageBg: '-45deg, #0f766e 50%, #22d3ee 50%',
    brand1: '#0891b2',
    brand2: '#06b6d4',
    brand3: '#0e7490',
    brandSoft: 'rgba(6,182,212,0.14)',
  },
  {
    key: 'rose',
    label: '玫瑰暗红',
    desc: '深红 × 玫红',
    nameGradient: '120deg, #be123c 30%, #f43f5e',
    imageBg: '-45deg, #881337 50%, #fb7185 50%',
    brand1: '#e11d48',
    brand2: '#f43f5e',
    brand3: '#be123c',
    brandSoft: 'rgba(244,63,94,0.14)',
  },
  {
    key: 'forest',
    label: '森林翠绿',
    desc: '墨绿 × 翠绿',
    nameGradient: '120deg, #15803d 30%, #22c55e',
    imageBg: '-45deg, #14532d 50%, #4ade80 50%',
    brand1: '#16a34a',
    brand2: '#22c55e',
    brand3: '#15803d',
    brandSoft: 'rgba(34,197,94,0.14)',
  },
]

const STORAGE_KEY = 'wjqf-color-theme'

const currentKey = ref('default')
const openRef = ref(false)
const previewKey = ref<string | null>(null) // hover 预览

// 应用主题
function applyTheme(key: string) {
  const preset = presets.find(p => p.key === key)
  if (!preset) return

  const root = document.documentElement
  root.style.setProperty('--vp-home-hero-name-background', `-webkit-linear-gradient(${preset.nameGradient})`)
  root.style.setProperty('--vp-home-hero-image-background-image', `linear-gradient(${preset.imageBg})`)
  root.style.setProperty('--vp-c-brand-1', preset.brand1)
  root.style.setProperty('--vp-c-brand-2', preset.brand2)
  root.style.setProperty('--vp-c-brand-3', preset.brand3)
  root.style.setProperty('--vp-c-brand-soft', preset.brandSoft)

  currentKey.value = key
  localStorage.setItem(STORAGE_KEY, key)
}

// 预览主题（hover）
function preview(key: string) {
  applyTheme(key)
  previewKey.value = key
}

function cancelPreview() {
  previewKey.value = null
  applyTheme(currentKey.value)
}

function select(key: string) {
  applyTheme(key)
  previewKey.value = null
  openRef.value = false
}

// 初始化：从 localStorage 恢复，首次访问用默认配色
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const key = (saved && presets.some(p => p.key === saved)) ? saved : 'default'
  applyTheme(key)
})

// 点击外部关闭
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.color-switcher')) {
    openRef.value = false
    if (previewKey.value) {
      cancelPreview()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="color-switcher">
    <button
      class="color-switcher__btn"
      title="切换主题色"
      @click.stop="openRef = !openRef"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
      </svg>
      <span class="color-switcher__label">配色</span>
    </button>

    <!-- 下拉面板 -->
    <Transition name="cs-fade">
      <div v-if="openRef" class="color-switcher__panel" @click.stop>
        <div class="color-switcher__title">选择主题配色</div>
        <div class="color-switcher__grid">
          <button
            v-for="preset in presets"
            :key="preset.key"
            class="color-switcher__item"
            :class="{
              'is-active': currentKey === preset.key,
              'is-preview': previewKey === preset.key && previewKey !== currentKey,
            }"
            @click="select(preset.key)"
            @mouseenter="preview(preset.key)"
            @mouseleave="cancelPreview"
          >
            <span
              class="color-switcher__dot"
              :style="{ background: `linear-gradient(135deg, ${preset.brand3}, ${preset.brand1})` }"
            ></span>
            <span class="color-switcher__name">{{ preset.label }}</span>
            <span class="color-switcher__desc">{{ preset.desc }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.color-switcher {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 8px;
  padding-left: 16px;
}

/* 左侧分隔条 */
.color-switcher::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 24px;
  background: var(--vp-c-divider);
}

.color-switcher__btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 13px;
  transition: color 0.2s, background 0.2s;
}
.color-switcher__btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.color-switcher__label {
  display: none;
}
@media (min-width: 768px) {
  .color-switcher__label {
    display: inline;
  }
}

.color-switcher__panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-3);
  padding: 16px;
  z-index: 100;
}

.color-switcher__title {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
}

.color-switcher__grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.color-switcher__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.color-switcher__item:hover,
.color-switcher__item.is-preview {
  background: var(--vp-c-bg-soft);
}
.color-switcher__item.is-active {
  background: var(--vp-c-brand-soft);
}

.color-switcher__dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid transparent;
}
.color-switcher__item.is-active .color-switcher__dot {
  border-color: var(--vp-c-text-1);
}

.color-switcher__name {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  flex-shrink: 0;
}

.color-switcher__desc {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-left: auto;
}

/* 过渡动画 */
.cs-fade-enter-active,
.cs-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.cs-fade-enter-from,
.cs-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
