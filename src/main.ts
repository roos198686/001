import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index'
import request from '@/utils/request'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18n from '/src/i18n/index.js'

// 导入超时相关工具函数（相对路径，和 router 保持一致规则）
import { updateOperateTime, initCheck, startCheck } from './utils/authTimeout'

// 只创建一次 app
const app = createApp(App)

// 注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 挂载插件
app
  .use(i18n)
  .use(ElementPlus)
  .use(router)
  .mount('#app')

// 国际化标题
const { t, locale } = i18n.global
document.title = t('siteTitle')

// ===================== 無操作自動登出 - 監聽 & 定時器 =====================
let actionDebounce = null
// 用戶操作：滑鼠、鍵盤、滾動，刷新計時
const handleUserAction = () => {
  if (localStorage.getItem('user')) {
    clearTimeout(actionDebounce)
    actionDebounce = setTimeout(() => {
      updateOperateTime()
    }, 200)
  }
}

// 綁定事件監聽
document.addEventListener('mousemove', handleUserAction)
document.addEventListener('keydown', handleUserAction)
document.addEventListener('scroll', handleUserAction)
document.addEventListener('click', handleUserAction) // 新增点击监听

// 頁面切回前台，刷新時間
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && localStorage.getItem('user')) {
    updateOperateTime()
  }
})

// 頁面關閉/刷新前兜底（同步請求重置登錄狀態）
window.addEventListener('beforeunload', async () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return

  try {
    const user = JSON.parse(userStr)
    // 异步请求，适配浏览器限制
    await request.post('/api/user/userlogout', { userId: user.id })
  } catch (e) {
    console.error('頁面關閉重置登錄狀態失敗', e)
  }
})

// 初始化校驗 + 啟動定時檢測
initCheck(router)
// startCheck(router)