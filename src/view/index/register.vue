<template>
    <div class="main"
        style="background: url(../../assets/images/bg.jpg) no-repeat center center; background-size: cover; min-height: 100vh;">
        <div class="register-container">
            <div class="register-all">
                <div class="register-alltop">
                    <div class="register-alltopone" @click="showLangPanel = true"
                        style="cursor: pointer; user-select: none;">
                        <Icon icon="ic:baseline-language" height="20" />
                        <div style="margin-left: 5px;">{{ currentLangName }}</div>
                    </div>
                </div>

                <h1 class="register-title">{{ $t('registerAccount') }}</h1>

                <form class="register-form" @submit.prevent="handleSubmit">
                    <div class="form-item">
                        <input type="text" v-model="formData.username" class="form-input" :placeholder="$t('username')"
                            :class="{ invalid: formError.username }" />
                        <p class="error-text" v-if="formError.username">{{ formError.username }}</p>
                    </div>
                    <div style="font-size: 11px; margin-bottom: 20px; color: #999">{{ $t('usernameTip') }}</div>

                    <div class="form-item">
                        <div style="position: relative">
                            <input :type="showPwd ? 'text' : 'password'" v-model="formData.pwd" class="form-input"
                                :placeholder="$t('password')" :class="{ invalid: formError.pwd }" />
                            <span @click.stop="showPwd = !showPwd"
                                style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; z-index: 999; color: #fff;">
                                <Icon :icon="showPwd ? 'mdi:eye-off' : 'mdi:eye'" height="20" color="#ffffff" />
                            </span>
                        </div>
                        <p class="error-text" v-if="formError.pwd">{{ formError.pwd }}</p>
                    </div>
                    <div style="font-size: 11px; margin-bottom: 20px; color: #999">{{ $t('passwordTip') }}</div>

                    <!-- 滑块验证 同登录页逻辑 -->
                    <div class="slider-verify" ref="sliderWrap">
                        <div class="slider-block" :style="{ left: sliderLeft + 'px' }" @mousedown="onDragStart"
                            @touchstart="onDragStart">
                            <Icon icon="mdi:arrow-right" color="#fff" />
                        </div>
                        <div class="slider-tips">{{ sliderTips }}</div>
                    </div>

                    <div class="form-item checkbox-item">
                        <input type="checkbox" v-model="formData.agree" id="agree-terms"
                            :class="{ invalid: formError.agree }" />
                        <label for="agree-terms"
                            style="font-size: 12px; text-align: left; color: #999; margin-bottom: 20px">
                            {{ $t('agree') }}
                        </label>
                        <p class="error-text" v-if="formError.agree">{{ formError.agree }}</p>
                    </div>

                    <div class="submit-btn" @click="handleSubmit" :disabled="loading">
                        {{ loading ? $t('registering') : $t('register') }}
                    </div>

                    <div style="margin-top: 20px; font-size: 13px; color: #999; cursor: pointer; user-select: none"
                        @click="loginto">
                        {{ $t('login') }}
                    </div>
                </form>
            </div>
        </div>

        <div v-if="showLangPanel" class="language-all" @click="showLangPanel = false">
            <div v-if="showLangPanel" class="language" @click.stop>
                <div class="language-text" @click.stop="chooseLang('en')">{{ $t('english') }}</div>
                <div class="language-text" @click.stop="chooseLang('zh')">{{ $t('traditionalChinese') }}</div>
                <div style="height: 30px"></div>
            </div>
        </div>

        <div v-if="alertVisible" class="custom-modal" @click="alertVisible = false">
            <div class="modal-box" @click.stop>
                <div class="close-btn" @click="alertVisible = false">×</div>
                <div class="modal-text">{{ alertMsg }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t, locale } = useI18n()

interface RegisterForm {
    username: string
    pwd: string
    agree: boolean
}

interface FormError {
    username: string
    pwd: string
    agree: string
    inviteryou_code: string
}

interface RegisterResponse {
    code: number
    msg: string
}

// 邀请码
const inviteryouCode = ref('')

const formData = ref<RegisterForm>({
    username: '',
    pwd: '',
    agree: false
})
const showPwd = ref<boolean>(false)
const formError = ref<FormError>({
    username: '',
    pwd: '',
    agree: '',
    inviteryou_code: ''
})
const showLangPanel = ref<boolean>(false)
const loading = ref<boolean>(false)
const alertVisible = ref<boolean>(false)
const alertMsg = ref<string>('')

let autoCloseTimer: number | null = null

// ========== 滑块验证变量（和登录页完全一致） ==========
const sliderWrap = ref<HTMLDivElement | null>(null)
const sliderLeft = ref(0)
const isDragging = ref(false)
const isVerified = ref(false)
const sliderTips = ref('')
let targetX = 0
let wrapWidth = 0
const blockWidth = 44
const tolerance = 12
let startX = 0

