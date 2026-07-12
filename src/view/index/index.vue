<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部标题 -->
                <div class="allar-top">
                    <div class="allar-top-a">{{ $t('popularity') }}</div>
                </div>

                <!-- 内容区域 -->
                <div class="content-wrapper" ref="scrollWrap" @scroll="handleScroll">
                    <div class="cuekdil">
                        <div class="lueibuo" style="overflow: hidden;">
                            <div class="carousel-inner" style="display: flex; "
                                :style="{ transform: `translateX(-${currIndex * 100}%)` }">
                                <div class="carousel-item" v-for="(img, i) in images" :key="i"
                                    :style="{ backgroundImage: `url(${img})` }"></div>
                            </div>
                        </div>

                        <div class="guahgbui">
                            <Icon icon="icon-park-solid:volume-notice" height="20"
                                style="margin-right: 10px;color: #fff;" />
                            <div class="marquee-wrapper">
                                <div class="marquee-content">
                                    <div>{{ $t('welcomeTip') }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="reimengcesu" ref="listContainer">
                            <div>
                                <!-- <div v-if="dynamicList.length === 0 && !loading" class="empty-tip">
                                    {{ $t('noMemberData') }}
                                </div> -->
                                <div class="inage" v-for="(item, i) in dynamicList" :key="i">
                                    <div style="display: flex;flex-direction: row;">
                                        <div class="userteataaq" @click="artist(item)">
                                            <img :src="baseURL + item.avatar"
                                                style="width:100%;height:100%;object-fit:cover;">
                                        </div>
                                        <div style="display: flex;flex-direction: column;flex: 1;margin-right: 20px;">
                                            <div @click="goDetail(item.id)">
                                                <div
                                                    style="display: flex;flex-direction: row;margin-top: 10px;align-items: center;">
                                                    <div class="userteatb-oneaa">{{ item.nickname }}</div>
                                                    <div class="userteatb-oneba">
                                                        <Icon icon="mingcute:safety-certificate-fill" height="15"
                                                            style="color: #f3bb02;" />
                                                    </div>
                                                    <div class="userteatb-oneb"
                                                        v-if="item.vip_level && item.vip_level !== '0'">
                                                        <Icon icon="mingcute:flower-2-fill" height="15" />
                                                    </div>
                                                    <div
                                                        style="font-size: 11px;padding: 5px 10px;text-align: right;margin-left: auto;">
                                                        {{ moment(item.created_at).format('YYYY.MM.DD HH:mm') }}
                                                    </div>
                                                </div>
                                                <div style="font-size: 13px;color: #ccc;text-align: left;">@{{
                                                    item.username
                                                }}</div>
                                                <div class="contenttext">{{ item.content }}</div>
                                                <!-- 图片区域 -->
                                                <div class="imagesdiv" :class="item.images.length == 1 ? 'imagesdiva' :
                                                    item.images.length == 2 ? 'imagesdivb' :
                                                        item.images.length == 3 ? 'imagesdivc' : 'imagesdivd'"
                                                    v-if="item.file_type === 'image' && item.images.length">
                                                    <img v-for="imgUrl in item.images" :key="imgUrl"
                                                        :src="baseURL + imgUrl">
                                                </div>

                                                <!-- 视频区域 -->
                                                <div v-if="item.file_type === 'video' && item.video_url"
                                                    style="margin-top:8px; text-align:left;">
                                                    <video :src="baseURL + item.video_url" controls style="
            max-height: 380px;
            width: auto;
            max-width: 100%;
            border-radius: 8px;
            display: block;
        "></video>
                                                </div>
                                            </div>
                                            <div
                                                style="display: flex;flex-direction: row;font-size: 13px;margin-top: 10px;align-items: center;">
                                                <div
                                                    style="display: flex;flex-direction: row;align-items: center;flex: 1;">
                                                    <span>
                                                        <Icon icon="majesticons:chat-line" height="18" />
                                                    </span><span style="font-size: 12px;">{{ item.comment_num ?
                                                        item.comment_num : 0 }}</span>
                                                </div>
                                                <div @click="toggleLike(item)"
                                                    style=" display: flex;flex-direction: row;align-items:center;margin-left: 10px;flex: 1;">
                                                    <span>
                                                        <Icon v-if="item.isLike" icon="iconoir:heart-solid" height="18"
                                                            style="color: #ff33ee;" />
                                                        <Icon v-else icon="iconoir:heart" height="18" />
                                                    </span><span style="font-size: 12px;">{{ item.like_num ?
                                                        item.like_num : 0 }}</span>
                                                </div>
                                                <div
                                                    style="display: flex;flex-direction: row;align-items: center;margin-left: 10px;flex: 1;">
                                                    <span>
                                                        <Icon icon="material-symbols:equalizer-rounded" height="18" />
                                                    </span><span style="font-size: 12px;">{{ item.view_num ?
                                                        item.view_num : 0 }}</span>
                                                </div>
                                                <div @click="toggleCollect(item)"
                                                    style=" display: flex;flex-direction: row;align-items:center;margin-left: 10px;flex: 1;">
                                                    <span>
                                                        <Icon v-if="item.isCollect"
                                                            icon="material-symbols:bookmarks-rounded" height="18"
                                                            style="color:#ff33ee" />
                                                        <Icon v-else icon="material-symbols:bookmarks-outline"
                                                            height="18" />
                                                    </span><span style="font-size: 12px;">{{ item.collect_num ?
                                                        item.collect_num : 0 }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="loading && !finished" class="loading-tip" style="color: #666;">
                                    <Icon icon="svg-spinners:12-dots-scale-rotate" width="38" />
                                </div>
                            </div>
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
                                <div v-if="menu.unread && menu.unread > 0" class="badge">
                                    {{ menu.unread > 99 ? '99+' : menu.unread }}
                                </div>
                            </div>
                            <div>{{ $t(menu.i18nKey) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 完善资料弹窗 -->
        <div class="first-login-modal" v-if="showFirstLoginModal">
            <div class="modal-mask"></div>
            <div class="modal-content">
                <div style="background:#444;border-radius:7px 7px 0 0;padding:15px;">
                    <div style="font-size:15px;margin-bottom:5px;">{{ $t('welcomeLogin') }}</div>
                    <div style="color:#ccc;font-size:12px;">{{ $t('completeProfileTip') }}</div>
                </div>

                <div style="padding:0 20px;">
                    <div style="padding:10px 0;border-bottom:1px solid #666;text-align: left;">
                        <div style="margin-bottom:5px;">{{ $t('gender') }}</div>
                        <div style="display:flex;gap:15px;">
                            <label><input type="radio" name="gender" v-model="profile.gender" value="1"><span>{{
                                $t('male') }}</span></label>
                            <label><input type="radio" name="gender" v-model="profile.gender" value="2"><span>{{
                                $t('female') }}</span></label>
                        </div>
                    </div>

                    <div style="padding:10px 0;border-bottom:1px solid #666;text-align: left;">
                        <div style="margin-bottom:5px;">{{ $t('sexualOrientation') }}</div>
                        <div style="display:flex;gap:15px;">
                            <label><input type="radio" name="orientation" v-model="profile.sexual" value="1"><span>{{
                                $t('straight') }}</span></label>
                            <label><input type="radio" name="orientation" v-model="profile.sexual" value="0"><span>{{
                                $t('gay') }}</span></label>
                        </div>
                    </div>

                    <div style="padding:10px 0;border-bottom:1px solid #666;text-align: left;">
                        <div style="margin-bottom:5px;">{{ $t('preferAge') }}</div>
                        <div style="display:flex;gap:15px;">
                            <label><input type="radio" name="likeAge" v-model="profile.like_age" value="20"><span>{{
                                $t('age20') }}</span></label>
                            <label><input type="radio" name="likeAge" v-model="profile.like_age" value="30"><span>{{
                                $t('age30') }}</span></label>
                            <label><input type="radio" name="likeAge" v-model="profile.like_age" value="40"><span>{{
                                $t('age40') }}</span></label>
                        </div>
                    </div>

                    <div style="padding:10px 0;border-bottom:1px solid #666;text-align: left;"
                        v-if="profile.gender == '1'">
                        <div style="margin-bottom:5px;">{{ $t('breastType') }}</div>
                        <div style="display:flex;gap:15px;">
                            <label><input type="radio" name="breast" v-model="profile.figure" value="3"><span>{{
                                $t('large') }}</span></label>
                            <label><input type="radio" name="breast" v-model="profile.figure" value="2"><span>{{
                                $t('medium') }}</span></label>
                            <label><input type="radio" name="breast" v-model="profile.figure" value="1"><span>{{
                                $t('small') }}</span></label>
                        </div>
                    </div>
                    <div style="padding:10px 0;border-bottom:1px solid #666;text-align: left;">
                        <div style="margin-bottom:5px;">常住城市（可多填）</div>
                        <textarea v-model="profile.intro" class="intro-input"></textarea>
                    </div>
                    <div style="display:flex;justify-content:center;padding:20px 0;">
                        <div class="modal-btn" @click="">{{ $t('confirm') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 提示弹窗 -->
        <div class="copy-toast" v-if="showToast">
            <div style="font-size:30px;">
                <Icon icon="iconoir:xmark" width="58" v-if="yesno" />
                <Icon icon="iconoir:check" width="58" v-if="yesnoa" />
                <Icon icon="svg-spinners:12-dots-scale-rotate" width="58" v-if="loginno" />
            </div>
            <div>{{ showtext }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import router from '../../router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import request from '@/utils/request';
import { io } from 'socket.io-client';
import moment from 'moment';

const { t } = useI18n();
const route = useRoute();

const baseURL = request.defaults.baseURL || '';
// 跳转详情页并携带动态唯一id
const goDetail = (dynamicId: any) => {
    router.push({
        path: '/dynamicIndex',
        query: { id: dynamicId }
    })
}
// 页面状态
const dynamicList = ref<any[]>([]);
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
const scrollWrap = ref<HTMLElement | null>(null);

// 轮播
const images = ref(["/images/lbta.png", "/images/lbtb.png", "/images/lbtc.png"]);
const currIndex = ref(0);

// 下拉刷新
const pullDistance = ref(0);
const isPulling = ref(false);
const isRefreshing = ref(false);

// 首次登录弹窗
const showFirstLoginModal = ref(false);
const profile = ref({
    gender: '',
    sexual: '',
    like_age: '',
    figure: '',
    intro: ''
});

// Toast
const showToast = ref(false);
const yesno = ref(false);
const yesnoa = ref(false);
const loginno = ref(false);
const showtext = ref('');

// 菜单
const menuList = ref([
    { key: 'a', path: '/index', pathPrefix: '/index', i18nKey: 'home', icon: 'streamline-flex:home-2-solid', unread: 0 },
    { key: 'b', path: '/shop', pathPrefix: '/shop', i18nKey: 'dating', icon: 'tabler:video', unread: 0 },
    { key: 'c', path: '/contacts', pathPrefix: '/contacts', i18nKey: 'contacts', icon: 'material-symbols:group-rounded', unread: 0 },
    { key: 'e', path: '/user', pathPrefix: '/user', i18nKey: 'user', icon: 'ic:baseline-face-6', unread: 0 },
]);

let socket: any = null;

// ==================== Toast ====================
const toast = (text: string, type: 'success' | 'error' | 'loading' = 'success', duration = 2000) => {
    showtext.value = text;
    yesno.value = false;
    yesnoa.value = false;
    loginno.value = false;

    if (type === 'success') yesnoa.value = true;
    if (type === 'error') yesno.value = true;
    if (type === 'loading') loginno.value = true;

    showToast.value = true;
    if (type !== 'loading') {
        setTimeout(() => showToast.value = false, duration);
    }
};



// ==================== 首次进入判断 ====================
const isFirstEnter = ref(false);

const checkFirstEnter = () => {
    if (!localStorage.getItem('home_has_loaded')) {
        isFirstEnter.value = true;
        localStorage.setItem('home_has_loaded', 'true');
    }
};

// ==================== 获取数据 ====================
const getUserDetail = async (isRefresh = false) => {
    try {
        loading.value = true;
        if (isRefresh) isRefreshing.value = true;

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) return;

        // 下拉刷新：页码重置，但不清空列表
        if (isRefresh) {
            page.value = 1;
            finished.value = false;
        }

        // 传参增加 isRefresh 给后端
        const { data: res } = await request.post('/api/index/userimages', {
            page: page.value,
            limit: 10,
            userId: user.id,
            isRefresh: isRefresh // 标记下拉刷新
        });

        if (res.code === 1) {
            const newList = res.data.map((item: any) => ({
                ...item,
                images: (item.images || item.image_url || '').toString()
                    .split(',')
                    .filter((i: string) => i && i.trim())
            }));

            if (isRefresh) {
                // 下拉刷新：新20条 追加到 原有列表【头部】
                dynamicList.value = [...newList, ...dynamicList.value];
            } else {
                // 上拉加载更多：正常追加到尾部
                dynamicList.value.push(...newList);
            }

            finished.value = !res.more;
            if (res.more) page.value++;

            localStorage.setItem('home_cached_list', JSON.stringify(dynamicList.value));
        }
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
        isRefreshing.value = false;
        pullDistance.value = 0;
    }
};
// 保存滚动位置
const handleScroll = () => {
    if (!scrollWrap.value) return;

    // 保存滚动位置
    localStorage.setItem("home_top", String(scrollWrap.value.scrollTop));

    // 上拉加载更多
    if (loading.value || finished.value || isRefreshing.value) return;

    const el = scrollWrap.value;
    const bottomDistance = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (bottomDistance < 300) {   // 距离底部小于300px时触发
        getUserDetail(false);     // false = 加载更多，不是刷新
    }
};
// ==================== H5 下拉刷新 ====================
let startY = 0;

const handleTouchStart = (e: TouchEvent) => {
    if ((scrollWrap.value?.scrollTop || 0) > 5) return;
    startY = e.touches[0].clientY;
    isPulling.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling.value || isRefreshing.value) return;
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    pullDistance.value = Math.min(distance * 0.5, 120);
};

const handleTouchEnd = () => {
    if (pullDistance.value > 70) {
        getUserDetail(true);
    } else {
        pullDistance.value = 0;
    }
    isPulling.value = false;
};

// ==================== 其他函数 ====================
const refreshUnreadBadge = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) return;
    try {
        const { data } = await request.post('/api/chat/unread-total', { userId: user.id });
        if (data.code === 1) {
            menuList.value[2].unread = data.total || 0;   // contacts 是第3个（索引2）
        }
    } catch (err) { }
};

const artist = (item: any) => {
    if (item?.user_id) router.push({ path: '/artist', query: { id: String(item.user_id) } });
};

const isMenuActive = (key: string) => {
    const m = menuList.value.find(x => x.key === key);
    return m ? route.path.startsWith(m.pathPrefix) : false;
};

const activeMenu = (path: string) => {
    router.push({ path, replace: true });
    localStorage.setItem('last_path', path);
};

const user_service = () => router.push('/message/235787');

// 点赞/取消点赞
let likeLock = false;
const toggleLike = async (item: any) => {
    if (likeLock) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
        toast(t('pleaseLogin'), 'error');
        return;
    }
    // 保存点击前状态，接口失败用来还原
    const originIsLike = !!item.isLike;
    const originNum = Number(item.like_num || 0);
    likeLock = true;
    try {
        const { data: res } = await request.post('/api/dynamic/like', {
            dynamic_id: item.dynamic_id,
            user_id: user.id
        });

        if (res.code === 1) {
            if (res.action === 'like') {
                item.isLike = true;
                item.like_num = originNum + 1;
            } else if (res.action === 'unlike') {
                item.isLike = false;
                item.like_num = Math.max(originNum - 1, 0);
            }
            // 点赞成功同步更新本地缓存，解决返回刷新变回原样
            const cacheText = localStorage.getItem('home_cached_list');
            if (cacheText) {
                const cacheList = JSON.parse(cacheText);
                const cacheItem = cacheList.find(d => d.dynamic_id === item.dynamic_id);
                if (cacheItem) {
                    cacheItem.isLike = item.isLike;
                    cacheItem.like_num = item.like_num;
                    localStorage.setItem('home_cached_list', JSON.stringify(cacheList));
                }
            }
        } else {
            // 操作失败还原
            item.isLike = originIsLike;
            item.like_num = originNum;
            toast(res.msg || t('operateFail'), 'error');
        }
    } catch (err) {
        // 网络崩溃还原界面
        item.isLike = originIsLike;
        item.like_num = originNum;
        console.error('点赞异常', err);
        toast(t('networkError'), 'error');
    } finally {
        likeLock = false;
    }
};
const userData = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser = ref({
    id: userData.id || ''
});
const alertVisible = ref(false);
const alertMsg = ref('');
// 收藏/取消收藏（匹配后端接口）
let collectLock = false;
const toggleCollect = async (item: any) => {
    if (collectLock) return;
    const uid = currentUser.value.id;
    if (!uid) {
        alertVisible.value = true;
        alertMsg.value = t('pleaseLogin');
        setTimeout(() => alertVisible.value = false, 2000);
        return;
    }
    const oldIsCollect = !!item.isCollect;
    const oldCollectNum = Number(item.collect_num || 0);
    collectLock = true;
    try {
        const { data: res } = await request.post('/api/dynamic/collect', {
            dynamic_id: item.dynamic_id,
            user_id: uid
        });
        if (res.code === 1) {
            if (res.action === 'collect') {
                item.isCollect = true;
                item.collect_num = oldCollectNum + 1;
            } else {
                item.isCollect = false;
                item.collect_num = Math.max(oldCollectNum - 1, 0);
            }
            // 同步更新本地缓存列表
            const cacheText = localStorage.getItem('home_cached_list');
            if (cacheText) {
                const cacheList = JSON.parse(cacheText);
                const cacheItem = cacheList.find((d: any) => d.dynamic_id === item.dynamic_id);
                if (cacheItem) {
                    cacheItem.isCollect = item.isCollect;
                    cacheItem.collect_num = item.collect_num;
                    localStorage.setItem('home_cached_list', JSON.stringify(cacheList));
                }
            }
        } else {
            item.isCollect = oldIsCollect;
            item.collect_num = oldCollectNum;
            toast(t('operateFail'), 'error');
        }
    } catch (err) {
        item.isCollect = oldIsCollect;
        item.collect_num = oldCollectNum;
        console.error('', err);
        toast(t('networkError'), 'error');
    } finally {
        collectLock = false;
    }
};

// ==================== 生命周期 ====================
const isMobile = ref()
onMounted(() => {
    checkFirstEnter();

    // 非首次进入时恢复缓存
    if (!isFirstEnter.value) {
        const cached = localStorage.getItem('home_cached_list');
        if (cached) {
            dynamicList.value = JSON.parse(cached);
        }
    }

    // 首次进入才请求接口
    if (isFirstEnter.value) {

        getUserDetail(true);
    }

    // ======================
    // ✅ 恢复滚动位置（精准版）
    // ======================
    nextTick(() => {
        setTimeout(() => {
            const el = scrollWrap.value;
            if (!el) return;
            const top = localStorage.getItem('home_top');
            if (top) {
                el.scrollTop = parseInt(top);
            }
        }, 200);
    });

    refreshUnreadBadge();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // if (user.is_first_login === 1) showFirstLoginModal.value = true;

    // Socket
    if (user.id) {
        socket = io(request.defaults.baseURL!, { transports: ['websocket'] });
        socket.on('connect', () => socket.emit('bindUserId', user.id));
        socket.on('new_msg', refreshUnreadBadge);
    }

    // 轮播
    setInterval(() => currIndex.value = (currIndex.value + 1) % images.value.length, 3000);

    // 触摸事件
    nextTick(() => {
        const el = scrollWrap.value;
        if (el) {
            el.addEventListener('touchstart', handleTouchStart, { passive: true });
            el.addEventListener('touchmove', handleTouchMove, { passive: false });
            el.addEventListener('touchend', handleTouchEnd, { passive: true });
        }
    });
    const checkIsMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    };
    isMobile.value = checkIsMobile(); // true = 手机端
});

onUnmounted(() => {
    const el = scrollWrap.value;
    if (el) {
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchmove', handleTouchMove);
        el.removeEventListener('touchend', handleTouchEnd);
    }
    if (socket) socket.disconnect();
});
</script>
<style scoped>
/* 全局布局 */
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
    /* 强制满屏 */
    position: relative;
}

