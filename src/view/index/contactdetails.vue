<template>
    <div class="main">
        <div class="chat-container">
            <div class="chat-header">
                <div class="header-left" @click="goBack">
                    <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                </div>
                <div class="header-info">
                    <div class="name">{{ userInfo.nickname }}</div>
                </div>
            </div>
            <div class="cukeisl">
                <div class="avatar">
                    <div class="avatar-xei">
                        <img :src="userInfo.avatar" alt="avatar" />
                    </div>

                    <div class="avatar-xeia">
                        <div class="avatar-xeia-aq">
                            <Icon icon="streamline-flex:heart-solid" height="50" style="cursor: pointer;" />
                            <div style="margin-left: 10px;">543254</div>
                        </div>
                        <div style="display: flex;flex-direction: row;">
                        <div class="verified" v-if="Number(userInfo.role_level) > 1">{{ $t('videoVerified') }}</div>
                        <div class="userteatb-oneb"
                            :class="!userInfo.vip_level || userInfo.vip_level == '0' ? 'userteatb-oneb-no' : 'userteatb-oneb'">
                            {{ !userInfo.vip_level || userInfo.vip_level == '0' ? $t('normalUser') : 'V' +
                            userInfo.vip_level}}
                        </div>
                        </div>
                    </div>
                </div>
                <div class="avatart">
                    <div class="avatartext">{{ $t('nickname') }}：{{ userInfo.nickname }}</div>
                    <div class="avatartext">{{ $t('userId') }}：{{ userInfo.id }}</div>
                    <div class="avatartext">{{ $t('height') }}：{{ userInfo.height }}</div>
                    <div class="avatartext">{{ $t('bust') }}：{{ userInfo.figure }}</div>
                    <div class="avatartext">{{ $t('residenceCity') }}：{{ userInfo.city }}</div>
                    <div class="avatartext">{{ $t('sexualOrientation') }}：{{ userInfo.sexual }}</div>
                    <div class="avatartext" style="word-break: break-all; white-space: pre-wrap; line-height:1.4;">
                        {{ $t('intro') }}：{{ userInfo.intro }}</div>
                </div>
                <div class="delete" @click="deleteuser">{{ $t('deleteContact') }}</div>
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
import { onMounted, reactive, ref } from 'vue';
import { Icon } from '@iconify/vue';
import router from '../../router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
import request from '@/utils/request';
const baseURL = request.defaults.baseURL || '';
const friendId = route.params.id;
const showToast = ref<boolean>(false);
const yesno = ref(false);
const showtext = ref('');
// 自己的ID
const getMyId = () => {
    const u = localStorage.getItem('user');
    if (!u) return 0;
    const user = JSON.parse(u);
    return user.id || user.userId || 0;
};

const userInfo = reactive({
    id: '',
    height: '',
    nickname: '',
    avatar: '',
    figure: '',
    city: '',
    sexual: '',
    intro: '',
    role_level: '',
    vip_level: ''
});

const loadUserInfo = async () => {
    try {

        const { data: res } = await request.post('/api/user/info', { user_id: friendId });
        if (res.code === 1 && res.data) {
            const data = res.data;
            userInfo.id = data.id || '';
            userInfo.height = data.height || '';
            userInfo.nickname = data.nickname || '';
            userInfo.avatar = baseURL + (data.avatar || '');
            userInfo.figure = data.figure || '';
            userInfo.city = data.city || '';
            userInfo.sexual = data.sexual || '';
            userInfo.intro = data.intro || '';
            userInfo.role_level = data.role_level || '';
            userInfo.vip_level = data.vip_level || '';
        }
    } catch (err) { }
};

const goBack = () => router.go(-1);

// 删除联系人（已完成）
const deleteuser = async () => {
    console.log(getMyId(), friendId)
    try {
        const { data } = await request.post('/api/chat/delete-contact', {
            user_id: getMyId(),
            friend_id: userInfo.id
        });

        if (data.code === 1) {
            showToast.value = true;
            yesno.value = true;
            showtext.value = t('deleteSuccess'); // 国际化
            setTimeout(() => {
                showToast.value = false;
                router.replace('/contacts');
            }, 1000);
        } else {
            showToast.value = true;
            yesno.value = false;
            showtext.value = t('deleteFailed'); // 国际化
            setTimeout(() => showToast.value = false, 1000);
        }
    } catch (err) {
        console.error(err);
        showToast.value = true;
        yesno.value = false;
        showtext.value = t('deleteFailed'); // 国际化
        setTimeout(() => showToast.value = false, 1000);
    }
};

