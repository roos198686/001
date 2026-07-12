<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部标题：完全统一 -->
                <div class="allar-top">
                    <div @click="goBack" style="margin-left: 10px;cursor: pointer;color: #a88035;width: 30px;">
                        <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                    </div>
                    <div class="allar-top-a">{{ $t('vipManagement') }}</div>
                </div>

                <!-- 滚动内容区：完全统一 -->
                <div class="content-wrapper">
                    <div class="cuekdil">
                        <div style="display: flex;flex-direction: row;padding-top: 20px;align-items: center;">
                            <div style="color: #cc9b5a;font-weight: bold;font-size: 14px;padding-left: 20px;">{{
                                $t('currentLevel') }}：
                                <span style="color: #e64dde;">{{ userInfo.vip ? 'VIP' + userInfo.vip :  $t('normalUser') }}</span>
                            </div>
                        </div>

                        <div class="vipall">
                            <div class="viptext" v-for="item in vipList" :key="item.vip_level">
                                <div style="height: 60px;height: 60px;width:15%;">
                                    <img :src="item.icon_url == 1 ? imagea : item.icon_url == 2 ? imageb : imagec " style="width:100%;height:100%;object-fit:cover;">
                                </div>
                                <div
                                    style="display: flex;flex-direction: column;text-align: left;width:25%;justify-content: center;margin-left: 10px;">
                                    <div style="color: #cc9b5a;font-weight: bold;font-size: 15px;">VIP{{ item.vip_level }}</div>
                                    <div style="color: #888;font-size: 12px;">{{ $t('recharge') }}:{{ item.recharge_amount }}</div>
                                </div>
                                <div
                                    style="display: flex;flex-direction: column;text-align: center;flex: 1; justify-content: center;">
                                    <div style="font-size: 14px;color: #fff;">{{ $t('privilege') }}</div>
                                    <div style="font-size: 12px;color: #888;">
                                        <!-- {{ $t('unlimitedChat') }} -->
                                          {{ item.privilege_desc }}
                                    </div>
                                </div>
                                <div class="upgrade"
                                    :class="Number(userInfo?.vip)+1 == item.vip_level ? 'upgrade--active' : 'upgrade--disabled'"
                                    @click="recharge(item)">{{ $t('upgrade') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="copy-toastas" v-if="zuzjkdsoa">
            <div
                style="font-size: 30px;width: 100%;height: 120px;display: flex;background-color: #eee;align-items: center;">
                <div style="height: 60px;width:15%;margin-left: 20px;">
                    <img :src="vakdilsog == 100 ? imagea : vakdilsog == 300 ? imageb : imagec"
                        style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div style="font-size: 16px;">升级为VIP{{ vakdilsog == 100 ? '1' : vakdilsog == 300 ? '2' : '3' }}</div>
            </div>
            <div
                style="border-radius: 30px 30px 0 0;background-color: #fff;width: 100%;color: #000;text-align: left;position: relative;margin-top: auto;flex: 1;">
                <div style="font-size: 16px;margin-top: 30px;margin-left: 30px;">可用余额：{{ userInfo.balance }}</div>
                <div style="font-size: 36px;margin-top: 10px;margin-left: 30px;font-weight: bold;">
                    <div class="form-input">${{ vakdilsog }}</div>
                </div>
                <div style="padding-top: 30px;display: flex;justify-content: center;flex-direction: column;align-items: center;">
                    <div style="font-size: 14px;color: #999;margin-bottom: 5px;">{{ $t('inviteCode') }}</div>
                    <div><input class="form-inputtext" v-model="amountyqm" type="text" /></div>
                </div>
                <div style="display: flex;flex-direction: row;margin: 50px 20px 20px 20px;gap: 15px;">
                    <div class="buttdgr" @click="zuzjkdsoa = false">{{ $t('cancel') }}</div>
                    <div class="buttdgraa" @click="router.push(`/user_recharge`)" v-if="userInfo.balance < vakdilsog">
                        {{ $t('goRecharge') }}</div>
                    <div class="buttdgraa" @click="datingcard" v-else>{{ $t('upgrade') }}</div>
                </div>
            </div>
        </div>

        <div class="copy-toast" v-if="showToast">
            <div style="font-size: 30PX;">
                <Icon icon="iconoir:xmark" width="58" v-if="!yesno" />
                <Icon icon="iconoir:check" width="58" v-if="yesno" />
            </div>
            <div style="font-size: 16px;">{{ showtext }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../router';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import request from '@/utils/request';
const amountyqm = ref('');
const { t } = useI18n();
const route = useRoute();
const zuzjkdsoa = ref(false)
const vakdilsog = ref()

const showToast = ref(false);
const showtext = ref('');
const yesno = ref(false);
const goBack = () => router.go(-1);

const recharge = (item: any) => {
    zuzjkdsoa.value = true
    vakdilsog.value = item.recharge_amount
};
// VIP列表数据
const vipList = ref([])

// 拉取VIP配置列表
const getVipList = async () => {
  try {
    const { data: res } = await request.get('/api/datingcard/viplist')
    if (res.code === 200) {
      vipList.value = res.data || []
    }
  } catch (err) {
    console.error('获取VIP列表失败', err)
  }
}
const datingcard = async () => {
    const balance = Number(userInfo.balance);

    if (balance < vakdilsog.value) {
        showToast.value = true;
        yesno.value = false;
        showtext.value = t('insufficientBalance');
        setTimeout(() => showToast.value = false, 1000);
        return;
    }
    if (!amountyqm.value || amountyqm.value == '') {
        showToast.value = true;
        yesno.value = false;
        showtext.value = t('pleaseEnterInviteCode');
        setTimeout(() => showToast.value = false, 1500);
        return;
    }
    console.log( userInfo.id,vakdilsog.value,amountyqm.value)
    try {
        const { data } = await request.post('/api/datingcard/buy-vip', {
            user_id: userInfo.id,
            amount: vakdilsog.value,
            invite_code: amountyqm.value
        });

        if (data.code === 1) {
            showToast.value = true;
            yesno.value = true;
            showtext.value = t('purchaseSuccess') + '5555555555555';
            setTimeout(() => showToast.value = false, 1000);
            zuzjkdsoa.value = false;
            loadUserInfo();
        } else {
            showToast.value = true;
            yesno.value = false;
            showtext.value = t('requestFailed')+ '6666666666666666';
            setTimeout(() => showToast.value = false, 1000);
        }
    } catch (err) {
        showToast.value = true;
        yesno.value = false;
        showtext.value = t('requestFailed');
        setTimeout(() => showToast.value = false, 1000);
    }
};

const imagea = ref('/images/vip1.png')
const imageb = ref('/images/vip2.png')
const imagec = ref('/images/vip3.png')

const userInfo = reactive({
    vip: '',
    date_card_num: '',
    balance: '',
    id: '',
});

const loadUserInfo = async () => {
    try {
        const u = localStorage.getItem('user') || '';
        if (!u) return;
        const user = JSON.parse(u);
        const userId = user.id || user.userId;

        const { data: res } = await request.post('/api/user/info', { user_id: userId });
        if (res.code === 1 && res.data) {
            const data = res.data;
            userInfo.balance = data.balance || '0'
            userInfo.date_card_num = data.date_card_num || '0'
            userInfo.vip = data.vip_level || ''
            userInfo.id = data.id || '';
        }
    } catch (err) { }
};

watch(() => route.path, () => {
    localStorage.setItem('last_path', route.path);
}, { immediate: true });

onMounted(() => {
    loadUserInfo()
    getVipList()
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
    width: 100%;
    min-height: 100%;
    padding-bottom: 10px;
}

/* ========== 你的原有样式 保留 ========== */
.vipall {
    /* background-color: #181818; */
    padding: 15px 20px;
    height: 100%;
}

.viptext {
    display: flex;
    flex-direction: row;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 0 1px 1px rgb(20, 20, 20);
    margin-bottom: 15px;
    background-color: #1f1f1f;
}

.upgrade {
    /* width: 15%;  */
    background-color: #a1a1a1;
    font-size: 12px;
    height: 25px;
    margin-top: 17.5px;
    border-radius: 50px;
    line-height: 25px;
    padding: 0 10px;
    color: #000;
    cursor: pointer;
    text-align: center;
}

.upgrade--active {
    background-color: #a1a1a1;

    box-shadow: 0 0 1px 1px rgb(20, 20, 20);
}

.upgrade--disabled {
    background-color: #272727;
    box-shadow: 0 0 1px 1px rgb(20, 20, 20);
    pointer-events: none;
}

.copy-toastas {
    position: fixed;
    width: 100%;
    min-width: 200px;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    display: flex;
    flex-direction: column;
    z-index: 9999;
}

.buttdgr {
    background-color: #71a761;
    padding: 8px;
    border-radius: 7px;
    text-align: center;
    color: #fff;
    flex: 1;
}

.buttdgraa {
    background-color: #cc7c21;
    padding: 8px;
    border-radius: 7px;
    text-align: center;
    color: #fff;
    flex: 1;
}

.copy-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(75, 74, 74, 0.8);
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    z-index: 9999;
    min-width: 200px;
}
.form-inputtext {
    padding: 5px 15px;
    font-size: 16px;
    font-weight: 800;
    color: #000;
    text-align: center;
    outline: none;
    transition: border-color 0.3s;
    background-color: #f1f1f1;
    border: none;
    border-radius: 4px;
    height: 30px;
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
    background: #222 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    overscroll-behavior: none !important;
}
</style>