/* 顶部标题 —— 固定 */
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
    /* border-bottom: 1px solid #585555; */
}

.allar-topgfdg {
    height: 25px;
    width: 25px;
    margin-left: 15px;
}

.allar-topgfdg img {
    height: 100%;
    width: 100%;

}

.allar-top-a {
    font-size: 15px;
    font-weight: bold;
    color: #a88035;
    text-align: center;
    flex: 1;
}

.allar-top-r {
    margin-left: auto;
}

/* 内容滚动区域（唯一滚动） */
.content-wrapper {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    bottom: 0 !important;
    padding-bottom: 80px !important;
    background: #222 !important;
}

/* 核心修复：强制撑满，永不露黑 */
.cuekdil {
    width: 100%;
    min-height: 100%;
    background: #222;
    padding-bottom: 10px;
}

:global(html),
:global(body) {
    background: #222 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    overscroll-behavior: none !important;
    /* 彻底禁用弹性回弹 */
}


/* 滚动区域底部强制填满，不留任何缝隙 */
.content-wrapper {
    bottom: 0 !important;
    padding-bottom: 80px !important;
    /* 比导航高10px，彻底覆盖 */
    background: #222 !important;
}

/* 轮播 */
.lueibuo {
    height: 160px;
    margin: 15px;
    border-radius: 8px;
    overflow: hidden !important;
    position: relative;
    width: calc(100% - 30px);
    background-color: #222;
}

