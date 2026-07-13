<template>
  <!-- 外层容器适配iOS安全区域 -->
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// 额外引入 Style 枚举
import { StatusBar, Style } from '@capacitor/status-bar'
import request from '@/utils/request'

// 全局未读数量（全局可用，无任何报错）
const globalUnread = ref(0)

// 挂载到全局，解决 TS 报错
;(window as any).globalUnread = globalUnread

const refreshGlobalUnread = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!user.id) return

  request.post('/api/chat/unread-total', { userId: user.id })
    .then(res => {
      if (res.data.code === 1) {
        globalUnread.value = res.data.total || 0
      }
    })
}

onMounted(async () => {
  // 初始化状态栏，禁止内容覆盖状态栏
  try {
    await StatusBar.setOverlaysWebView({ overlay: false })
    // 使用枚举 Style.Dark 替代字符串 "Dark"
    await StatusBar.setStyle({ style: Style.Dark })
  } catch (e) {
    console.warn('StatusBar API 仅在真机/模拟器生效，web环境可忽略此警告')
  }

  // 未读消息监听
  window.addEventListener('messageReceived', refreshGlobalUnread)
  window.addEventListener('messageRead', refreshGlobalUnread)
  refreshGlobalUnread()
})

onUnmounted(() => {
  window.removeEventListener('messageReceived', refreshGlobalUnread)
  window.removeEventListener('messageRead', refreshGlobalUnread)
})
</script>

<style scoped>
.app-container {
  /* 适配iOS安全区域，避免顶部内容被状态栏/刘海遮挡 */
  padding-top: env(safe-area-inset-top);
  min-height: 100vh;
  box-sizing: border-box;
}
</style>