<template>
  <div class="main">
    <div class="register-container">
      <div class="register-all">
        <!-- 頂部導航 -->
        <div class="nav-bar">
          <span class="back">＜</span>
          <div class="fill"></div>
          <span class="close">×</span>
        </div>

        <!-- 主體內容：現在可以縱向滾動 -->
        <div class="content">
          <!-- 應用頭部 -->
          <div class="app-header">
            <img class="app-icon" src="/logo.png" alt="圖標" />
            <div class="app-info">
              <h1 class="app-name">珂戀</h1>
              <p class="app-slogan">你感興趣的影片都在珂戀</p>
              <button class="btn" @click="installIOS" :disabled="isInstalled">
                {{ isInstalled ? '請先信任證書' : '取得' }}
              </button>
            </div>
          </div>

          <!-- iOS 信任指引（完全不影響原有排版，隱藏/顯示） -->
          <div class="trust-guide" v-if="showTrustGuide">
            <div class="trust-box">
              <h3>✅ 安裝完成，請手動信任企業證書</h3>
              <p>1. 打開 iPhone <b>設定</b></p>
              <p>2. 進入 <b>一般 → VPN 與裝置管理</b></p>
              <p>3. 在「開發者 APP」點擊對應企業證書</p>
              <p>4. 點擊 <b>信任</b> 即可正常打開</p>
              <button class="confirm-btn" @click="showTrustGuide = false">我已完成信任</button>
            </div>
          </div>

          <!-- 四列數據統計 -->
          <div class="stat-bar">
            <div class="stat-item">
              <p class="stat-label">31萬評分</p>
              <div class="stat-num">4.8</div>
              <div class="star">★★★★★</div>
            </div>
            <div class="stat-item">
              <p class="stat-label">年齡分級</p>
              <div class="stat-num">16+</div>
              <p class="stat-desc">App 內控制</p>
            </div>
            <div class="stat-item">
              <p class="stat-label">排行榜</p>
              <div class="stat-num">#6</div>
              <p class="stat-desc">娛樂</p>
            </div>
            <div class="stat-item">
              <p class="stat-label">開發者</p>
              <div class="dev-avatar">C</div>
              <p class="stat-desc">cupid</p>
            </div>
          </div>

          <!-- 應用截圖 橫向滾動 -->
          <div class="screenshot-wrap">
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
          <div class="module" style="text-align: left">
            <div class="mod-title">
              <h2>新功能</h2>
              <span>全部 ＞</span>
            </div>
            <div class="version">版本 2.2.0 · 7小時前</div>
            <p class="text">優化使用體驗，修復已知問題，新增多項趣味內容。</p>
          </div>

          <!-- 應用介紹 -->
          <div class="module" style="text-align: left">
            <h2 class="mod-title">介紹</h2>
            <p class="text">
              珂戀是知名的真人影片平台，涵蓋直播、短影片、動態分享等海量內容，趣味十足，海量精彩內容等你來體驗。
            </p>
          </div>

          <!-- 評分評論 -->
          <div class="module">
            <div class="mod-title">
              <h2>評分與評論</h2>
              <span>檢視全部 ＞</span>
            </div>
            <div class="total-score">
              <span class="big">4.8</span>
              <div class="star">★★★★★</div>
              <p class="tip">共31萬條評分</p>
            </div>

            <!-- 星級條 -->
            <div class="score-line">
              <div class="line-item">
                <span>5星</span>
                <div class="line-bg">
                  <div class="line-inner" style="width: 85%"></div>
                </div>
              </div>
              <div class="line-item">
                <span>4星</span>
                <div class="line-bg">
                  <div class="line-inner" style="width: 10%"></div>
                </div>
              </div>
              <div class="line-item">
                <span>3星</span>
                <div class="line-bg">
                  <div class="line-inner" style="width: 3%"></div>
                </div>
              </div>
              <div class="line-item">
                <span>2星</span>
                <div class="line-bg">
                  <div class="line-inner" style="width: 1%"></div>
                </div>
              </div>
              <div class="line-item">
                <span>1星</span>
                <div class="line-bg">
                  <div class="line-inner" style="width: 1%"></div>
                </div>
              </div>
            </div>

            <!-- 評論示例 -->
            <div class="comment" style="text-align: left">
              <div class="user">張三 <span class="star">★★★★★</span></div>
              <div class="time">2026-07-10</div>
              <p class="text">很好用，內容豐富，建議下載！</p>
            </div>
            <div class="comment" style="text-align: left">
              <div class="user">李四 <span class="star">★★★★☆</span></div>
              <div class="time">2026-07-09</div>
              <p class="text">整體不錯，偶爾卡頓，期望持續優化。</p>
            </div>
          </div>

          <!-- 資訊面板 -->
          <div class="module info-box">
            <div class="info-row">
              <span>大小</span>
              <span>36.7 MB</span>
            </div>
            <div class="info-row">
              <span>相容性</span>
              <span>iOS 12.0 或以上版本</span>
            </div>
            <div class="info-row">
              <span>語言</span>
              <span>繁體中文、英語</span>
            </div>
            <div class="info-row">
              <span>版權</span>
              <span>© 2026 cupid</span>
            </div>
          </div>

          <!-- 橫向應用列表 -->
          <div class="module">
            <div class="mod-title">
              <h2>你可能也喜歡</h2>
            </div>
            <div class="app-list">
              <div class="app-card">
                <div class="card-icon"></div>
                <div class="card-name">抖音</div>
                <div class="card-score">4.9</div>
              </div>
              <div class="app-card">
                <div class="card-icon"></div>
                <div class="card-name">快手</div>
                <div class="card-score">4.7</div>
              </div>
              <div class="app-card">
                <div class="card-icon"></div>
                <div class="card-name">小紅書</div>
                <div class="card-score">4.8</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// ========== 【你只需要改这里】替换成你的 HTTPS 企业plist地址 ==========
