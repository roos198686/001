<template>
  <div class="main">
    <div class="android-page">
      <!-- 安卓顶部状态栏/导航栏 -->
      <header class="android-top-bar">
        <span class="back-btn">＜</span>
        <span class="bar-title">應用詳情</span>
      </header>

      <!-- 主滚动区域 -->
      <div class="android-content">
        <!-- 应用头部 -->
        <div class="app-head">
          <img class="app-icon" src="/logo.png" alt="圖標" />
          <div class="app-info" style="text-align: left;">
            <h2 class="app-name">珂戀</h2>
            <p class="app-desc">你感興趣的影片都在珂戀</p>
            <button class="install-btn" @click="downloadApk" :disabled="isDownloading">
              {{ isDownloading ? '下載中...' : '安裝' }}
            </button>
          </div>
        </div>

        <!-- 数据统计区 安卓横向均分布局 -->
        <div class="stat-panel">
          <div class="stat-item">
            <div class="stat-value">4.8</div>
            <div class="stat-label">評分</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">31萬</div>
            <div class="stat-label">評分數</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">16+</div>
            <div class="stat-label">年齡分級</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">cupid</div>
            <div class="stat-label">開發者</div>
          </div>
        </div>

        <!-- 应用截图 横向滑动 -->
        <div class="screenshot-container">
          <div class="screenshot-list">
            <div class="screenshot-box">
              <img class="screenshot" src="../assets/images/001.png" alt="" />
              <span class="img-txt">人氣推薦</span>
            </div>
            <div class="screenshot-box">
              <img class="screenshot" src="../assets/images/002.png" alt="" />
              <span class="img-txt">個人檔案</span>
            </div>
            <div class="screenshot-box">
              <img class="screenshot" src="../assets/images/003.png" alt="" />
              <span class="img-txt">專屬 VIP</span>
            </div>
            <div class="screenshot-box">
              <img class="screenshot" src="../assets/images/004.png" alt="" />
              <span class="img-txt">線上即時聊天</span>
            </div>
          </div>
        </div>

        <!-- 新功能 -->
        <div class="module">
          <div class="module-title">新功能</div>
          <div class="version">版本 2.2.0 · 7小時前</div>
          <p class="module-text">優化使用體驗，修復已知問題，新增多項趣味內容。</p>
        </div>

        <!-- 应用介绍 -->
        <div class="module">
          <div class="module-title">介紹</div>
          <p class="module-text">珂戀是知名的真人影片平台，涵蓋直播、短影片、動態分享等海量內容，趣味十足，海量精彩內容等你來體驗。</p>
        </div>

        <!-- 评分评论 -->
        <div class="module">
          <div class="module-title-wrap">
            <span class="module-title">評分與評論</span>
            <span class="more">檢視全部 ＞</span>
          </div>

          <div class="score-total">
            <span class="score-big">4.8</span>
            <span class="score-desc">共31萬條評分</span>
          </div>

          <!-- 星级进度条 -->
          <div class="score-line-group">
            <div class="score-line">
              <span class="line-label">5星</span>
              <div class="line-bg">
                <div class="line-fill" style="width: 85%"></div>
              </div>
            </div>
            <div class="score-line">
              <span class="line-label">4星</span>
              <div class="line-bg">
                <div class="line-fill" style="width: 10%"></div>
              </div>
            </div>
            <div class="score-line">
              <span class="line-label">3星</span>
              <div class="line-bg">
                <div class="line-fill" style="width: 3%"></div>
              </div>
            </div>
            <div class="score-line">
              <span class="line-label">2星</span>
              <div class="line-bg">
                <div class="line-fill" style="width: 1%"></div>
              </div>
            </div>
            <div class="score-line">
              <span class="line-label">1星</span>
              <div class="line-bg">
                <div class="line-fill" style="width: 1%"></div>
              </div>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="comment-item">
            <div class="user-name">張三 <span class="star">★★★★★</span></div>
            <div class="comment-time">2026-07-10</div>
            <p class="comment-content">很好用，內容豐富，建議下載！</p>
          </div>
          <div class="comment-item">
            <div class="user-name">李四 <span class="star">★★★★☆</span></div>
            <div class="comment-time">2026-07-09</div>
            <p class="comment-content">整體不錯，偶爾卡頓，期望持續優化。</p>
          </div>
        </div>

        <!-- 应用信息 -->
        <div class="module">
          <div class="module-title">應用資訊</div>
          <div class="info-row">
            <span class="info-key">大小</span>
            <span class="info-val">36.7 MB</span>
          </div>
          <div class="info-row">
            <span class="info-key">相容性</span>
            <span class="info-val">Android 8.0 或以上版本</span>
          </div>
          <div class="info-row">
            <span class="info-key">語言</span>
            <span class="info-val">繁體中文、英語</span>
          </div>
          <div class="info-row">
            <span class="info-key">版權</span>
            <span class="info-val">© 2026 cupid</span>
          </div>
        </div>

        <!-- 相關應用 -->
        <div class="module">
          <div class="module-title">你可能也喜歡</div>
          <div class="relate-app-list">
            <div class="relate-app">
              <div class="relate-icon"></div>
              <div class="relate-name">抖音</div>
              <div class="relate-score">4.9</div>
            </div>
            <div class="relate-app">
              <div class="relate-icon"></div>
              <div class="relate-name">快手</div>
              <div class="relate-score">4.7</div>
            </div>
            <div class="relate-app">
              <div class="relate-icon"></div>
              <div class="relate-name">小紅書</div>
              <div class="relate-score">4.8</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 配置：替换为你的 APK 真实下载地址
