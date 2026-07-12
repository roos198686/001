<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部标题：完全统一 -->
                <div class="allar-top">
                    <div @click="goBack" style="margin-left: 10px;cursor: pointer;color: #a88035;width: 30px;">
                        <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                    </div>
                    <div class="allar-top-a">{{ $t('changeFundPassword') }}</div>
                </div>

                <!-- 滚动内容区：完全统一 -->
                <div class="content-wrapper">
                    <div class="cuekdil">
                        <div class="vielsljkfgds">
                            <div style="margin-top: 30px;">
                                <div class="texta">{{ $t('oldPassword') }}</div>
                                <input class="form-inputa" v-model="oldpassword" type="password" :placeholder="$t('oldPassword')" />
                            </div>
                            <div style="margin-top: 30px;">
                                <div class="texta">{{ $t('newPassword') }}</div>
                                <input class="form-inputa" v-model="newpassword" type="password" :placeholder="$t('newPassword')" />
                            </div>
                            <div style="margin-top: 30px;">
                                <div class="texta">{{ $t('confirmNewPassword') }}</div>
                                <input class="form-inputa" v-model="confirmpassword" type="password" :placeholder="$t('confirmNewPassword')" />
                            </div>
                            <div class="textbutt" @click="submit">{{ $t('confirm') }}</div>
                            <div style="color: #999;font-size: 12px;margin: 30px;">
                                {{ $t('fundPasswordNote') }}
                            </div>
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
import { useRoute } from 'vue-router';
import router from '../../router';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import request from '@/utils/request';

const { t } = useI18n();
const route = useRoute();
const goBack = () => router.go(-1);

const showToast = ref(false);
const showtext = ref('');
const yesno = ref(false);

const oldpassword = ref('');
const newpassword = ref('');
const confirmpassword = ref('');

const submit = async () => {
  if (!oldpassword.value.trim()) {
    showToast.value = true; yesno.value = false; showtext.value = t('enterOldPassword');
    setTimeout(() => showToast.value = false, 2000);
    return;
  }
  if (!newpassword.value.trim()) {
    showToast.value = true; yesno.value = false; showtext.value = t('enterNewPassword');
    setTimeout(() => showToast.value = false, 2000);
    return;
  }
  if (newpassword.value === oldpassword.value) {
    showToast.value = true; yesno.value = false; showtext.value = t('passwordSameAsOld');
    setTimeout(() => showToast.value = false, 2000);
    return;
  }
  if (!confirmpassword.value.trim()) {
    showToast.value = true; yesno.value = false; showtext.value = t('confirmNewPassword');
    setTimeout(() => showToast.value = false, 2000);
    return;
  }
  if (newpassword.value !== confirmpassword.value) {
    showToast.value = true; yesno.value = false; showtext.value = t('passwordNotMatch');
    setTimeout(() => showToast.value = false, 2000);
    return;
  }

  try {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    const user_id = userInfo.id;

    const { data: res } = await request.post('/api/updateFundPassword', {
      user_id,
      oldpassword: oldpassword.value,
      newpassword: newpassword.value,
      confirmpassword: confirmpassword.value
    });

    if (res.code === 1) {
      showToast.value = true;
      yesno.value = true;
      showtext.value = t('passwordModifySuccess');

      setTimeout(() => {
        showToast.value = false;
        router.push('/user');
      }, 1200);
    } else {
      showToast.value = true;
      yesno.value = false;
      showtext.value = t(res.msg);
      setTimeout(() => showToast.value = false, 2000);
    }
  } catch (err) {
    showToast.value = true;
    yesno.value = false;
    showtext.value = t('requestFailed');
    setTimeout(() => showToast.value = false, 2000);
  }
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

.form-inputa {
    width: 100%;
    height: 38px;
    padding: 0 15px;
    border: 1px solid #8d8d8d;
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.3s;
    background-color: #474447;
    margin-top: 5px;
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
    font-size: 14px;
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
    min-width: 200px;
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
    font-size: 14px;
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