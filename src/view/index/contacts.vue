<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">

                <!-- 顶部标题 -->
                <div class="allar-top">
                    <div class="allar-top-a">{{ $t('contacts') }}</div>
                    <div style="color: #ccc;margin-right: 10px;" @click="userxeiqicontacts">
                        <Icon icon="gg:add" width="25" />
                    </div>
                </div>

                <!-- 中间滚动区域 + 下拉刷新 -->
                <div class="content-wrapper" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
                    @touchend="handleTouchEnd">
                    <div class="pull-down-refresh"
                        :style="{ height: pullDownOffset + 'px', opacity: pullDownOffset > 0 ? 1 : 0 }">
                        <Icon icon="svg-spinners:12-dots-scale-rotate" width="28" style="color: #666;" />
                    </div>

                    <div class="cuekdil">
                        <div class="reimengcesu-twoa-d">
                            <!-- 搜索栏 -->
                            <div class="contact-search">
                                <input v-model="searchKey" type="text" class="search-input"
                                    :placeholder="$t('searchContactsPlaceholder')" @input="refreshContacts" />
                            </div>

                            <!-- 列表 -->
                            <div v-if="filteredContacts.length === 0 && !loading" class="empty-tip">{{ $t('noContacts')
                                }}</div>
                            <div class="reimengcesu-twoa-b" @click="toChat(item.id)" v-for="item in filteredContacts"
                                :key="item.id">
                                <div class="avatar-wrapper">
                                    <div class="avatar">
                                        <img :src="baseURL + item.avatar" alt="avatar" />
                                    </div>
                                    <div v-if="item.unread_count > 0" class="unread-badge">
                                        {{ item.unread_count > 99 ? '99+' : item.unread_count }}
                                    </div>
                                </div>
                                <div class="info">
                                    <div class="name">{{ item.name }}</div>
                                    <div class="last-msg">{{ item.lastMsg == '[T]' ? $t('image') : item.lastMsg ==
                                        '[Z]' ? $t('transfer') : item.lastMsg == '[Y]' ? $t('card') : item.lastMsg ==
                                            '[S]' ? $t('video') : item.lastMsg ==
                                                '[G]' ? '商品' : item.lastMsg
                                    }}</div>
                                </div>
                                <div class="msg-time">{{ formatRelativeTime(item.timestamp) }}</div>
                            </div>
                            <div style="height: 30px;"></div>
                        </div>
                    </div>
                </div>

                <!-- 底部导航 -->
                <div class="buttnone">
                    <div class="buttnone-all">
                        <div v-for="menu in menuList" :key="menu.key" class="buttnone-alla"
                            :style="{ color: isMenuActive(menu.key) ? '#fa33fa' : '#d6a6d6' }"
                            @click="activeMenu(menu.path)">
                            <div style="position: relative;">
                                <Icon :icon="menu.icon" height="24" />
                                <div v-if="menu.unread > 0" class="badge">{{ menu.unread > 99 ? '99+' : menu.unread }}
                                </div>
                            </div>
                            <div>{{ $t(menu.i18nKey) }}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <!-- ================== 加好友搜索弹窗（底部滑出） ================== -->
        <div class="add-friend-modal-mask" v-if="showAddFriendModal" @click="showAddFriendModal = false">
            <div class="add-friend-modal" @click.stop>
                <div class="add-friend-header">
                    <div>{{ $t('addFriend') }}</div>
                    <div @click="showAddFriendModal = false">{{ $t('cancel') }}</div>
                </div>

                <div class="add-friend-body">
                    <!-- 搜索框 -->
                    <div class="search-box">
                        <input v-model="searchUsername" @input="doSearchUser" :placeholder="$t('searchUsername')" />
                    </div>

                    <!-- 搜索结果 -->
                    <div class="result-list">
                        <div v-for="item in searchResult" :key="item.id" class="result-item">
                            <div class="item-left">
                                <div class="avatar">
                                    <img :src="baseURL + item.avatar" alt="" />
                                </div>
                                <div class="info">
                                    <div class="nickname">{{ item.nickname }}</div>
                                    <div class="username">@{{ item.username }}</div>
                                </div>
                            </div>
                            <div class="chat-btn" @click="goChatWithUser(item.id)">
                                {{ $t('goChat') }}
                            </div>
                        </div>

                        <div v-if="searchLoading" style="text-align:center; color:#ccc; padding:15px;">
                            {{ $t('searching') }}...
                        </div>
                        <div v-if="!searchLoading && searchResult.length === 0 && searchUsername"
                            style="text-align:center; color:#999; padding:20px;">
                            {{ $t('noUserFound') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, onUnmounted, onActivated, reactive } from 'vue';
import { Icon } from '@iconify/vue';
import router from '../../router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import request from '@/utils/request';
import { io } from 'socket.io-client';
import { AxiosResponse } from 'axios';

const baseURL = request.defaults.baseURL || '';
const { t } = useI18n();
const route = useRoute();
const user_service = () => router.push('/message/235787');
// ==============================================
// 加好友搜索弹窗（完整实现）
// ==============================================
const showAddFriendModal = ref(false)
const searchUsername = ref('')
const searchResult = ref([])
const searchLoading = ref(false)

// 打开弹窗
const userxeiqicontacts = async () => {
    showAddFriendModal.value = true
    searchUsername.value = ''
    searchResult.value = []
}

// 搜索用户（user 表 username）
const doSearchUser = async () => {
    const kw = searchUsername.value.trim()
    if (!kw) {
        searchResult.value = []
        return
    }

    searchLoading.value = true
    try {
        const { data } = await request.post('/api/user/search', {
            keyword: kw
        })
        if (data?.code === 1) {
            searchResult.value = data.list || []
        } else {
            searchResult.value = []
        }
    } catch (err) {
        searchResult.value = []
    }
    searchLoading.value = false
}

// 去聊天
const goChatWithUser = (userId: number) => {
    showAddFriendModal.value = false
      router.push({
        path: '/message/' + userId
      })
    // router.push({ name: 'Message', params: { id: userId } })
}

interface ContactItem {
    id: number;
    name: string;
    avatar: string;
    lastMsg: string;
    timestamp: number;
    unread_count: number;
}

// 数据
const filteredContacts = ref<ContactItem[]>([]);
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
const pageSize = ref(10);
const searchKey = ref('');
let socket: any = null;

// 下拉刷新
const pullDownOffset = ref(0);
const refreshTip = ref('');
const startY = ref(0);
const isPulling = ref(false);
const MAX_PULL_DOWN = 60;

// 本地缓存 KEY
const CONTACTS_CACHE_KEY = 'local_contacts_cache';

// 读取缓存
const loadContactsFromCache = () => {
    try {
        const cache = localStorage.getItem(CONTACTS_CACHE_KEY);
        if (cache) {
            filteredContacts.value = JSON.parse(cache);
        }
    } catch (e) {
        // console.log('缓存读取失败');
    }
};

// 保存到缓存
const saveContactsToCache = (list: ContactItem[]) => {
    try {
        localStorage.setItem(CONTACTS_CACHE_KEY, JSON.stringify(list));
    } catch (e) { }
};

const toChat = (userId: number) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role_level != 3) {
        router.push(`/message/${userId}`);
    }
};

