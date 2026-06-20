<script setup lang="ts">
/**
 * 密码保护组件
 * 失效条件：关闭标签页
 *
 * 用法：在 .md 文件中包裹需要保护的内容
 * ---
 * password: <SHA-256 哈希>
 * ---
 * <PasswordProtected>内容</PasswordProtected>
 */
import { ref } from 'vue'
import { useData } from 'vitepress'
import { sha256 } from '../utils/sha256'

const SESSION_KEY = 'doc-pass-unlocked'

const { frontmatter } = useData()

const passwordRef = ref('')
const errorRef = ref(false)
const unlockedRef = ref(false)

// 检查 sessionStorage 中是否已解锁
if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
  unlockedRef.value = true
}

/**
 * 计算 SHA-256 哈希
 * 优先使用 crypto.subtle（HTTPS / localhost），HTTP 环境降级为纯 JS 实现
 */
async function hashPassword(input: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }
  // HTTP 环境降级：纯 JavaScript SHA-256
  return sha256(input)
}

async function verifyPassword(input: string) {
  try {
    const hashHex = await hashPassword(input)

    if (hashHex === frontmatter.value.password) {
      unlockedRef.value = true
      sessionStorage.setItem(SESSION_KEY, '1')
      errorRef.value = false
    } else {
      errorRef.value = true
    }
  } catch {
    // 哈希计算异常（如浏览器不支持）也提示错误
    errorRef.value = true
  }
}

function handleSubmit(e: Event) {
  e.preventDefault()
  verifyPassword(passwordRef.value)
}
</script>

<template>
  <div v-if="!unlockedRef" class="pass-protect">
    <form class="pass-protect__form" @submit="handleSubmit">
      <h3>🔒 此文档需要密码访问</h3>
      <p>请输入密码以查看内容</p>
      <div class="pass-protect__input-row">
        <input
          v-model="passwordRef"
          type="password"
          placeholder="请输入密码"
          class="pass-protect__input"
          autofocus
        />
        <button type="submit" class="pass-protect__btn">确认</button>
      </div>
      <p v-if="errorRef" class="pass-protect__error">密码错误，请重试</p>
    </form>
  </div>
  <slot v-else />
</template>

<style scoped>
.pass-protect {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
}

.pass-protect__form {
  text-align: center;
  max-width: 400px;
  width: 100%;
  padding: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.pass-protect__form h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.pass-protect__form p {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.pass-protect__input-row {
  display: flex;
  gap: 8px;
}

.pass-protect__input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
}

.pass-protect__input:focus {
  border-color: var(--vp-c-brand-1);
}

.pass-protect__btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.pass-protect__btn:hover {
  background: var(--vp-c-brand-2);
}

.pass-protect__error {
  color: var(--vp-c-danger-1) !important;
  margin-top: 12px !important;
}
</style>
