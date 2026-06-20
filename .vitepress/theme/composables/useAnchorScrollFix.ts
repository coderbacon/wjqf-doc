/**
 * 锚点滚动修正 —— 解决 VitePress 2.0 alpha 跨页面锚点跳转失效问题
 *
 * 问题根因：VitePress 的 scrollTo() 在 nextTick 中执行，此时页面图片尚未加载完成，
 * 导致 getBoundingClientRect().top 计算不准确，滚动到错误位置。
 *
 * 修复策略：监听 hash 变化，延迟 300ms（等待图片加载）后重新执行精确滚动。
 */
import { watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vitepress";

export function useAnchorScrollFix() {
  const route = useRoute();
  const router = useRouter();

  let scrollTimer: ReturnType<typeof setTimeout> | null = null;

  function doScroll(hash: string) {
    if (!hash || hash === "#") return;
    try {
      const id = decodeURIComponent(hash).slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      const navBar = document.querySelector(".VPNavBar") as HTMLElement | null;
      const offset = navBar ? navBar.getBoundingClientRect().height : 64;
      const top =
        window.scrollY + target.getBoundingClientRect().top - offset - 24;

      window.scrollTo({ top, behavior: "smooth" });
    } catch {
      // 忽略解码错误
    }
  }

  // 监听 hash 变化，延迟执行以等待图片加载
  watch(
    () => route.hash,
    (hash) => {
      if (scrollTimer) clearTimeout(scrollTimer);
      if (!hash) return;

      // 第一次尝试：nextTick 后立即滚动
      nextTick(() => doScroll(hash));

      // 第二次尝试：延迟 300ms 等待图片加载后再滚动
      scrollTimer = setTimeout(() => doScroll(hash), 300);

      // 第三次尝试：延迟 800ms 作为兜底
      scrollTimer = setTimeout(() => doScroll(hash), 800);
    },
    { immediate: true },
  );

  // 页面首次加载时也处理
  onMounted(() => {
    if (route.hash) {
      nextTick(() => doScroll(route.hash));
      setTimeout(() => doScroll(route.hash), 500);
      setTimeout(() => doScroll(route.hash), 1000);
    }
  });

  onUnmounted(() => {
    if (scrollTimer) clearTimeout(scrollTimer);
  });
}