.carousel-inner {
    width: 100%;
    height: 100%;
}

.carousel-item {
    width: 100%;
    flex-shrink: 0;
    height: 100%;
    /* 核心：强制拉伸充满，放弃原比例 */
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
}

/* 跑马灯 */
.guahgbui {
    display: flex;
    align-items: center;
    height: 35px;
    margin: 15px;
    border: 1px solid #535353;
    border-radius: 7px;
    padding: 0 10px;
}

.marquee-wrapper {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    height: 36px;
    border-radius: 8px;
}

.marquee-content {
    display: inline-block;
    animation: marquee 10s linear infinite;
    padding-left: 100%;
    color: #fff1b5;
    font-size: 12px;
    line-height: 36px;
}

@keyframes marquee {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-100%);
    }
}

/* 图片 */
.imagesdiva {
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;
    width: 100%;
    cursor: pointer;
}

.imagesdiva:has(img:only-child) {
    max-width: 250px;
    /* 限制宽度 */
}

.imagesdiva img {
    width: auto;
    max-width: 100%;
    max-height: 330px;
    object-fit: contain;
    background: none;
    border-radius: 5px;
    display: block;
}


.imagesdivb {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
}

.imagesdivb img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 5px;
}

.imagesdivc {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
    width: 90%;
    cursor: pointer;
}