const APK_DOWNLOAD_URL = 'https://xxx.com/xxx.apk'
const isDownloading = ref(false)

// 安卓下载逻辑
const downloadApk = () => {
  if (isDownloading.value) return
  isDownloading.value = true

  // 触发浏览器直接下载 APK
  const aTag = document.createElement('a')
  aTag.href = APK_DOWNLOAD_URL
  aTag.download = '珂戀.apk'
  document.body.appendChild(aTag)
  aTag.click()
  document.body.removeChild(aTag)

  // 重置按钮状态
  setTimeout(() => {
    isDownloading.value = false
  }, 2000)
}
</script>

<style scoped>
/* 全局重置 安卓基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,
body {
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
  font-family: Roboto, "微軟正黑體", sans-serif;
}
.main {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
.android-page {
  width: 100%;
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #fff;
}

/* 安卓顶部导航栏 原生高度+配色 */
.android-top-bar {
  height: 56px;
  background-color: #2196F3;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
}
.back-btn {
  font-size: 22px;
  margin-right: 24px;
  cursor: pointer;
}
.bar-title {
  font-size: 18px;
  font-weight: 500;
}

/* 主滚动区域 隐藏滚动条 */
.android-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
.android-content::-webkit-scrollbar {
  display: none;
}
.android-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 应用头部 */
.app-head {
  display: flex;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
}
.app-icon {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: #eee;
  margin-right: 16px;
}
.app-info {
  flex: 1;
  padding-top: 4px;
}
.app-name {
  font-size: 20px;
  color: #212121;
  margin-bottom: 4px;
}
.app-desc {
  font-size: 14px;
  color: #757575;
  margin-bottom: 12px;
}
.install-btn {
  background-color: #2196F3;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 20px;
  font-size: 14px;
  cursor: pointer;
}
.install-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 数据统计面板 安卓均分布局 */
.stat-panel {
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
}
.stat-item {
  text-align: center;
}
.stat-value {
  font-size: 16px;
  color: #212121;
  font-weight: 500;
}
.stat-label {
  font-size: 12px;
  color: #757575;
  margin-top: 4px;
}

/* 截图区域 */
.screenshot-container {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
}
.screenshot-container::-webkit-scrollbar {
  display: none;
}
.screenshot-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.screenshot-list {
  display: flex;
  gap: 12px;
  padding: 0 4px;
}
.screenshot-box {
  position: relative;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}
.screenshot {
  width: 200px;
  height: 360px;
  object-fit: cover;
}
.img-txt {
  position: absolute;
  left: 20px;
  top: 15px;
  color: #fff;
  font-size: 15px;
  text-shadow: 0 1px 4px #000;
}

/* 通用模块样式 安卓分割线风格 */
.module {
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
}
.module-title {
  font-size: 16px;
  color: #212121;
  font-weight: 500;
  margin-bottom: 8px;
}
.module-title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.more {
  font-size: 13px;
  color: #2196F3;
}
.version {
  font-size: 13px;
  color: #757575;
  margin-bottom: 6px;
}
.module-text {
  font-size: 14px;
  color: #424242;
  line-height: 1.6;
}

/* 评分区域 */
.score-total {
  margin: 12px 0;
}
.score-big {
  font-size: 32px;
  color: #212121;
  font-weight: 500;
}
.score-desc {
  font-size: 13px;
  color: #757575;
  margin-left: 8px;
}
.score-line-group {
  margin: 12px 0;
}
.score-line {
  display: flex;
  align-items: center;
  margin: 4px 0;
}
.line-label {
  width: 36px;
  font-size: 12px;
  color: #757575;
}
.line-bg {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}
.line-fill {
  height: 100%;
  background-color: #FF9800;
}

/* 评论项 */
.comment-item {
  padding: 12px 0;
  border-top: 1px solid #eeeeee;
}
.user-name {
  font-size: 14px;
  color: #212121;
}
.star {
  color: #FF9800;
  font-size: 12px;
  margin-left: 6px;
}
.comment-time {
  font-size: 12px;
  color: #757575;
  margin: 4px 0;
}
.comment-content {
  font-size: 14px;
  color: #424242;
}

/* 应用信息行 */
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
}
.info-key {
  color: #757575;
}
.info-val {
  color: #424242;
}

/* 相关应用列表 */
.relate-app-list {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-top: 8px;
}
.relate-app-list::-webkit-scrollbar {
  display: none;
}
.relate-app-list {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.relate-app {
  width: 80px;
  flex-shrink: 0;
  text-align: center;
}
.relate-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #eee;
  margin: 0 auto 6px;
}
.relate-name {
  font-size: 12px;
  color: #424242;
}
.relate-score {
  font-size: 11px;
  color: #FF9800;
  margin-top: 2px;
}
</style>