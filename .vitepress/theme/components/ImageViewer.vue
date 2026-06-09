<!--
  内联图片组件，点击可打开全屏预览
  在 Markdown 中使用：<ImageViewer src="url" alt="描述" />
-->
<template>
  <span class="iv-wrapper" @click.stop="handleClick">
    <img
      :src="src"
      :alt="alt"
      class="iv-image"
      :style="{ cursor: 'zoom-in' }"
      loading="lazy"
    />
  </span>
</template>

<script setup lang="ts">
import { useImageViewer } from '../composables/useImageViewer'

const props = defineProps<{
  src: string
  alt?: string
}>()

const viewer = useImageViewer()

function handleClick() {
  viewer.open(props.src, props.alt)
}
</script>

<style scoped>
.iv-wrapper {
  display: inline-block;
  max-width: 100%;
}

.iv-image {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  transition: opacity 0.2s;
}

.iv-image:hover {
  opacity: 0.85;
}
</style>