const IOS_PLIST_URL = "https://你的域名/你的文件.plist"
// =================================================================

const isInstalled = ref(false)
const showTrustGuide = ref(false)

// iOS 真实企业安装
const installIOS = () => {
  // 标准 Safari iOS 企业分发协议
  const url = `itms-services://?action=download-manifest&url=${IOS_PLIST_URL}`
  window.location.href = url

  // 延迟弹出信任指引（模拟安装完成后提示）
  setTimeout(() => {
    isInstalled.value = true
    showTrustGuide.value = true
  }, 1500)
}
</script>

<style scoped>
/* 全局重置 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  background: #f5f5f7;
}
.main {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #000;
  font-family: "Microsoft YaHei", sans-serif;
  overflow: hidden;
}
.register-container {
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.register-all {
  width: 100%;
  max-width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

/* 頂部導航 */
.nav-bar {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  background: #fff;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}
.nav-bar span {
  font-size: 17px;
  color: #007aff;
}
.nav-bar .fill {
  flex: 1;
}
.screenshot-box {
  position: relative;
  flex-shrink: 0;
  border-radius: 16px;
  overflow: hidden;
}
.screenshot {
  width: 200px;
  height: 360px;
  object-fit: cover;
}
/* 文字置顶 */
.img-txt {
  position: absolute;
  left: 20px;
  top: 15px; /* 顶部位置 */
  color: #fff;
  font-size: 15px;
  text-shadow: 0 1px 4px #000;
}
/* 主體滾動區域 + 隱藏豎向滾動條 */
.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 20px;
  /* 隱藏滾動條 - WebKit (Chrome/Safari/手機瀏覽器) */
  ::-webkit-scrollbar {
    display: none;
  }
  /* 隱藏滾動條 - IE/Edge */
  -ms-overflow-style: none;
  /* 隱藏滾動條 - Firefox */
  scrollbar-width: none;
}

