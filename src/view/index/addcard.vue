<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部标题：完全统一 -->
                <div class="allar-top">
                    <div @click="goBack" style="margin-left: 10px;cursor: pointer;color: #a88035;width: 30px;">
                        <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                    </div>
                    <div class="allar-top-a">{{ $t('addCard') }}</div>
                </div>

                <!-- 滚动内容区：完全统一 -->
                <div class="content-wrapper">
                    <div class="cuekdil">
                        <div class="vielsljkfgds">
                            <div>
                                <div class="texta">{{ $t('selectCurrency') }}</div>
                                <select class="form-input" v-model="selectedCurrency">
                                    <option value="" disabled selected>{{ $t('pleaseSelect') }}</option>
                                    <option v-for="item in source" :key="item.skjgk" :value="item.skjgk">
                                        {{ item.skjgk }}
                                    </option>
                                </select>
                            </div>
                            <div style="margin-top: 30px;">
                                <div class="texta">{{ $t('walletAddress') }}</div>
                                <div color="input">
                                    <input class="form-inputa" v-model="searchKey" :placeholder="$t('pleaseEnter')" />
                                </div>
                            </div>
                            <div class="textbutt" @click="submit">{{ $t('submit') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="copy-toast" v-if="showToast">
            <div style="font-size: 30PX;">
                <Icon icon="iconoir:xmark" width="58" v-if="!yesno" />
                <Icon icon="iconoir:check" width="58" v-if="yesno" />
            </div>
            <div class="toast-text" style="font-size: 16px;">{{ showtext }}</div>
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

const goBack = () => router.back();

const selectedCurrency = ref<string>('');
const searchKey = ref<string>('');
const showToast = ref<boolean>(false);
const showtext = ref<string>('');
const yesno = ref<boolean>(false);

const source = ref([
  { skjgk: 'USDC-ERC20' },
  { skjgk: 'USDC-TRC20' },
  { skjgk: 'USDC-BRC20' },
  { skjgk: 'USDT-ERC20' },
  { skjgk: 'USDT-TRC20' },
  { skjgk: 'USDT-BRC20' },
]);

const submit = async () => {
  if (!selectedCurrency.value) {
    showtext.value = t('selectCurrencyTip');
    showToast.value = true;
    yesno.value = false;
    setTimeout(() => showToast.value = false, 2000);
    return;
  }

  if (!searchKey.value.trim()) {
    showtext.value = t('enterWalletAddressTip');
    showToast.value = true;
    yesno.value = false;
    setTimeout(() => showToast.value = false, 2000);
    return;
  }

  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    const userId = user.id;

    if (!userId) {
      showtext.value = t('loginFailed');
      showToast.value = true;
      yesno.value = false;
      setTimeout(() => showToast.value = false, 2000);
      return;
    }

    await request.post('/api/wallet/add', {
      user_id: userId,
      coin_type: selectedCurrency.value,
      wallet_address: searchKey.value.trim(),
    });

    showtext.value = t('addSuccess');
    showToast.value = true;
    yesno.value = true;
    setTimeout(() => {
      showToast.value = false;
      router.push('/cardlist');
    }, 1000);

  } catch (err) {
    showtext.value = t('registerFailed');
    showToast.value = true;
    yesno.value = false;
    setTimeout(() => showToast.value = false, 2000);
  }
};

watch(() => route.path, () => {
  localStorage.setItem('last_path', route.fullPath);
}, { immediate: true });

onMounted(() => {
  const last = localStorage.getItem('last_path');
  if (last && route.path === '/') {
    router.replace(last);
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
}

.cuekdil {
    width: 100%;
    min-height: 100%;
    background: #222;
}

/* ========== 你的原有样式 保留 ========== */
.vielsljkfgds {
    height: 100%;
    padding: 20px;
}

select.form-input {
    width: 100%;
    height: 38px;
    padding: 0 15px;
    border: 1px solid #8d8d8d;
    border-radius: 5px;
    font-size: 12px;
    color: #ffffff;
    box-sizing: border-box;
    outline: none;
    background-color: #474447;
    margin-top: 15px;
    cursor: pointer;
}

.form-inputa {
    width: 100%;
    height: 38px;
    padding: 0 15px;
    border: 1px solid #8d8d8d;
    border-radius: 5px;
    font-size: 12px;
    color: #ffffff;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.3s;
    background-color: #474447;
    margin-top: 15px;
}

.form-inputa.invalid {
    border-color: #f53f3f;
}

.form-inputa:focus {
    border-color: #ffffff;
}

.form-inputa::placeholder {
    color: #999;
}

.texta {
    color: #e390fc;
    text-align: left;
    font-size: 12px;
}

.textbutt {
    margin-top: 50px;
    background: linear-gradient(360deg, #e859f5, #eda5fc);
    text-align: center;
    border-radius: 50px;
    padding: 8px 15px;
    font-weight: 900;
    cursor: pointer;
}

.textbutt:hover {
    background: linear-gradient(360deg, #b147bb, #eda5fc);
}

.copy-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(75, 74, 74, 0.774);
    color: #fff;
    padding: 20px 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 9999;
    font-size: 12px;
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