// 自动读取地址栏邀请码 + 清空对应错误提示
onMounted(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code') || url.searchParams.get('invite') || ''
    if (code) {
        inviteryouCode.value = code
        formError.value.inviteryou_code = ''
    }
    // 初始化滑块
    initSlider()
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', onDragEnd)
    window.addEventListener('touchmove', onDragMove, { passive: false })
    window.addEventListener('touchend', onDragEnd)
})

onUnmounted(() => {
    if (autoCloseTimer) window.clearTimeout(autoCloseTimer)
    // 移除滑块全局事件
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', onDragEnd)
    window.removeEventListener('touchmove', onDragMove)
    window.removeEventListener('touchend', onDragEnd)
})

// 弹窗提示
const showToast = (msg: string): void => {
    alertMsg.value = msg
    alertVisible.value = true
    if (autoCloseTimer) window.clearTimeout(autoCloseTimer)
    autoCloseTimer = window.setTimeout(() => alertVisible.value = false, 2000)
}

const loginto = (): void => {
    void router.push('/login')
}

const currentLangName = computed(() => {
    const map: Record<string, string> = {
        en: t('language'),
        zh: t('language'),
    }
    return map[locale.value]
})

const chooseLang = (key: string): void => {
    locale.value = key
    localStorage.setItem('lang', key)
    showLangPanel.value = false
}

// ========== 滑块验证逻辑（复用登录页逻辑） ==========
const initSlider = async () => {
    await nextTick()
    if (!sliderWrap.value) return
    wrapWidth = sliderWrap.value.offsetWidth
    const maxMove = wrapWidth - blockWidth
    targetX = Math.floor(maxMove * 0.6 + Math.random() * (maxMove * 0.3))
    sliderLeft.value = 0
    isVerified.value = false
    sliderTips.value = t('sliderTipDefault')
}

const onDragStart = (e: MouseEvent | TouchEvent) => {
    if (isVerified.value) return
    isDragging.value = true
    startX = 'touches' in e ? e.touches[0].clientX : e.clientX
}

const onDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !sliderWrap.value) return
    if ('touches' in e) e.preventDefault()

    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const diff = currentX - startX
    const maxMove = wrapWidth - blockWidth
    let moveX = diff
    if (moveX <= 0) moveX = 0
    if (moveX >= maxMove) moveX = maxMove
    sliderLeft.value = moveX
}

const onDragEnd = () => {
    if (!isDragging.value) return
    isDragging.value = false
    const maxMove = wrapWidth - blockWidth

    if (Math.abs(sliderLeft.value - targetX) < tolerance || sliderLeft.value >= maxMove - 5) {
        isVerified.value = true
        sliderTips.value = t('sliderTipSuccess')
    } else {
        sliderTips.value = t('sliderTipFail')
        setTimeout(() => {
            sliderLeft.value = 0
            initSlider()
        }, 600)
    }
}

// 表单校验
const validateForm = (): boolean => {
    formError.value = { username: '', pwd: '', agree: '', inviteryou_code: '' }
    let isValid = true
    const reg = /^[a-zA-Z0-9]{6,20}$/

    if (!formData.value.username) {
        formError.value.username = t('usernameTip')
        isValid = false
    } else if (!reg.test(formData.value.username)) {
        formError.value.username = t('pwdRule')
        isValid = false
    }

    if (!formData.value.pwd) {
        formError.value.pwd = t('passwordTip')
        isValid = false
    } else if (!reg.test(formData.value.pwd)) {
        formError.value.pwd = t('pwdRule')
        isValid = false
    }

    if (!formData.value.agree) {
        formError.value.agree = t('agreeMsg')
        isValid = false
    }

    return isValid
}

// 注册提交
const handleSubmit = async (): Promise<void> => {
    // 先校验表单
    if (!validateForm()) return
    // 校验滑块
    if (!isVerified.value) {
        showToast(t('needSliderVerify'))
        return
    }

    try {
        loading.value = true

        const { data: res } = await request.post<RegisterResponse>('/api/register', {
            username: formData.value.username,
            password: formData.value.pwd,
            fund_password: formData.value.pwd,
            agree: formData.value.agree,
            inviteryou_code: 'AAAAAA'
        })
        if (res.code === 0) {
            showToast(t('requiredcode'))
            initSlider()
            return
        }

        showToast(t('registerSuccess'))
        formData.value = { username: '', pwd: '', agree: false }
        inviteryouCode.value = ''
        void router.push('/login')

    } catch (err: any) {
        const msg = err?.response?.data?.msg || t('registerFailed')
        showToast(msg)
        initSlider()
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
@import '../../assets/css/login.css';

/* 滑块样式 完全和登录页一致 */
.slider-verify {
  width: 100%;
  height: 44px;
  line-height: 44px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  margin: 20px 0 30px 0;
  position: relative;
  overflow: hidden;
  user-select: none;
}
.slider-block {
  width: 44px;
  height: 100%;
  background: #ef40ff;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  cursor: grab;
  transition: left 0.3s ease;
}
.slider-block:active {
  cursor: grabbing;
  transition: none;
}
.slider-tips {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #eee;
  pointer-events: none;
}
</style>