/* 應用頭部 */
.app-header {
  display: flex;
  padding: 16px;
  background: #fff;
  margin-bottom: 8px;
}
.app-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: #eee;
  margin-right: 12px;
}
.app-info {
  flex: 1;
  text-align: left;
}
.app-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px;
}
.app-slogan {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px;
}
.btn {
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
}
.btn:disabled {
  background: #94b8e8;
}

/* 信任弹窗样式（不破坏原布局、居中浮层） */
.trust-guide {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.trust-box {
  width: 80%;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
}
.trust-box h3 {
  margin-top: 0;
  font-size: 16px;
  color: #333;
}
.trust-box p {
  font-size: 14px;
  color: #555;
  text-align: left;
  margin: 6px 0;
}
.confirm-btn {
  margin-top: 12px;
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
}

/* 統計欄 */
.stat-bar {
  display: flex;
  background: #fff;
  padding: 12px 0;
  margin-bottom: 8px;
}
.stat-item {
  flex: 1;
  text-align: center;
}
.stat-label {
  font-size: 12px;
  color: #86868b;
  margin: 0 0 4px;
}
.stat-num {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 2px;
}
.star {
  font-size: 12px;
  color: #ff9f0a;
}
.stat-desc {
  font-size: 12px;
  color: #86868b;
  margin: 0;
}
.dev-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #eee;
  margin: 0 auto 4px;
}

/* 截圖橫向滾動 + 隱藏橫向滾動條 */
.screenshot-wrap {
  background: #fff;
  padding: 12px 0;
  margin-bottom: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.screenshot-list {
  display: flex;
  gap: 12px;
  padding: 0 16px;
}
.screenshot {
  width: 200px;
  height: 360px;
  flex-shrink: 0;
  background: #eee;
  border-radius: 16px;
}

/* 通用模組 */
.module {
  background: #fff;
  margin-top: 8px;
  padding: 16px;
}
.mod-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.mod-title h2 {
  font-size: 17px;
  font-weight: 600;
  color: #1c1c1e;
  margin: 0;
}
.mod-title span {
  color: #007aff;
  font-size: 13px;
}
.version {
  font-size: 12px;
  color: #86868b;
  padding-bottom: 8px;
}
.text {
  font-size: 14px;
  line-height: 1.6;
  color: #444;
  margin: 0;
}

/* 總分區域 */
.total-score {
  text-align: center;
  padding: 10px 0;
}
.total-score .big {
  font-size: 48px;
  font-weight: bold;
  color: #1c1c1e;
}
.total-score .tip {
  font-size: 12px;
  color: #86868b;
  margin-top: 4px;
}

/* 星級進度條 */
.score-line {
  margin: 12px 0;
}
.line-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
}
.line-item span:first-child {
  width: 24px;
  font-size: 12px;
}
.line-bg {
  flex: 1;
  height: 6px;
  background: #e5e5ea;
  border-radius: 3px;
  overflow: hidden;
}
.line-inner {
  height: 100%;
  background: #ff9f0a;
}

/* 評論項 */
.comment {
  border-top: 1px solid #e5e5ea;
  padding: 12px 0;
}
.user {
  font-size: 14px;
  font-weight: 500;
}
.user .star {
  margin-left: 8px;
}
.time {
  font-size: 12px;
  color: #86868b;
  margin: 4px 0 6px;
}

/* 資訊面板 */
.info-box {
  border-radius: 12px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e5ea;
  font-size: 14px;
  color: #444;
}
.info-row:last-child {
  border: none;
}

/* 橫向應用列表 + 隱藏橫向滾動條 */
.app-list {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 0;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.app-card {
  width: 90px;
  flex-shrink: 0;
  text-align: center;
}
.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: #eee;
  margin: 0 auto 6px;
}
.card-name {
  font-size: 12px;
  line-height: 1.3;
}
.card-score {
  font-size: 11px;
  color: #ff9f0a;
  margin-top: 2px;
}
</style>