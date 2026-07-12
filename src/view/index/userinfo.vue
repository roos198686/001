<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部标题：统一 fixed + 返回箭头 -->
                <div class="allar-top">
                    <div @click="goBack" style="margin-left: 10px;cursor: pointer;color: #a88035;width: 30px;">
                        <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                    </div>
                    <div class="allar-top-a">{{ $t('userInfo') }}</div>
                </div>

                <!-- 中间滚动区域：完全统一 -->
                <div class="content-wrapper">
                    <div class="cuekdil">
                        <!-- <div class="list-wrapper"> -->
                        <div :style="nameareva" class="jkfosll">
                            <div class="username-avatar">
                                <img :src="username.avatar" alt="avatar" />
                                <!-- 修改/保存文字嵌套进头像内部 -->
                                <div class="avatar-btn-wrap">
                                    <div class="avatext" style="font-size: 11px;" @click="avatext" v-if="!showSaveBtn">
                                        {{ $t('modify') }}
                                    </div>
                                    <div class="avatext" style="font-size: 11px;" v-if="showSaveBtn"
                                        @click="saveAvatar">
                                        {{ $t('saveAvatar') }}
                                    </div>
                                </div>
                            </div>

                            <div style="text-align: right;margin-left: auto;margin-right: 15px;">
                                <div style="font-size: 11px;background-color: #a88035;color: #fff;padding: 2px 5px;border-radius: 5px;" @click="avatext" v-if="!showSaveBtn">{{
                                    $t('modify') }}</div>
                                <div style="font-size: 11px;" v-if="showSaveBtn" @click="saveAvatarbg">
                                    {{ $t('saveAvatar') }}
                                </div>
                            </div>
                        </div>
                        <div class="jkfosllaqw">
                            <div>{{ $t('profile') }}</div>
                            <div class="avatext" style="text-align: right;margin-left: auto;" @click="openEditProfile"
                                v-if="username.rolelevel > '0'">{{ $t('profile') }}</div>
                        </div>
                        <div class="jkfosllaqw">
                            <div>{{ $t('nickname') }}：{{ username.nickname }}</div>
                            <div class="avatext" style="text-align: right;margin-left: auto;" @click="nickname">{{
                                $t('modify') }}</div>
                        </div>
                        <div class="jkfosllaqw">
                            <div>{{ $t('username') }}：@{{ username.name }}</div>
                            <div class="avatext" style="text-align: right;margin-left: auto;background-color: #333;">{{
                                $t('modify') }}</div>
                        </div>

                        <div class="jkfosllaqw">
                            <div>{{ $t('loginPassword') }}</div>
                            <div class="avatext" style="text-align: right;margin-left: auto;" @click="password">{{
                                $t('modify') }}</div>
                        </div>
                        <div class="jkfosllaqw">
                            <div>{{ $t('fundPassword') }}</div>
                            <div class="avatext" style="text-align: right;margin-left: auto;" @click="fundpassword">{{
                                $t('modify') }}</div>
                        </div>

                        <div class="cardlist-bottom">
                            <div class="cardlist-add" @click="addcard">{{ $t('logout') }}</div>
                        </div>
                        <!-- </div> -->
                    </div>
                </div>
            </div>
        </div>

        <!-- 昵称弹窗 -->
        <div v-if="showNicknameInput" class="nickname-box">
            <div class="nickname-all">
                <input v-model="nicknameValue" class="nick-input" :placeholder="$t('enterNickname')" />
                <div class="nick-btns">
                    <div class="cancel-btn" @click="showNicknameInput = false">{{ $t('cancel') }}</div>
                    <div class="confirm-btn" @click="saveNickname">{{ $t('save') }}</div>
                </div>
            </div>
        </div>

        <input ref="fileInput" type="file" accept="image/*" style="display: none;" @change="handleAvatarChange" />

        <!-- 提示 toast -->
        <div class="copy-toast" v-if="showToast">
            <div style="font-size: 30px;">
                <Icon icon="iconoir:check" width="58" />
            </div>
            <div class="toast-text" style="font-size: 16px;">{{ $t('updateSuccess') }}</div>
        </div>

        <!-- 编辑资料弹窗 -->
        <div class="first-login-modal" v-if="rolelevel">
            <div class="modal-mask"></div>
            <div class="modal-content">
                <div style="background:#dad9d9;border-radius:7px 7px 0 0;padding:15px;">
                    <div style="font-size:15px;margin-bottom:5px;color:#000;">{{ $t('personalProfile') }}</div>
                </div>

                <div style="padding:0 20px;">
                    <div style="padding:5px 0;display: flex;align-items: center;gap:10px;">
                        <div>{{ $t('gender') }}</div>
                        <div>
                            <label><input type="radio" name="gender" v-model="profile.gender" value="1"><span>{{
                                $t('male') }}</span></label>
                            <label><input type="radio" name="gender" v-model="profile.gender" value="2"><span>{{
                                $t('female') }}</span></label>
                        </div>
                    </div>

                    <div style="padding:5px 0;display: flex;align-items: center;gap:10px;">
                        <div>{{ $t('sexualOrientation') }}</div>
                        <div>
                            <label><input type="radio" name="sexual" v-model="profile.sexual" value="1"><span>{{
                                $t('straight') }}</span></label>
                            <label><input type="radio" name="sexual" v-model="profile.sexual" value="0"><span>{{
                                $t('gay') }}</span></label>
                        </div>
                    </div>

                    <div style="padding:5px 0;display: flex;align-items: center;gap:10px;">
                        <div>{{ $t('age') }}</div>
                        <input v-model="profile.age" class="nick-inputaa" :placeholder="$t('age')" />
                    </div>

                    <div style="padding:5px 0;display: flex;align-items: center;gap:10px;">
                        <div>{{ $t('height') }}</div>
                        <input v-model="profile.height" class="nick-inputaa" :placeholder="$t('height')" />
                    </div>

                    <div style="padding:5px 0;display: flex;align-items: center;gap:10px;">
                        <div>{{ $t('figure') }}</div>
                        <select v-model="profile.figure" class="nick-inputaa"
                            style="flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="" disabled selected>{{ $t('figure') }}</option>
                            <option value="G+">G+</option>
                            <option value="F">F</option>
                            <option value="E(DD)">E(DD)</option>
                            <option value="D">D</option>
                            <option value="C">C</option>
                            <option value="B">B</option>
                            <option value="A">A</option>
                        </select>
                    </div>

                    <div style="padding:5px 0;display: flex;align-items: center;gap:10px;">
                        <div>{{ $t('city') }}</div>
                        <input v-model="profile.city" class="nick-inputaa" :placeholder="$t('city')" />
                    </div>

                    <div style="padding:5px 0;">
                        <div style="margin-bottom:5px;">{{ $t('intro') }}</div>
                        <textarea v-model="profile.intro" class="intro-input" :placeholder="$t('intro')"></textarea>
                    </div>

                    <div style="display:flex;justify-content:center;padding:15px 0 20px 0;gap: 10px;">
                        <div class="modal-btna" @click="rolelevel = false">{{ $t('cancel') }}</div>
                        <div class="modal-btn" @click="submitProfile">{{ $t('confirm') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../router';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import request from '@/utils/request';

const { t } = useI18n();
const route = useRoute();
const goBack = () => router.go(-1);
const showToast = ref(false);
const rolelevel = ref(false);
const yesno = ref(false);
const showtext = ref('');

const nameareva = computed(() => {
    // 有自定义背景用用户图，没有用默认底图
    let bgFullUrl: string;
    if (username.avatar_bg) {
        // 有自定义背景：拼接接口域名
        bgFullUrl = baseURL + username.avatar_bg;
    } else {
        // 无自定义：使用本地默认背景
        bgFullUrl = '/images/userbg.png';
    }
    return {
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `url(${bgFullUrl})`, // 关键套url()
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }
})
const username = reactive({
    id: '',
    name: '',
    avatar: '',
    nickname: '',
    rolelevel: '',
    avatar_bg: ''
});

const profile = reactive({
    gender: '',
    age: '',
    sexual: '',
    height: '',
    figure: '',
    city: '',
    intro: ''
})

const submitProfile = async () => {
    if (!profile.gender) {
        showtext.value = t('pleaseSelectGender')
        yesno.value = true
        return
    }
    if (!profile.age) {
        showtext.value = t('pleaseEnterAge')
        yesno.value = true
        return
    }
    if (!profile.height) {
        showtext.value = t('pleaseEnterHeight')
        yesno.value = true
        return
    }

    try {
        const { data: res } = await request.post('/api/userinfo/updateProfile', {
            user_id: username.id,
            gender: profile.gender,
            age: profile.age,
            sexual: profile.sexual,
            height: profile.height,
            figure: profile.figure,
            city: profile.city,
            intro: profile.intro
        })

        if (res.code === 1) {
            showtext.value = t('saveSuccess')
            yesno.value = true
            rolelevel.value = false
            loadUserInfo()
        } else {
            showtext.value = t('saveFailed')
            yesno.value = true
        }
    } catch (err) {
        showtext.value = t('saveFailed')
        yesno.value = true
    }
}

const fileInput = ref<HTMLInputElement | null>(null);
const showSaveBtn = ref(false);
const baseURL = request.defaults.baseURL || ''

const avatext = () => {
    fileInput.value?.click();
};

const handleAvatarChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    username.avatar = url;
    showSaveBtn.value = true;
};

const saveAvatarbg = async () => {
    try {
        const formData = new FormData();
        const file = fileInput.value?.files?.[0];
        if (!file) return;

        formData.append('avatar_file', file);
        formData.append('user_id', username.id);

        const { data: res } = await request.post('/api/avatar_bg', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.code === 1) {
            showSaveBtn.value = false;
            showToast.value = true;
            setTimeout(() => showToast.value = false, 1000);
            username.avatar_bg = baseURL + res.data.avatar_bg
        }
        loadUserInfo()
    } catch (err) {
        console.log(err);
    }
};
const saveAvatar = async () => {
    try {
        const formData = new FormData();
        const file = fileInput.value?.files?.[0];
        if (!file) return;

        formData.append('avatar_file', file);
        formData.append('user_id', username.id);

        const { data: res } = await request.post('/api/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.code === 1) {
            showSaveBtn.value = false;
            showToast.value = true;
            setTimeout(() => showToast.value = false, 1000);
            username.avatar = baseURL + res.data.avatar
        }
        loadUserInfo()
    } catch (err) {
        console.log(err);
    }
};
const showNicknameInput = ref(false);
const nicknameValue = ref(username.name);

const nickname = () => {
    showNicknameInput.value = true;
};

const saveNickname = async () => {
    if (!nicknameValue.value.trim()) return;

    try {
        const { data: res } = await request.post('/api/updateNickname', {
            user_id: username.id,
            nickname: nicknameValue.value.trim()
        });

        if (res.code === 1) {
            username.name = nicknameValue.value.trim();
            showNicknameInput.value = false;
            showToast.value = true;
            setTimeout(() => showToast.value = false, 1000);
        }
        loadUserInfo()
    } catch (err) {
        console.log(err);
    }
};
const addcard = async () => {
    try {
        // 1. 解析本地用户信息，获取用户ID
        const userStr = localStorage.getItem('user');
        let userId = '';
        if (userStr) {
            const userInfo = JSON.parse(userStr);
            userId = userInfo.id;
        }

        // 有用户ID才请求登出接口，重置数据库状态
        if (userId) {
            const { data: res } = await request.post('/api/user/userlogout', {
                userId: userId
            });
        }
    } catch (err) {
        console.log(err);
    }

    // 2. 清空前端所有缓存
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('home_has_loaded')
    localStorage.removeItem('mall_scroll_top');
    localStorage.removeItem('mall_list_cache');
    sessionStorage.clear();

    // 3. 跳转到登录页
    router.push('/login');
};

const fundpassword = () => router.push('/user_resrtpaypass');
const password = () => router.push('/user_resetpass');

const loadUserInfo = async () => {
    try {
        const u = localStorage.getItem('user') || '';
        if (!u) return;
        const user = JSON.parse(u);
        const userId = user.id || user.userId;

        const { data: res } = await request.post('/api/user/info', { user_id: userId });
        if (res.code === 1 && res.data) {
            const data = res.data;
            username.id = data.id || '';
            username.name = data.username || '';
            username.nickname = data.nickname || '';
            username.avatar = baseURL + (data.avatar || '');
            username.rolelevel = data.role_level || '';
            username.avatar_bg = data.avatar_bg || ''
        }
    } catch (err) { }
};

const openEditProfile = async () => {
    rolelevel.value = true
    try {
        const { data: res } = await request.post('/api/user/info', {
            user_id: username.id
        })
        if (res.code === 1 && res.data) {
            const d = res.data
            profile.gender = d.gender || ''
            profile.age = d.age || ''
            profile.sexual = d.sexual || ''
            profile.height = d.height || ''
            profile.figure = d.figure || ''
            profile.city = d.city || ''
            profile.intro = d.intro || ''
        }
    } catch (err) { }
}

onMounted(() => {
    loadUserInfo()
});
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

/* ========== 原有业务样式保留 ========== */
.username-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #414141;
    margin: 0 10px 0 20px;
    position: relative;
}

