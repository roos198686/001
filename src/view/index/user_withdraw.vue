<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <div class="allar-top">
                    <div @click="goBack" style="margin-left: 10px;cursor: pointer;color: #a88035;width: 40px;">
                        <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                    </div>
                    <div class="allar-top-a">{{ $t('pointExchange') }}</div>
                    <div @click="cardlist" style="cursor: pointer;color: #a88035;width: 50px;">
                        <Icon icon="basil:wallet-solid" width="23" />
                    </div>
                </div>

                <div class="content-wrapper">
                    <div class="cuekdil">
                        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;">
                            <div style="width:100%;">
                                <input class="form-input" v-model="searchKey"
                                    :placeholder="!userInfo.balance ? $t('maxWithdraw') + '0' : $t('maxWithdraw') + userInfo.balance" />
                            </div>
                            <div style="width:100%;margin-bottom:15px;">
                                <input class="form-input" v-model="searchPassword" type="password"
                                    :placeholder="$t('fundPassword')" />
                            </div>
                            <div class="form-input-text" v-if="showList.length === 0" @click="cardlist">
                                {{ $t('noWithdrawAddress') }}
                            </div>
                        </div>

                        <div style="margin-top:5px;color:#fff;font-size:14px;text-align:left;padding:10px 25px;">
                            <div style="line-height:30px;">{{ $t('balance') }}：{{ userInfo.balance || 0 }}</div>
                            <div>{{ $t('name') }}：{{ userInfo.username }}</div>

                            <div class="showlistatall" v-if="showList.length > 0">
                                <div v-for="item in showList" :key="item.id" class="showlistat"
                                    :class="{ active: selectedId === item.id }">
                                    <div style="font-weight:800;color:#fff;width:100px;">{{ item.coin_type }}</div>
                                    <div>{{ item.wallet_address.slice(0, 5) + '*********' + item.wallet_address.slice(-5) }}</div>
                                    <input type="radio" name="taemGroup" :value="item.id" v-model="selectedId" style="margin-left:auto;" />
                                </div>
                            </div>

                            <div class="submit" @click="submit" v-if="showList.length != 0">{{ $t('submit') }}</div>
                        </div>

                        <div style="margin-top:5px;font-size:12px;text-align:left;padding:10px 25px;height:100%;">
                            <div style="line-height:25px;color:#999;">{{ $t('friendlyReminder') }}:</div>
                            <div style="line-height:25px;color:#999;">{{ $t('minWithdraw') }}：$100</div>
                            <div style="line-height:25px;color:#999;">{{ $t('maxWithdraw') }}：${{ userInfo.balance || 0 }}</div>
                            <div style="line-height:25px;color:#999;">{{ $t('verifyAddress') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="copy-toast" v-if="showToast">
            <div style="font-size:30px;">
                <Icon icon="iconoir:xmark" width="58" v-if="!yesno" />
                <Icon icon="iconoir:check" width="58" v-if="yesno" />
            </div>
            <div class="toast-text" style="font-size:16px;">{{ $t(showtext) }}</div>
        </div>

        <!-- 设置资金密码弹窗 -->
        <div class="copy-toastqwpjg-mask" v-if="showSetPwdDialog" style="z-index: 99999;">
            <div class="copy-toastqwpjg" style="padding: 20px; z-index: 999999;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color:#fff;">
                    {{ $t('setFundPassword') }}
                </div>

                <el-input v-model="newPwd" type="password" :placeholder="$t('enterNewPwd')" show-password
                          style="width: 250px; margin-bottom: 10px;" />
                <el-input v-model="confirmPwd" type="password" :placeholder="$t('confirmPwd')" show-password
                          style="width: 250px; margin-bottom: 20px;" />

                <div style="display: flex; gap: 15px; width: 250px;">
                    <div class="buttdgr" @click="showSetPwdDialog = false">
                        {{ $t('cancel') }}
                    </div>
                    <div class="buttdgraa" @click="submitSetFundPwd">
                        {{ $t('confirmSet') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import request from '@/utils/request';
import { ElInput } from 'element-plus';

const showSetPwdDialog = ref(false)
const newPwd = ref('')
const confirmPwd = ref('')
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const showToast = ref(false);
const searchKey = ref('');
const searchPassword = ref('');
const selectedId = ref('');
const yesno = ref(false);
const showtext = ref('');

const userInfo = reactive({
    username: '',
    balance: '',
});

const loadUserInfo = async () => {
    try {
        const u = localStorage.getItem('user');
        if (!u) return;
        const user = JSON.parse(u);
        const userId = user.id || user.userId;

        const { data: res } = await request.post('/api/user/info', { user_id: userId });
        if (res.code === 1 && res.data) {
            userInfo.username = res.data.username || '';
            userInfo.balance = res.data.balance || '';
            localStorage.setItem('user', JSON.stringify(res.data));
        }
    } catch (err) { }
};

interface WalletItem {
    id: string | number;
    coin_type: string;
    wallet_address: string;
}

const showList = ref<WalletItem[]>([]);

const getWalletList = async () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const { data: res } = await request.post('/api/wallet/list', { user_id: user.id });
        if (res.code === 1) showList.value = res.data;
    } catch (err) { }
};

const goBack = () => router.back();
const cardlist = () => router.push('/cardlist');

const submit = async () => {
    if (!searchKey.value) {
        showtext.value = 'enterWithdrawAmount';
        yesno.value = false;
        showToast.value = true;
        setTimeout(() => showToast.value = false, 2000);
        return;
    }

    if (!searchPassword.value) {
        showtext.value = 'enterFundPassword';
        yesno.value = false;
        showToast.value = true;
        setTimeout(() => showToast.value = false, 2000);
        return;
    }

    if (!selectedId.value) {
        showtext.value = 'selectWalletAddress';
        yesno.value = false;
        showToast.value = true;
        setTimeout(() => showToast.value = false, 2000);
        return;
    }

    if (Number(userInfo.balance) < 100) {
        showtext.value = 'minWithdrawTip';
        yesno.value = false;
        showToast.value = true;
        setTimeout(() => showToast.value = false, 2000);
        return;
    }

    if (Number(userInfo.balance) < Number(searchKey.value)) {
        showtext.value = 'balanceInsufficient';
        yesno.value = false;
        showToast.value = true;
        setTimeout(() => showToast.value = false, 2000);
        return;
    }

    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const { data: res } = await request.post('/api/withdraw/submit', {
            user_id: user.id,
            wallet_id: selectedId.value,
            amount: searchKey.value,
            fund_password: searchPassword.value,
            type: 1,
        });

        // ========================
        // ✅ 修复：后端返回 code=1 才是成功
        // ========================
        if (res.code === 1) {
            showtext.value = 'submitSuccess';
            yesno.value = true;
            showToast.value = true;
            setTimeout(() => {
                router.push('/user_datingorders');
            }, 1500);
        } else {
            if (res.code === 403) {
                // 未设置资金密码 → 弹窗
                showSetPwdDialog.value = true;
            } else {
                // 其他错误走语言包
                showtext.value = res.msg;
                yesno.value = false;
                showToast.value = true;
            }
        }
    } catch (e) {
        showtext.value = 'submitFailed';
        yesno.value = false;
        showToast.value = true;
    }

    setTimeout(() => showToast.value = false, 2000);
};

const submitSetFundPwd = async () => {
  if (!newPwd.value.trim() || !confirmPwd.value.trim()) {
    showtext.value = t('pleaseEnterCompletePwd')
    yesno.value = false
    showToast.value = true
    setTimeout(() => showToast.value = false, 1500)
    return
  }

  if (newPwd.value !== confirmPwd.value) {
    showtext.value = t('pwdNotMatch')
    yesno.value = false
    showToast.value = true
    setTimeout(() => showToast.value = false, 1500)
    return
  }

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const { data } = await request.post('/api/user/set-fund-pwd', {
      user_id: user.id,
      pay_pwd: newPwd.value
    })

    if (data.code === 1) {
      showtext.value = t('setPwdSuccess')
      yesno.value = true
      showToast.value = true
      showSetPwdDialog.value = false  // ✅ 成功自动关闭弹窗
      newPwd.value = ''
      confirmPwd.value = ''
    } else {
      showtext.value = data.msg || t('setPwdFailed')
      yesno.value = false
      showToast.value = true
    }
  } catch (err) {
    showtext.value = t('setPwdFailed')
    yesno.value = false
    showToast.value = true
  }

  setTimeout(() => showToast.value = false, 1500)
}