const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return t('justNow');
    if (minutes < 60) return `${minutes}${t('minutesAgo')}`;
    if (hours < 24) return `${hours}${t('hoursAgo')}`;
    if (days < 7) return `${days}${t('daysAgo')}`;
    return t('longAgo');
};

const getCurrentUserId = (): number => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.id || 0;
};

// 滚动加载更多（只追加，不清空）
const handleScroll = () => {
    const el = document.querySelector('.content-wrapper');
    if (!el) return;
    if (loading.value || finished.value) return;

    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (bottom < 300) {
        loadMore();
    }
};

// 真正请求接口（会更新缓存）
const fetchFromServer = async () => {
    const userId = getCurrentUserId();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role_level = user.role_level || 0;
    if (!userId) return;

    loading.value = true;
    try {
        let res: AxiosResponse<any, any>;

        if (role_level == 3) {
            const group_user = user.group_user || "";
            res = await request.post("/api/contact/listadmin", {
                keyword: searchKey.value,
                page: page.value,
                limit: pageSize.value,
                group_user: group_user,
            });
        } else {
            res = await request.post("/api/contact/list", {
                userId: userId,
                keyword: searchKey.value,
                page: page.value,
                limit: pageSize.value,
            });
        }

        if (res.data.code === 1) {
            const list = res.data.data || [];
            const newList = page.value === 1 ? list : [...filteredContacts.value, ...list];

            filteredContacts.value = newList;
            saveContactsToCache(newList); // 保存到缓存

            finished.value = list.length < pageSize.value;
            if (!finished.value) page.value++;
            refreshUnreadBadge();
        } else {
            finished.value = true;
        }
    } catch (err) {
        console.error("加载失败", err);
    } finally {
        loading.value = false;
    }
};

// 加载更多（追加）
const loadMore = async () => {
    if (loading.value || finished.value) return;
    await fetchFromServer();
};

// 搜索/重置（会请求网络）
const refreshContacts = () => {
    page.value = 1;
    finished.value = false;
    filteredContacts.value = [];
    fetchFromServer();
};

// 下拉刷新 —— 只在这里触发网络更新
const doPullDownRefresh = async () => {
    page.value = 1;
    finished.value = false;
    await fetchFromServer();
    pullDownOffset.value = 0; // 刷新完直接隐藏，干净！
};

// 触摸下拉
const handleTouchStart = (e: any) => {
    if ((document.querySelector('.content-wrapper')?.scrollTop || 0) > 10) return;
    startY.value = e.touches[0].clientY;
    isPulling.value = true;
};

const handleTouchMove = (e: any) => {
    if (!isPulling.value) return;
    const dy = e.touches[0].clientY - startY.value;
    pullDownOffset.value = dy > 0 ? Math.min(dy * 0.6, 80) : 0;
};

const handleTouchEnd = () => {
    // 超过距离就刷新，否则直接归零隐藏
    if (pullDownOffset.value > 70) {
        doPullDownRefresh();
    } else {
        pullDownOffset.value = 0;
    }
    isPulling.value = false;
};

