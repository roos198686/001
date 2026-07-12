<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部标题：完全统一 -->
                <div class="allar-top">
                    <div @click="goBack" style="margin-left: 10px; cursor: pointer; color: #a88035; width: 30px;">
                        <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                    </div>
                    <div class="allar-top-a">{{ $t('myBankCard') }}</div>
                </div>

                <!-- 滚动内容区：完全统一 -->
                <div class="content-wrapper">
                    <div class="cuekdil">
                        <div class="list-wrapper">
                            <div class="cardlist" v-if="source.length>0">
                                <div class="cardlist-list" v-for="value in source" :key="value.id">
                                    <div style="text-align:left;">{{ value.coin_type }}</div>
                                    <div style="font-size:16px;">
                                        {{ value.wallet_address.slice(0,5) + '***' + value.wallet_address.slice(-5) }}
                                    </div>
                                    <div class="delete">
                                        <div class="delete-butt" @click="deletecard(value.id)">
                                            {{ $t('delete') }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style="color:#999;text-align:center;padding:30px;background-color: #0f0f0f;" v-else>
                                <Icon icon="mdi:clipboard-outline" width="58" />
                            </div>
                        </div>

                        <div class="cardlist-bottom">
                            <div class="cardlist-add" @click="addcard">{{ $t('addWithdrawChannel') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import request from '@/utils/request';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const goBack = () => void router.back();

interface WalletItem {
  id: string | number;
  coin_type: string;
  wallet_address: string;
}

const source = ref<WalletItem[]>([]);

const getUserId = () => {
  try {
    const u = localStorage.getItem('user');
    if (!u) return null;
    return JSON.parse(u).id || null;
  } catch {
    return null;
  }
};

const getList = async () => {
  const user_id = getUserId();
  if (!user_id) return;

  try {
    const { data: res } = await request.post('/api/wallet/list', {
      user_id
    });
    if (res.code === 1) {
      source.value = res.data;
    }
  } catch (err) {
    console.error('获取失败', err);
  }
};

const deletecard = async (id: string | number) => {
  const user_id = getUserId();
  if (!user_id) return;

  try {
    const { data: res } = await request.post('/api/wallet/del', {
      id,
      user_id
    });
    if (res.code === 1) getList();
  } catch {}
};

const addcard = () => void router.push('/addcard');

onMounted(() => getList());

watch(() => route.path, () => {
  localStorage.setItem('last_path', route.fullPath);
}, { immediate: true });
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
    /* background: #000; */
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
    background: #111111 !important;
}

.cuekdil {
    width: 100%;
    min-height: 100%;
    /* background: #222; */
    padding-bottom: 10px;
}

/* ========== 你的原有样式 保留 ========== */
.list-wrapper {
  flex: 1;
  /* background-color: #080808; */
  overflow-y: auto !important;
}
.list-wrapper::-webkit-scrollbar { display: none !important; }

.cardlist {
  padding: 15px 30px;
}

.cardlist-bottom {
  padding: 15px 30px;
  /* background-color: #0f0f0f; */
  flex-shrink: 0;
}

.cardlist-list {
  background-color: #1a1919;
  margin-bottom: 10px;
  border-radius: 15px;
  color: #fff;
  font-size: 12px;
  padding: 20px 30px;
  box-shadow: 0 0 1px 1px rgb(37, 37, 37);
}
.cardlist-add {
  background: linear-gradient(360deg, #e859f5, #eda5fc);
  padding: 7px;
  color: #000;
  border-radius: 50px;
  text-align: center;
  cursor: pointer;
}
.delete { display: flex; }
.delete-butt {
  background: #b806be;
  margin-left: auto;
  border-radius: 50px;
  padding: 3px 15px;
  cursor: pointer;
}

/* ========== 全局统一：滚动条隐藏 + 禁止回弹 ========== */
::-webkit-scrollbar {
    display: none;
}

:global(html),
:global(body) {
    background: #111111 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    overscroll-behavior: none !important;
}
</style>