onMounted(() => {
    getWalletList();
    loadUserInfo();
});

watch(() => route.path, () => {
    localStorage.setItem('last_path', route.fullPath);
}, { immediate: true });
</script>

<style scoped>
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
}

.content-wrapper {
    position: absolute;
    top: 45px;
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
    background: #1d1d1d;
}

.form-input {
    width: 90%;
    height: 38px;
    padding: 0 15px;
    border: 1px solid #8d8d8d;
    border-radius: 5px;
    font-size: 14px;
    color: #fff;
    background: #474447;
    margin-top: 15px;
    box-sizing: border-box;
}

.form-input-text {
    width: 90%;
    height: 38px;
    border: 1px solid #8d8d8d;
    border-radius: 50px;
    font-size: 14px;
    line-height: 38px;
    color: #740950;
    font-weight: 800;
    background: linear-gradient(360deg, #fa83e6 60%, #fff);
    cursor: pointer;
    margin-bottom: 15px;
    box-sizing: border-box;
}

.submit {
    height: 38px;
    border: 1px solid #8d8d8d;
    border-radius: 50px;
    font-size: 14px;
    line-height: 38px;
    color: #000;
    font-weight: 800;
    background: linear-gradient(360deg, #a39301 60%, #fff);
    text-align: center;
    cursor: pointer;
    margin: 15px 0;
    box-sizing: border-box;
}

.showlistatall {
    background: #313131;
    padding: 10px;
    font-size: 14px;
    border-radius: 5px;
    margin-top: 15px;
}

.showlistat {
    display: flex;
    align-items: center;
    color: #999;
    padding: 8px;
    gap: 10px;
}

.showlistat.active {
    background: #555;
    border-radius: 4px;
    color: #fae04c;
    font-weight: 900;
}

.copy-toast {
     position: fixed;
    top: 50%;
    left: 50%;
    min-width: 200px;
    transform: translate(-50%, -50%);
    background: rgba(75, 74, 74, 0.77);
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 999999;
}

::-webkit-scrollbar {
    display: none;
}

:global(html),
:global(body) {
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    overscroll-behavior: none !important;
}

.copy-toastqwpjg-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99999;
}

.copy-toastqwpjg {
    position: fixed;
    width: 320px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #2a2a2a;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 999999;
    border-radius: 10px;
    padding: 25px 20px;
}

.buttdgr {
    background-color: #71a761;
    padding: 8px 12px;
    border-radius: 7px;
    text-align: center;
    color: #fff;
    flex: 1;
    font-size: 14px;
    cursor: pointer;
}

.buttdgraa {
    background-color: #cc7c21;
    padding: 8px 12px;
    border-radius: 7px;
    text-align: center;
    color: #fff;
    flex: 1;
    font-size: 14px;
    cursor: pointer;
}
</style>