const refreshUnreadBadge = async () => {
    const userId = getCurrentUserId();
    if (!userId) return;

    try {
        const { data } = await request.post('/api/chat/unread-total', { userId });
        const menu = menuList.value.find(m => m.key === 'c');
        if (menu) menu.unread = data.total || 0;
    } catch (err) {
        const menu = menuList.value.find(m => m.key === 'c');
        if (menu) menu.unread = 0;
    }
};

const menuList = ref([
    { key: 'a', path: '/index', pathPrefix: '/index', i18nKey: 'home', icon: 'streamline-flex:home-2-solid', unread: 0 },
    { key: 'b', path: '/shop', pathPrefix: '/shop', i18nKey: 'home', icon: 'tabler:video', unread: 0 },
    { key: 'c', path: '/contacts', pathPrefix: '/contacts', i18nKey: 'contacts', icon: 'material-symbols:group-rounded', unread: 0 },
    { key: 'e', path: '/user', pathPrefix: '/user', i18nKey: 'user', icon: 'ic:baseline-face-6', unread: 0 },
]);

const isMenuActive = (key: string) => {
    const m = menuList.value.find(x => x.key === key);
    return m ? route.path.startsWith(m.pathPrefix) : false;
};
const activeMenu = (path: string) => {
    router.push({ path, replace: true });
    localStorage.setItem('last_path', path);
};

watch(
    () => route.path,
    (newPath) => {
        if (newPath === '/contacts') {
            // 切回页面 → 读缓存
            loadContactsFromCache();
        }
    }
);

onMounted(() => {
    // 第一次进入 → 读缓存 + 自动刷新一次
    loadContactsFromCache();
    refreshContacts();
    refreshUnreadBadge();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) return;

    const scroller = document.querySelector('.content-wrapper')
    if (scroller) scroller.addEventListener('scroll', handleScroll)

    socket = io(request.defaults.baseURL!, { transports: ['websocket'] });
    socket.on('connect', () => socket.emit('bindUserId', user.id));
    socket.on('new_msg', () => {
        // 后端实时推送 → 刷新
        refreshContacts();
    });

    window.addEventListener('messageRead', () => {
        refreshContacts();
        refreshUnreadBadge();
    });

    const last = localStorage.getItem('last_path')
    if (last && last !== '/' && route.path === '/') router.replace(last)
});

onActivated(() => {
    // 页面激活 → 只读缓存
    loadContactsFromCache();
});

onUnmounted(() => {
    const scroller = document.querySelector('.content-wrapper');
    if (scroller) {
        scroller.removeEventListener('scroll', handleScroll);
    }
    if (socket) socket.disconnect();
});
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
    flex: 1;
    margin-left: 40px;
}

/* 下拉刷新样式 */
.pull-down-refresh {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 下拉时才撑开高度显示 */
.pull-down-refresh:has(+ .cuekdil) {
    height: auto;
    min-height: 0;
}

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

.reimengcesu-twoa-d {
    width: 100%;
    height: 100%;
}

.contact-search {
    padding: 0 10px;
    display: flex;
    align-items: center;
}

.search-input {
    margin:20px 10px 10px 10px;
    height: 30px;
    border-radius: 5px;
    border: none;
    padding: 0 12px;
    flex: 1;
    background-color: #f1f1f1;
    outline: none;
    font-size: 16px;
}

.reimengcesu-twoa-b {
    display: flex;
    align-items: center;
    padding: 8px 20px;
    border-top: 1px solid #000;
    background-color: #2e2e2e;
    cursor: pointer;
}

.avatar-wrapper {
    position: relative;
    margin-right: 5px;
}

.avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #e7e7e7;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.unread-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: red;
    color: white;
    font-size: 10px;
    border-radius: 10px;
    padding: 0 5px;
}

.info {
    flex: 1;
    text-align: left;
    padding-left: 10px;
}

.name {
    color: white;
    font-size: 15px;
}

.last-msg {
    color: #999;
    font-size: 13px;
}

.msg-time {
    color: #888;
    font-size: 13px;
}

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
}

.empty-tip {
    text-align: center;
    padding: 20px 0;
    font-size: 12px;
    color: #999;
}

::-webkit-scrollbar {
    display: none;
}

/* ================== 加好友搜索弹窗样式 ================== */
.add-friend-modal-mask {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9998;
    display: flex;
    align-items: flex-end;
}

.add-friend-modal {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    background: #fff;
    border-radius: 20px 20px 0 0;
    height: 85%;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease forwards;
}

.add-friend-header {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 15px;
    border-bottom: 1px solid #eee;
}

.add-friend-body {
    flex: 1;
    overflow-y: auto;
    padding: 10px 15px;
}

.search-box {
    margin-bottom: 10px;
}

.search-box input {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    outline: none;
    font-size: 14px;
    box-sizing: border-box;
}

.result-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5;
}

.item-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.result-item .avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    overflow: hidden;
}

.result-item .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.info .nickname {
    font-size: 14px;
    font-weight: bold;
}

.info .username {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
}

.chat-btn {
    background: #014da3;
    color: #fff;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
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