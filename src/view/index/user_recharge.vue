<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部标题：完全统一 -->
                <div class="allar-top">
                    <div @click="goBack" style="margin-left: 10px;cursor: pointer;color: #a88035;width: 30px;">
                        <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                    </div>
                    <div class="allar-top-a">{{ $t('recharge') }}</div>
                    <div @click="goBackjfkdso">
                        <Icon icon="mdi:support" height="25" style="color: #a88035;padding-right: 15px;"/>
                    </div>
                    
                </div>

                <!-- 滚动内容区：完全统一 -->
                <div class="content-wrapper">
                    <div class="cuekdil">
                        <div style="height: 100%;">
                            <div class="butttop">
                                <div class="butttopone">{{ $t('balance') }}：</div>
                                <div class="butttoptwo">${{ yislogl }}</div>
                            </div>
                            <div class="buttall">
                                <div class="buttallone" style="display: flex;flex-direction: row;justify-content: center;">
                                    <div>$</div>
                                    <div><input class="form-inputtext" v-model="amount" type="text" /></div>
                                </div>
                                <div class="buttalltwo">
                                    <div class="buttalltwo-a">{{ $t('quickSelectMoney') }}</div>
                                    <div class="buttalltwo-b">
                                        <div class="buttalltwo-ba" :class="{ active: amount == 50 }"
                                            @click="setAmount(50)">50
                                        </div>
                                        <div class="buttalltwo-ba" :class="{ active: amount == 100 }"
                                            @click="setAmount(100)">
                                            100</div>
                                        <div class="buttalltwo-ba" :class="{ active: amount == 200 }"
                                            @click="setAmount(200)">
                                            200</div>
                                    </div>
                                    <div class="buttalltwo-b">
                                        <div class="buttalltwo-ba" :class="{ active: amount == 500 }"
                                            @click="setAmount(500)">
                                            500</div>
                                        <div class="buttalltwo-ba" :class="{ active: amount == 1000 }"
                                            @click="setAmount(1000)">1000</div>
                                        <div class="buttalltwo-ba" :class="{ active: amount == 3000 }"
                                            @click="setAmount(3000)">3000</div>
                                    </div>
                                    <div class="buttalltwo-b">
                                        <div class="buttalltwo-ba" :class="{ active: amount == 5000 }"
                                            @click="setAmount(5000)">5000</div>
                                        <div class="buttalltwo-ba" :class="{ active: amount == 10000 }"
                                            @click="setAmount(10000)">10000</div>
                                        <div class="buttalltwo-ba" :class="{ active: amount == 30000 }"
                                            @click="setAmount(30000)">30000</div>
                                    </div>
                                </div>

                                <div class="buttokds-wrapper" v-if="walletList.length > 0">
                                    <div class="buttokds" v-for="item in walletList" :key="item.id"
                                        @click="selectWallet(item)">
                                        {{ item.coin_type }}
                                        <div style="text-align: right;margin-left: auto;">
                                            <input type="radio" name="coin" :checked="selectedWalletId === item.id" />
                                        </div>
                                    </div>
                                </div>

                                <div class="confirm" @click="confirm">{{ $t('confirm') }}</div>
                                <div class="confirm-a">{{ $t('rechargeTip') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="copy-toast" v-if="showToast">
            <div style="font-size: 30PX;">
                <Icon icon="iconoir:xmark" width="58" />
            </div>
            <div class="toast-text" style="font-size: 16px;">{{ $t('selectCurrencyTip') }}</div>
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

const showToast = ref<boolean>(false);
const { t } = useI18n();
const route = useRoute();
const goBack = () => router.go(-1);

const amount = ref(1000);
const walletList = ref<any[]>([]);
const selectedWalletId = ref<number | null>(null);
const yislogl = ref(0);

const goBackjfkdso = async () => {
 const res = await request.post('/api/open/getTgLink')
  if(res.data.code === 200){
    window.location.href = res.data.url
  }
}
const getWalletList = async () => {
    try {
        const { data } = await request.get('/api/recharge/wallet/list');
        if (data.code === 1) {
            walletList.value = data.data;
            if (data.data.length > 0) {
                selectedWalletId.value = data.data[0].id;
            }
        }
    } catch (err) {
        console.log('获取钱包失败', err);
    }
};

const selectWallet = (item: any) => {
    selectedWalletId.value = item.id;
};

const setAmount = (num: number) => {
    amount.value = num;
};

const confirm = () => {
    if (!selectedWalletId.value) {
        showToast.value = true
        setTimeout(() => showToast.value = false, 1500);
        return;
    }

    sessionStorage.setItem('recharge_amount', amount.value + '');
    sessionStorage.setItem('wallet_id', selectedWalletId.value + '');
    router.push('/rpaymentconfirm');
};

watch(() => route.path, () => {
    localStorage.setItem('last_path', route.path);
}, { immediate: true });

onMounted(() => {
    getWalletList();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    yislogl.value = Number(user.balance) || 0;

    const cacheAmt = sessionStorage.getItem('recharge_amount');
    if (cacheAmt && !isNaN(Number(cacheAmt))) {
        amount.value = Number(cacheAmt);
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
    /* margin-right: 40px; */
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
    
}

.cuekdil {
    width: 100%;
    min-height: 100%;
    background-color: #111;
}

/* ========== 你的原有样式 保留 ========== */
.copy-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(75, 74, 74, 0.774);
    color: #fff;
    min-width: 200px;
    padding: 20px 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 9999;
    font-size: 12px;
}

.butttop {
    background-color: #fcd9abe3;
    height: 90px;
    display: flex;
    flex-direction: row;
    z-index: 9999;
    position: relative;
    border-bottom-left-radius: 60% 40px;
    border-bottom-right-radius: 60% 40px;
    justify-content: center;
    align-items: center;
    font-weight: bolder;
    font-size: 20px;
}

.buttall {
    margin: -70px 10px 50px 10px;
    background-color: #252525;
    padding-bottom: 30px;
    z-index: 33;
    border-radius: 12px;
    height: 100%;
    position: relative;
}

.butttoptwo {
    color: #ec00d9;
}

.buttallone {
    padding: 80px 0 10px 0;
    color: #cc9b5a;
    border-width: 0 0 1px 0;
    border-style: solid;
    border-color: #414141;
    font-size: 18px;
    font-weight: 900;
}

.buttalltwo {
    border-width: 0 0 1px 0;
    border-style: solid;
    border-color: #414141;
    padding-bottom: 20px;
    font-size: 15px;
    font-weight: 900;
    color: #cc9b5a;
}

.buttalltwo-a {
    text-align: left;
    padding: 10px 20px;
}

.buttalltwo-b {
    display: flex;
    flex-direction: row;
    gap: 5px;
    margin: 5px 20px 0 20px;
}

.buttalltwo-ba {
    /* background-color: #8a898952; */
    border-radius: 4px;
    flex: 1;
    border-width: 1px;
    border-style: solid;
    border-color: #c7c6c646;
    color: #fff;
    font-size: 12px;
    padding: 8px 0;
    cursor: pointer;
    font-weight: bold;
}

.buttokds {
    height: 35px;
    border-width: 0 0 1px 0;
    border-style: solid;
    border-color: #414141;
    color: #cc9b5a;
    font-size: 12px;
    line-height: 35px;
    text-align: left;
    padding: 0 20px;
    font-weight: 800;
    display: flex;
    flex-direction: row;
    cursor: pointer;
}

.buttokds-wrapper {
    display: flex;
    flex-direction: column;
}

.buttokds input[type="radio"] {
    accent-color: #cc9b5a;
}

.buttalltwo-ba.active {
    background-color: #cc9b5a;
    color: #fff;
}

.confirm {
    background: linear-gradient(360deg, #fac383 60%, #fff);
    padding: 8px;
    margin: 20px;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
}

.confirm:hover {
    background: linear-gradient(360deg, #fca13a 60%, #fff);
}

.confirm-a {
    color: #cc9b5a;
    font-size: 12px;
}

.form-inputtext {
    padding: 0 15px;
    font-size: 18px;
    font-weight: 800;
    color: #cc9b5a;
    outline: none;
    transition: border-color 0.3s;
    background-color: #47444700;
    border: none;
}

.form-inputtext.invalid {
    border: none;
}

.form-inputtext:focus {
    border: none;
    outline: none;
}

/* ========== 全局统一：滚动条隐藏 + 禁止回弹 ========== */
::-webkit-scrollbar {
    display: none;
}

:global(html),
:global(body) {
    background: #111 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    overscroll-behavior: none !important;
}
</style>