onMounted(() => {
    loadUserInfo()

});
</script>

<style scoped>
/* 最外层：全屏固定，禁止滚动，溢出隐藏 */
.main {
    position: fixed;
    /* 固定定位，彻底锁死位置 */
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #030008;
    font-family: "Microsoft YaHei", sans-serif;
    overflow: hidden !important;
    /* 禁止滚动 */
    -webkit-overflow-scrolling: auto !important;
    /* 关闭iOS弹性滚动 */
    touch-action: none;
    /* 禁止触摸滚动事件 */
    /* 适配全面屏，防止顶状态栏 */
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: border-box;
}

/* 内容容器：固定高度，溢出隐藏 */
.chat-container {
    width: 100%;
    max-width: 500px;
    height: 100%;
    /* 高度和父级一致 */
    background: #f0f0f0f6;
    display: flex;
    flex-direction: column;
    overflow: hidden !important;
    /* 内容超出也不滚动 */
}

/* 顶部栏：固定高度，不压缩 */
.chat-header {
    display: flex;
    padding: 3px 12px 0 12px;
    border-bottom: 1px solid #d3d3d3;
    flex-shrink: 0;
    /* 禁止被压缩 */
}

.header-left {
    color: #7c7c7c;
    cursor: pointer;
    padding: 8px;
}

.header-info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-right: 35px;
}

.name {
    font-size: 15px;
    color: #494949;
}

/* 内容区：自适应剩余高度，溢出隐藏 */
.cukeisl {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
    flex: 1;
    /* 占满剩余高度 */
    overflow: hidden !important;
    /* 超出部分隐藏 */
}

.avatar {
    width: 100%;
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
}

.avatar-xei {
    overflow: hidden;
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-left: 50px;
}

.avatar-xei img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-xeia {
    flex: 1;
    text-align: left;
    padding-left: 35px;
    flex-shrink: 0;
}

.avatar-xeia-aq {
    display: flex;
    flex-direction: row;
    margin-top: 25px;
    color: #db06ad;
    font-size: 15px;
    align-items: end;
}

.verified {
    margin-top: 5px;
    background: linear-gradient(325deg, #f79627 60%, #fff);
    border-radius: 50px;
    padding: 5px 15px;
    color: #7a4500;
    font-weight: bold;
    font-size: 15px;
    display: inline-block;
    white-space: nowrap;
}

.avatart {
    margin-top: 20px;
    width: 100%;
    text-align: left;
    background-color: #e0dede;
    flex-shrink: 0;
}

.avatartext {
    padding: 8px 20px;
    font-size: 15px;
    border-bottom: 1px solid #c7c7c7;
    color: #914701;
    font-weight: 800;
}

.delete {
    width: 80%;
    margin-top: 20px;
    background-color: #723700;
    padding: 8px 0;
    border-radius: 7px;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
    text-align: center;
    flex-shrink: 0;
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
    z-index: 9999;
}
.userteatb-oneb {
    margin-top: 6px;
    display: flex;
    text-align: center;
    margin-left: 5px;
    font-size: 13px;
    background-color: #a09002;
    border-radius: 20px;
    height: 30px;
    width: 30px;
    line-height: 30px;
    align-items: center;
    justify-content: center;
    /* border: 1px solid #acacac; */
    box-shadow: 0 0 1px 1px rgba(89, 211, 33, 0.349);
    font-weight: 999;
    color: #fff; 
}
.userteatb-oneb-no {
    margin-top: 6px;
    display: flex;
    text-align: center;
    margin-left: 5px;
    font-size: 13px;
    background-color: #a09002;
    border-radius: 20px;
    height: 30px;
    width: auto;
    padding: 0 8px; 
    line-height: 30px;
    align-items: center;
    justify-content: center;
    border: 1px solid #333;
    box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.349);
    font-weight: 999;
    white-space: nowrap; 
    color: #fff; 
}
</style>