.imagesdivc img {
    width: 100%;
    height: 125px;
    object-fit: cover;
    border-radius: 5px;
}

.imagesdivc img:last-child {
    grid-column: 1/3;
}

.imagesdivd {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
    width: 90%;
    cursor: pointer;
}

.imagesdivd img {
    width: 100%;
    height: 125px;
    object-fit: cover;
    border-radius: 5px;
}

/* 列表 */
.inage {
    color: #c7c6c6;
    border-top: 3px solid #000;
    padding-bottom: 20px;
}

.userteataaq {
    margin: 15px 10px 0 10px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 1px solid #fff;
    overflow: hidden;
}

.userteatb-oneaa {
    font-weight: bold;
    font-size: 15px;
}

.userteatb-oneb {
    display: flex;
    text-align: center;
    margin-left: 2px;
    color: #ff33ee;
    margin-bottom: 2px;
}

.userteatb-oneba {
    margin-left: 10px;
}

.contenttext {
    font-size: 15px;
    padding: 10px 0;
    color: #fff;
    text-align: left;
    white-space: pre-wrap;
    word-break: break-word;
}

/* 底部导航 */
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
    /* gap: 4px; */
    cursor: pointer;
    font-size: 11px;
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
    background: #363636;
    color: #fff;
    border-radius: 6px;
    width: 90%;
    position: relative;
    z-index: 1;
    font-size: 13px;
}

