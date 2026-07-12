<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部标题：完全统一 -->
                <div class="allar-top">
                    <div @click="goBack" style="margin-left: 10px;cursor: pointer;color: #a88035;width: 30px;">
                        <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                    </div>
                    <div class="allar-top-a">{{ $t('membershipCard') }}</div>
                </div>

                <!-- 滚动内容区：完全统一 -->
                <div class="content-wrapper">
                    <div class="cuekdil">
                        <div class="card">
                            <img :src="cordk" class="preview-img" />
                            <div class="confirm" @click="downloadImage">{{ $t('downloadCard') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../router';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const goBack = () => router.go(-1);
const cordk = ref('../images/vipcdrk.png');

// 下载会员卡
const downloadImage = () => {
  const link = document.createElement('a');
  link.href = cordk.value;
  link.download = 'MembershipCard.png';
  link.click();
};

watch(() => route.path, () => {
  localStorage.setItem('last_path', route.path);
}, { immediate: true });

onMounted(() => {
  const lastPath = localStorage.getItem('last_path');
  if (lastPath && route.path === '/') {
    router.replace(lastPath);
  }
});
</script>

<style scoped>
/* ========== 全局布局 100% 完全统一 ========== */
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
    height: 100vh !important;
    position: relative;
}

/* ========== 顶部标题 统一 ========== */
.allar-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    max-width: 500px;
    margin: 0 auto;
    z-index: 999;
    display: flex;
    align-items: center;
    padding: 9px 0;
    background: #141414;
}

.allar-top-a {
    font-size: 15px;
    font-weight: bold;
    color: #a88035;
    text-align: center;
    width: 100%;
    margin-right: 40px;
}

/* ========== 滚动容器 统一 ========== */
.content-wrapper {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    /* padding-bottom: 20px !important; */
    background: #222 !important;
}

.cuekdil {
    /* width: 100%; */
    min-height: 100%;
    background: #222;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
}

/* ========== 你的原有样式 保留 ========== */
.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  /* background: #2c2c2c; */
  width: 100%;
}
.preview-img {
  width: 100%;
  padding: 50px 0;
}
.confirm {
  background: linear-gradient(360deg, #fac383 60%, #fff);
  padding: 10px 30px;
  border-radius: 60px;
  margin-top: 20px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.confirm:hover {
  background: linear-gradient(360deg, #fca13a 60%, #fff);
}

/* ========== 全局统一：滚动条隐藏 + 禁止回弹 ========== */
::-webkit-scrollbar {
    display: none;
}

:global(html),
:global(body) {
    background: #222 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    overscroll-behavior: none !important;
}
</style>