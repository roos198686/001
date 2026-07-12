<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部标题：和参考页完全一致 -->
                <div class="allar-top">
                    <div class="allar-top-a">{{ $t('user') }}</div>
                </div>

                <!-- 中间滚动区域：和参考页完全统一 -->
                <div class="content-wrapper">
                    <div class="cuekdil">
                        <div class="allcoueksi">
                            <div :style="nameareva">
                                <div class="username-avatar"><img :src="userInfo.avatar" alt="avatar" /></div>
                                <div class="username-rakdi">
                                    <div class="username-text">{{ $t('username') }}：{{ userInfo.nickname }}</div>
                                    <div class="username-text">{{ $t('userId') }}：{{ userInfo.username }}</div>
                                    <div
                                        style="display: flex;flex-direction: row;background-color: #bd09966c;padding: 1px 5px;border-radius: 5px;">
                                        {{ $t('vipLevel') }}：<span style="color: #e200e2;font-weight: bolder;">
                                            {{ !userInfo.vip || userInfo.vip == '0' ? $t('normalUser') : 'VIP' +
                                                userInfo.vip }}</span></div>
                                </div>
                                <div style="text-align: right;margin-left: auto;padding-right: 20px;cursor: pointer;color: #999;"
                                    @click="userinfo">
                                    <Icon icon="lucide:settings" height="28" />
                                </div>
                            </div>

                            <div class="allcoueksi-a">
                                <div class="allcoueksi-atext">
                                    <div style="font-size: 12px;color: #a88035;font-weight: 800;">{{ $t('type_date_card') }}
                                    </div>
                                    <div style="font-size: 23px;font-weight: 800;margin-top: 5px;">{{
                                        totalBuyCount }}
                                    </div>
                                </div>
                                <div class="allcoueksi-atext">
                                    <div style="font-size: 12px;color: #a88035;font-weight: 800;">{{
                                        $t('accountBalance') }}
                                    </div>
                                    <div style="font-size: 23px;font-weight: 800;margin-top: 5px;">${{ userInfo.balance
                                        || 0 }}
                                    </div>
                                </div>
                            </div>

                            <div class="allcoueksi-a" style="gap: 5px;margin:0 20px;">
                                <div class="allcoueksi-btext" @click="user_datingorders">
                                    <Icon icon="material-symbols:heart-plus-rounded" height="38"
                                        style="color: #fc01fc;" />
                                    <div style="width: 50%;margin-left: 10px;">
                                        <div>{{ $t('datingOrder') }}</div>
                                        <div>{{ $t('ongoing') }}：0</div>
                                    </div>
                                </div>
                                <div class="allcoueksi-btext" @click="user_vip">
                                    <Icon icon="streamline-ultimate:vip-crown-queen-1-bold" height="35"
                                        style="color: #fc01fc;" />
                                    <div style="width: 50%;margin-left: 10px;">
                                        <div>{{ $t('vipManage') }}</div>
                                        <div>{{ $t('currentLevel') }}：{{ userInfo.vip || 0 }}</div>
                                    </div>
                                </div>
                                <div class="allcoueksi-btext" @click="user_service">
                                    <Icon icon="mdi:support" height="40" style="color: #fc01fc;" />
                                    <div style="width: 50%;margin-left: 10px;">
                                        <div>{{ $t('onlineService') }}</div>
                                        <div>7*24 {{ $t('hours') }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="myimage" v-if="Number(userInfo.role_level) > 1">
                                <div class="myimagetext">
                                    <div>{{ $t('myHomepage') }}</div>
                                    <div class="tudslig" @click="artist()">{{ $t('edit') }}</div>
                                </div>
                                <div class="myimagediv" :style="myImages.length < 1 ? 'height:40px;' : ''">
                                    <!-- 直接循环 img 即可 -->
                                    <div v-for="(img, i) in myImages" :key="i" style="flex: 1;">
                                        <img :src="baseURL + img" class="myimageurl">
                                    </div>
                                    <div v-if="myImages.length < 1" class="terxtimage">{{ $t('noRecords') }}</div>
                                </div>
                            </div>

                            <div class="butopkdo" style="margin-bottom: 20px;">
                                <div class="butopkdo-text" @click="showLangModal = true">
                                    <Icon icon="material-symbols:language" height="28" />
                                    <span style="margin-left: 10px;">{{ currentLangName }}</span>
                                    <Icon icon="mdi:chevron-right" height="28"
                                        style="text-align: right;margin-left: auto;" />
                                </div>
                                <div class="butopkdo-text" @click="userrecommend">
                                    <Icon icon="material-symbols:recommend-outline-sharp" height="28" />
                                    <span style="margin-left: 10px;">{{ $t('user_recommend') }}</span>
                                    <Icon icon="mdi:chevron-right" height="28"
                                        style="text-align: right;margin-left: auto;" />
                                </div>
                                <div class="butopkdo-text" @click="user_membership">
                                    <Icon icon="mage:id-card-fill" height="28" />
                                    <span style="margin-left: 10px;">{{ $t('membershipCard') }}</span>
                                    <Icon icon="mdi:chevron-right" height="28"
                                        style="text-align: right;margin-left: auto;" />
                                </div>
                                <div class="butopkdo-text" @click="user_withdraw">
                                    <Icon icon="basil:wallet-solid" height="28" />
                                    <span style="margin-left: 10px;">{{ $t('withdraw') }}</span>
                                    <Icon icon="mdi:chevron-right" height="28"
                                        style="text-align: right;margin-left: auto;" />
                                </div>
                                <div class="butopkdo-text" @click="user_resetpass">
                                    <Icon icon="material-symbols:shield-locked" height="28" />
                                    <span style="margin-left: 10px;">{{ $t('resetPassword') }}</span>
                                    <Icon icon="mdi:chevron-right" height="28"
                                        style="text-align: right;margin-left: auto;" />
                                </div>
                                <div class="butopkdo-text" @click="user_resrtpaypass">
                                    <Icon icon="material-symbols:lock-clock-rounded" height="28" />
                                    <span style="margin-left: 10px;">{{ $t('resetPayPassword') }}</span>
                                    <Icon icon="mdi:chevron-right" height="28"
                                        style="text-align: right;margin-left: auto;" />
                                </div>
                                <div class="butopkdo-text" @click="user_recharge">
                                    <Icon icon="fluent:wallet-credit-card-32-filled" height="28" />
                                    <span style="margin-left: 10px;">{{ $t('recharge') }}</span>
                                    <Icon icon="mdi:chevron-right" height="28"
                                        style="text-align: right;margin-left: auto;" />
                                </div>
                                <div class="butopkdo-text" @click="datingcark">
                                    <Icon icon="material-symbols-light:assignment-rounded" height="28" />
                                    <span style="margin-left: 10px;">{{ $t('datingCard') }}</span>
                                    <div style="text-align: right;margin-left: auto;"></div>
                                    <Icon icon="mdi:chevron-right" height="28" />
                                </div>
                                <div class="butopkdo-texta" @click="copyText">
                                    <Icon icon="ic:baseline-person-add-alt-1" height="28" />
                                    <span style="margin-left: 10px;">{{ $t('inviteCode') }}</span>
                                    <div style="text-align: right;margin-left: auto;">{{ userInfo.invite_code || '' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 底部导航：和参考页 100% 统一 -->
                <div class="buttnone">
                    <div class="buttnone-all">
                        <div v-for="menu in menuList" :key="menu.key" class="buttnone-alla"
                            :style="{ color: isMenuActive(menu.key) ? '#fa33fa' : '#d6a6d6' }"
                            @click="activeMenu(menu.path)">
                            <div style="position: relative;">
                                <Icon :icon="menu.icon" height="24" />
                                <div v-if="menu.unread && menu.unread > 0" class="badge">
                                    {{ menu.unread > 99 ? '99+' : menu.unread }}
                                </div>
                            </div>
                            <div>{{ $t(menu.mobileName.toLowerCase()) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="copy-toast" v-if="showToast">
            <div style="font-size: 30PX;">
                <Icon icon="iconoir:check" width="58" />
            </div>
            <div class="toast-text" style="font-size: 16px;">{{ showtext }}</div>
        </div>
        <!-- 语言选择弹窗（直接加在页面最底部即可） -->
        <div v-if="showLangModal" @click="showLangModal = false"
            style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:grid;place-items:center;">
            <div style="background:#2b2b2b; border-radius:10px; width:80%; max-width:320px; padding:20px; color:#fff;"
                @click.stop>
                <div style="font-size:16px; margin-bottom:15px; text-align:center;">{{ $t('Language') }}</div>
                <div style="display:flex;flex-direction:column;gap:8px;font-size: 13px;">
                    <div style="padding:12px; background:#3a3a3a; border-radius:6px; text-align:center;cursor:pointer;"
                        @click="changeLang('en')">English</div>
                    <div style="padding:12px; background:#3a3a3a; border-radius:6px; text-align:center;cursor:pointer;"
                        @click="changeLang('zh')">繁体中文</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import router from '../../router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import request from '@/utils/request';
import { BASE_URLQDAPI } from "@/config/base"
import { io } from 'socket.io-client';

const { t } = useI18n();
const route = useRoute();
const baseURL = request.defaults.baseURL || '';
import { computed } from 'vue';

const { locale } = useI18n();
const showLangModal = ref(false);

//背景图
const nameareva = computed(() => {
    // 有自定义背景用用户图，没有用默认底图
    let bgFullUrl: string;
    if (userInfo.avatar_bg) {
        // 有自定义背景：拼接接口域名
        bgFullUrl = baseURL + userInfo.avatar_bg;
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
// 语言名称显示
const currentLangName = computed(() => {
    const langMap: Record<string, string> = {
        en: 'Language',
        zh: '语言',
    }
    return langMap[locale.value] || 'Language'
})
// 切换语言
const changeLang = (lang: string) => {
    locale.value = lang;
    localStorage.setItem('lang', lang);
    showLangModal.value = false;
};
const showToast = ref(false);
const showtext = ref('');

const userInfo = reactive({
    id: '',
    username: '',
    nickname: '',
    avatar: '',
    vip: '',
    balance: '',
    invite_code: '',
    date_card_num: '',
    role_level: '',
    avatar_bg: ''
});

const menuList = ref([
    { key: 'a', path: '/index', pathPrefix: '/index', mobileName: 'Home', icon: 'streamline-flex:home-2-solid', unread: 0 },
    { key: 'b', path: '/shop', pathPrefix: '/shop', mobileName: 'Dating', icon: 'tabler:video', unread: 0 },
    { key: 'c', path: '/contacts', pathPrefix: '/contacts', mobileName: 'Contacts', icon: 'material-symbols:group-rounded', unread: 0 },
    { key: 'e', path: '/user', pathPrefix: '/user', mobileName: 'User', icon: 'ic:baseline-face-6', unread: 0 },
]);

let socket: any = null;
const refreshUnread = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) return;
    try {
        const { data } = await request.post('/api/chat/unread-total?_t=' + Date.now(), { userId: user.id });
        if (data.code === 1) {
            menuList.value = menuList.value.map((item, i) =>
                i === 2 ? { ...item, unread: data.total || 0 } : item
            );
        }
    } catch (e) { }
};

const loadUserInfo = async () => {
    try {
        const u = localStorage.getItem('user') || '';
        if (!u) return;
        const user = JSON.parse(u);
        const userId = user.id || user.userId;

        const { data: res } = await request.post('/api/user/info', { user_id: userId });
        if (res.code === 1 && res.data) {
            const data = res.data;
            userInfo.id = data.id || '';
            userInfo.username = data.username || '';
            userInfo.nickname = data.nickname || '';
            userInfo.avatar = baseURL + (data.avatar || '');
            userInfo.vip = data.vip_level || '';
            userInfo.balance = data.balance || '';
            userInfo.invite_code = data.invite_code || '';
            userInfo.role_level = data.role_level || '';
            userInfo.date_card_num = data.date_card_num || '0';
            userInfo.avatar_bg = data.avatar_bg || '';
            // localStorage.setItem('user', JSON.stringify(data));
        }
    } catch (err) { }
};

const copyText = () => {
    const text = userInfo.invite_code || '';
    try {
        const input = document.createElement('input');
        input.value = BASE_URLQDAPI + 'register?code=' + text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);

        showToast.value = true;
        showtext.value = t('copySuccess');
        setTimeout(() => showToast.value = false, 3000);
    } catch (e) {
        showToast.value = true;
        showtext.value = t('copyFailed');
        setTimeout(() => showToast.value = false, 2000);
    }
};

const userinfo = () => router.push('/userinfo');
const user_datingorders = () => router.push('/datingcark');
const user_vip = () => router.push('/user_vip');
const datingcark = () => router.push('/user_datingorders');
const user_membership = () => router.push('/user_membership');
const user_withdraw = () => router.push('/user_withdraw');
const user_resetpass = () => router.push('/user_resetpass');
const user_resrtpaypass = () => router.push('/user_resrtpaypass');
const user_recharge = () => router.push('/user_recharge');
const user_service = () => router.push('/message/235787');

//我的推荐人
const userrecommend = async () => {
    const user = localStorage.getItem('user') || '';
    if (!user) return;
    const userid = JSON.parse(user);
    const inviteCode = userid.inviteryou_code;
    try {
        const { data: res } = await request.post('/api/getInviteMatch', {
            invite_code: inviteCode
        });
        if (res.code === 1) {
            router.push('/message/' + res.id);
        } else {
            showToast.value = true;
            showtext.value = t('user_norecommend');
            setTimeout(() => showToast.value = false, 2000);
        }
    } catch (err) {
        console.log(err)
    }
    // 
}


const artist = () => {
    const u = localStorage.getItem('user') || '';

    if (!u) return;
    const user = JSON.parse(u);
    const userId = user.id || user.userId;
    router.push({ path: '/artist', query: { id: userId } });
};

const isMenuActive = (menuKey: string) => {
    const menu = menuList.value.find(item => item.key === menuKey);
    return menu ? route.path.startsWith(menu.pathPrefix) : false;
};

const activeMenu = (path: string) => {
    router.push({ path, replace: true });
    localStorage.setItem('last_path', path);
};

watch(() => route.path, () => {
    localStorage.setItem('last_path', route.path);
}, { immediate: true });

const getMyImages = async () => {
    const u = localStorage.getItem('user') || '';
    if (!u) return;
    const user = JSON.parse(u);
    const userId = user.id || user.userId;
    try {
        const { data: res } = await request.post('/api/user/myImages', {
            current_user_id: userId
        });
        if (res.code === 1) {
            myImages.value = res.images;
        }
    } catch (err) { }
};
// 获取套餐列表
const packageList = ref<any[]>([])
const myImages = ref<any[]>([]);
const totalBuyCount = ref(0)
const getPackageList = async () => {
    const u = localStorage.getItem('user') || '';
    if (!u) return;
    const user = JSON.parse(u);
    const userId = user.id || user.userId;
  try {
    // 修复：get 第二个参数是配置对象，参数放在 params 里
    const { data: res } = await request.get('/api/recharge/package/list', {
      params: {
        user_id: userId,  
      }
    })
    if (res.code === 200) {
      packageList.value = res.data || []
      totalBuyCount.value = packageList.value.reduce((sum, item) => {
        return sum + (Number(item.buy_count) || 0)
      }, 0)
    }
  } catch {
  }
}
onMounted(() => {
    loadUserInfo();
    refreshUnread();
    getMyImages();
    getPackageList();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
        socket = io(baseURL, { transports: ['websocket'] });
        socket.emit('bindUserId', user.id);
        socket.on('new_msg', () => {
            refreshUnread();
        });
    }

    const lastPath = localStorage.getItem('last_path');
    if (lastPath && route.path === '/') {
        router.replace(lastPath);
    }
});

onUnmounted(() => {
    if (socket) socket.disconnect();
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

/* ========== 顶部标题：固定定位统一 ========== */
.allar-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    max-width: 500px;
    margin: 0 auto;
    z-index: 999;
    display: flex;
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

/* ========== 内容滚动容器：完全统一 ========== */
.content-wrapper {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    padding-bottom: 80px !important;
    background: #222 !important;
}

.cuekdil {
    width: 100%;
    min-height: 100%;
    background: #222;
    padding-bottom: 10px;
}

/* ========== 原有业务样式保留 ========== */
.allcoueksi {
    color: #fff;
}


.username-avatar {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 15px 0 30px;
    border: 2px solid #c2c0c0;
}

.username-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.username-rakdi {
    font-size: 12px;
    color: #dfdfdf;
    text-align: left;

}

.allcoueksi-a {
    display: flex;
}

.allcoueksi-atext {
    flex: 1;
    margin: 20px;
}

.allcoueksi-btext {
    flex: 1;
    height: 70px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(325deg, #e45ce4 0%, #ecc97f 50%, #fff 100%);
    font-size: 10px;
    color: #000;
}

.myimage {
    background: #313131;
    margin: 10px 20px;
    border-radius: 5px;
}

.myimagetext {
    padding: 10px 15px;
    font-size: 12px;
    background: #4b4b4b;
    color: #d6b288;
    display: flex;
    border-radius: 5px 5px 0 0;
}

.myimagediv {
    display: flex;
    padding: 13px 10px;
    height: 100px;
    gap: 5px;
    overflow: hidden;
}

.myimageurl {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #6e6e6e;
}

.tudslig {
    background: #cf9b69;
    padding: 0 7px;
    border-radius: 4px;
    color: #000;
    text-align: right;
    margin-left: auto;
}

.terxtimage {
    flex: 1;
    font-size: 12px;
    color: #999;
    line-height: 30px;
}

.butopkdo {
    background: #2b2b2b;
    margin: 10px 20px 20px 20px;
    border-radius: 5px;
}

.butopkdo-text {
    padding: 10px 20px;
    font-size: 14px;
    color: #cf9b69;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #222;
}

.butopkdo-texta {
    padding: 10px 20px;
    font-size: 14px;
    color: #cf9b69;
    display: flex;
    align-items: center;
}

/* ========== 底部导航：100% 统一 ========== */
.buttnone {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 500px;
    margin: 0 auto;
    padding: 10px 0 19px;
    background: #141414;
    border-top: 1px solid #414141;
    z-index: 999;
}

.buttnone-all {
    display: flex;
}

.buttnone-alla {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    font-size: 11px;
    color: #d6a6d6;
}

.badge {
    position: absolute;
    top: -4px;
    right: -6px;
    min-width: 16px;
    height: 16px;
    background: #ff3366;
    color: #fff;
    font-size: 10px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #02fc17;
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
}

.kdilspsdas {
    display: flex;
    flex-direction: row;
    font-size: 12px;
    background-color: #c0bfbf17;
    margin: 10px 20px 0 20px;
    padding-bottom: 10px;
    border-radius: 6px;
    border: 1px solid #4d4c4c;
}

.username-text {
    background-color: #bd09966c;
    padding: 1px 5px;
    margin-bottom: 2px;
    border-radius: 5px;
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

/* 仅移动端修复顶部遮挡 */
</style>