.modal-btn {
    background: #8a7000;
    padding: 6px 20px;
    border-radius: 4px;
    cursor: pointer;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 9999;
    min-width: 200px;
}

.userteatb-oneb-no {
    margin-top: 3px;
    display: flex;
    text-align: center;
    margin-left: 5px;
    font-size: 9px;
    background-color: #e200e2;
    border-radius: 20px;
    height: 15px;
    /* 去掉固定宽度，换成自适应 */
    width: auto;
    padding: 0 8px;
    /* 左右留一点内边距，更美观 */
    line-height: 15px;
    align-items: center;
    justify-content: center;
    border: 1px solid #333;
    box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.349);
    font-weight: 999;
    white-space: nowrap;
    /* 防止文字换行 */
    color: #fff;
    /* 文字颜色白色更醒目 */
}

.reimengcesu,
.reimengcesu-twoa-d {
    height: auto !important;
    overflow: visible !important;
}

/* 滚动条隐藏 */
::-webkit-scrollbar {
    display: none;
}

html,
body {
    overscroll-behavior: none;
    margin: 0;
    padding: 0;
    background: #222;
}

.intro-input {
    width: 100%;
    height: 60px;
    background: #fff;
    border: 1px solid #cccccc;
    border-radius: 6px;
    padding: 8px;
    font-size: 15px;
    box-sizing: border-box;
    resize: none;
}

.refresh-content {
    color: #666;
}
</style>