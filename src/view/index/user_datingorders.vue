<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部标题：统一 fixed + 返回箭头 -->
                <div class="allar-top">
                    <div @click="goBack" style="margin-left: 10px;cursor: pointer;color: #a88035;width: 30px;">
                        <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                    </div>
                    <div class="allar-top-a">{{ $t('orderList') }}</div>
                </div>

                <!-- 中间滚动区域：完全统一 -->
                <div class="content-wrapper">
                    <div class="cuekdil">
                        <div class="ciurld">
                            <div class="status-tab" :class="{active:activeTab==='Pending'}" @click="ciurlist('Pending')">
                                {{ $t('pending') }}
                            </div>
                            <div class="status-tab" :class="{active:activeTab==='Completed'}" @click="ciurlist('Completed')">
                                {{ $t('completed') }}
                            </div>
                            <div class="status-tab" :class="{active:activeTab==='Frozen'}" @click="ciurlist('Frozen')">
                                {{ $t('frozen') }}
                            </div>
                        </div>

                        <div class="list-scroll-wrap" @scroll="handleScroll">
                            <div class="brislidlist" v-for="menu in showList" :key="menu.id">
                                <div style="flex:1;">{{ menu.order_no }}</div>
                                <div style="flex:1;">{{ moment(menu.create_time).format('YY/MM/DD') }}</div>
                                <div style="flex:1;">{{ menu.coin_type }}</div>
                                <div style="flex:1;">{{ menu.amount }}</div>
                                <div style="flex:1;background: #f89f2b; padding: 2px; border-radius: 4px; color: #000;">
                                    {{ $t(getTypeText(menu.type)) }}
                                </div>
                            </div>

                            <div style="padding:12px;text-align:center;color:#999;font-size:12px;background:#272727;border-top:1px solid #0e0808f1;height:50px;">
                                <span v-if="loading">{{ $t('loading') }}</span>
                                <span v-else-if="showList.length===0">
                                    <Icon icon="mdi:clipboard-outline" width="38" />
                                </span>
                                <span v-else>{{ $t('allLoaded') }}</span>
                            </div>
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
import request from '@/utils/request';
import moment from 'moment';

const { t } = useI18n();
const route = useRoute();
const goBack = () => router.go(-1);

const getTypeText = (type: number) => {
  const map: Record<number, string> = {
    1: 'type_withdraw',
    2: 'type_recharge',
    3: 'type_transfer',
    4: 'type_vip',
    5: 'type_date_card'
  }
  return map[type] || 'unknown'
}

const activeTab = ref('Pending')
const showList = ref<any[]>([])
const loading = ref(false)

function statusValue(tab: string) {
  if (tab === 'Pending') return 0
  if (tab === 'Completed') return 1
  if (tab === 'Frozen') return 2
  return 0
}

async function loadData() {
  loading.value = true
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user.userId || user.id;

  const { data: res } = await request.post('/api/withdraw/list', {
    user_id: userId,
    status: statusValue(activeTab.value)
  })

  showList.value = res.data || []
  loading.value = false
}

function ciurlist(tab: string) {
  activeTab.value = tab
  showList.value = []
  loadData()
}

function handleScroll() {}

watch(() => route.path, () => {
  localStorage.setItem('last_path', route.path)
}, { immediate: true })

onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* ========== 全局布局：100% 统一 ========== */
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

/* ========== 顶部标题：统一 fixed ========== */
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

/* ========== 滚动容器：完全统一 ========== */
.content-wrapper {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    padding-bottom: 20px !important;
    background: #222 !important;
}

.cuekdil {
    width: 100%;
    min-height: 100%;
    background: #222;
    padding-bottom: 10px;
}

/* ========== 你的业务样式 保留 ========== */
.ciurld {
    display: flex;
    font-size: 13px;
    width: 100%;
    margin-top: 5px;
}

.status-tab {
    flex: 1;
    margin-top: 3px;
    background-color: #f8cc93;
    padding: 10px 0;
    text-align: center;
    color: #000;
    cursor: pointer;
}

.status-tab.active {
    background-color: #f89f2b;
    font-weight: 800;
}

.list-scroll-wrap {
    margin-top: 5px;
}

.brislidlist {
    display: flex;
    padding: 10px 12px;
    box-sizing: border-box;
    border-top: 1px solid #0e0808f1;
    color: #c7c6c6;
    background-color: #272727;
}

.brislidlist > div {
    flex: 1;
    text-align: center;
    font-size: 10px;
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