.username-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.jkfosll {
    display: flex;
    align-items: center;
    /* gap: 15px; */
    /* padding:15px 0; */
    flex-direction: row;
    /* justify-content: center; */
    border-bottom: 5px solid #000;
}

.avatar-btn-wrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    /* 黑色半透明底色，文字更清晰 */
}

.avatext {
    color: #fff;
    /* background-color: rgb(54, 54, 54); */
    /* padding: 3px 10px;
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid #000000;
    font-size: 13px;
    margin: 5px 0; */
    cursor: pointer;
    text-align: center;
}

.avatext:hover {
    background-color: rgb(99, 98, 98);
}

.jkfosllaqw {
    display: flex;
    padding: 10px 20px;
    border-bottom: 1px solid #000;
    color: #b9b8b8;
    font-size: 15px;
    align-items: center;
}

.nickname-box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    border-radius: 8px;
    z-index: 9999;
    font-size: 15px;
    width: 100%;
    max-width: 500px;
}

.nickname-all {
    width: 90%;
    height: 200px;
    background: rgb(75, 74, 74);
    border-radius: 5px;
    margin: 0 auto;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.nick-input {
    padding: 50px;
    width: 80%;
    height: 40px;
    background: #333;
    border: none;
    border-radius: 6px;
    color: #fff;
    margin-bottom: 10px;
    padding: 0 10px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.nick-inputaa {
    flex: 1;
    height: 30px !important;
    background: #ffffff !important;
    border: 1px solid #ccc !important;
    border-radius: 6px !important;
    color: #000 !important;
    padding: 0 10px !important;
    outline: none !important;
}

.intro-input {
    width: 100%;
    height: 100px;
    background: #fff;
    border: 1px solid #cccccc;
    border-radius: 6px;
    padding: 8px;
    font-size: 15px;
    box-sizing: border-box;
    resize: none;
}

.nick-btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
}

.cancel-btn {
    color: #e2e1e1;
    cursor: pointer;
    background-color: #3a7700;
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid #979797;
}

.confirm-btn {
    color: #000;
    cursor: pointer;
    background-color: #e2b521;
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid #cacaca;
}

.list-wrapper {
    width: 100%;
    background: #202020;
}

.cardlist-bottom {
    margin-top: 30px;
    padding: 15px 30px;
    color: #cc9b5a;
    font-weight: bold;
}

.cardlist-add {
    background: linear-gradient(360deg, #b19f01, #f1ec9a);
    padding: 7px;
    color: #000;
    border-radius: 50px;
    margin-bottom: 20px;
    text-align: center;
}

.cardlist-add:hover {
    background: linear-gradient(360deg, #746801, #d6d174);
    cursor: pointer;
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
    z-index: 9999;
    font-size: 15px;
}

/* 弹窗 */
.first-login-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: 500px;
    margin: 0 auto;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #2b2626ad;
}

.modal-content {
    background: #ffffff;
    color: #000;
    border-radius: 6px;
    width: 90%;
    position: relative;
    z-index: 1;
    font-size: 15px;
}

.modal-btn {
    background: #414040;
    padding: 6px 20px;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;
}

.modal-btna {
    background: #979797;
    padding: 6px 20px;
    border-radius: 4px;
    cursor: pointer;
    color: #000;
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