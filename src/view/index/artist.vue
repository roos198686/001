<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 统一顶部 -->
                <div class="allar-top">
                    <div class="allar-top-a" @click="goBack">
                        <Icon icon="tabler:chevron-left" height="30" />
                    </div>
                    <div class="allar-top-r">{{ $t('profile') }}</div>
                </div>

                <!-- 统一滚动容器 -->
                <div class="content-wrapper" ref="scrollWrap" @scroll="saveScrollPos">
                    <div class="cuekdil">
                        <div class="userteat-all">
                            <div class="userteat">
                                <div class="topimage" :style="nameareva"></div>
                                <div class="userteata">
                                    <img :src="baseURL + user.avatar" style="width:100%;height:100%;object-fit:cover;">
                                </div>
                                <div class="userteatb">
                                    <div class="userteatb-one">
                                        <div class="userteatb-onea">{{ user.nickname }}</div>
                                        <div class="userteatb-oneba">
                                            <Icon icon="mingcute:safety-certificate-fill" height="20"
                                                style="color: #f3bb02;" />
                                        </div>
                                        <div class="userteatb-oneb" v-if="user.vip_level != '0'">
                                            <Icon icon="mingcute:flower-2-fill" height="20" />
                                        </div>
                                        <div class="bootrittaa" v-if="currentUser.id == userId"
                                            @click="handlePublishClick">
                                            {{ $t('publish') }}
                                        </div>
                                    </div>
                                    <div style="font-size: 13px;color: #fff;margin-bottom: 10px;">@{{ user.username }}
                                    </div>
                                    <div class="userteatb-two">
                                        <span>{{ $t('height') }}：{{ user.height }}</span>
                                        <span style="margin:0 5px;color:#f102f1;">■</span>
                                        <span>{{ $t('bust') }}：{{ user.figure }}</span>
                                        <span style="margin:0 5px;color:#f102f1;">■</span>
                                        <span>{{ $t('residenceCity') }}：{{ user.city }}</span>
                                    </div>
                                    <div class="userteatb-two" style="margin-top: 5px;">{{ user.intro }}</div>
                                </div>
                            </div>
                            <div class="boot">
                                <div class="bootriaa">
                                    <div @click="heartremix">
                                        <Icon icon="streamline-flex:heart-solid" height="20"
                                            style="color:#d600d6;cursor:pointer;" v-if="isLiked" />
                                        <Icon icon="streamline-flex:heart-remix" height="20"
                                            style="cursor:pointer;color:#d600d6;" v-else />
                                    </div>
                                    <div style="margin:0 20px 0 10px">{{ user.like_count }}</div>
                                    <div @click="heartremix">
                                        <Icon icon="mdi:eye" height="25" style="cursor:pointer;color:#d600d6;" />
                                    </div>
                                    <div style="margin-left:10px">{{ user.view_count }}</div>
                                </div>
                                <div class="bootritt" @click="message" v-if="currentUser.id != userId">{{
                                    $t('messageHer') }}</div>
                            </div>

                            <!-- 动态列表 -->
                            <div style="display: flex;flex-direction: column;">
                                <div class="inage" v-for="(item, i) in dynamicList" :key="i">
                                    <div style="display: flex;flex-direction: row;">
                                        <div class="userteataaq">
                                            <img :src="baseURL + item.avatar"
                                                style="width:100%;height:100%;object-fit:cover;">
                                        </div>
                                        <div style="display: flex;flex-direction: column;flex: 1;margin-right: 20px;"
                                            @click="goDetail(item.id)">
                                            <div style="display: flex;flex-direction: row;margin-top: 10px;">
                                                <div class="userteatb-oneaa">{{ item.nickname }}</div>
                                                <div style="display: flex;flex-direction: row;align-items: flex-end;">
                                                    <div style="margin-left: 5px;">
                                                        <Icon icon="mingcute:safety-certificate-fill" height="15"
                                                            style="color: #f3bb02;" />
                                                    </div>
                                                    <div style="color: #ff33ee;" v-if="user.vip_level != '0'">
                                                        <Icon icon="mingcute:flower-2-fill" height="15" />
                                                    </div>
                                                </div>
                                                <div style="font-size: 11px;padding: 5px 10px;text-align: left;">
                                                    {{ moment(item.created_at).format('YYYY.MM.DD HH:mm') }}
                                                </div>
                                                <div class="bootrittaa" @click="deleteImage(item.dynamic_id)"
                                                    v-if="currentUser.id == userId">
                                                    {{ $t('delete') }}
                                                </div>
                                            </div>
                                            <div style="font-size: 11px;text-align: left;">@{{ item.username }}</div>
                                            <div class="contenttext">{{ item.content }}</div>

                                            <div v-if="item.file_type === 'image' && item.images.length"
                                                class="imagesdiv" :class="getImgClass(item)">
                                                <img v-for="(imgUrl, idx) in item.images" :key="idx"
                                                    :src="baseURL + imgUrl" @click="openPreview(baseURL + imgUrl)">
                                            </div>

                                            <!-- 视频 -->
                                            <div v-if="item.file_type === 'video' && item.video_url"
                                                style="margin-top:8px;text-align: left;">
                                                <video :src="baseURL + item.video_url" controls
                                                    style="width:auto;max-height:380px;border-radius:8px; max-width:100%;"></video>
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
                                                <div
                                                    style="display: flex;flex-direction: row;align-items: center;flex: 1;">
                                                    <Icon icon="iconoir:heart-solid" height="18" style="color:#d600d6;"
                                                        v-if="item.isLike" />
                                                    <Icon icon="iconoir:heart" height="18" style="color:#d600d6;"
                                                        v-else />
                                                    <span style="margin: 0 5px 0 2px">{{ item.like_num ? item.like_num :
                                                        0 }}</span>
                                                </div>
                                                <div
                                                    style="display: flex;flex-direction: row;align-items: center;flex: 1;">
                                                    <span>
                                                        <Icon icon="material-symbols:equalizer-rounded" height="18" />
                                                    </span><span style="font-size: 12px;">{{ item.view_num ?
                                                        item.view_num : 0 }}</span>
                                                </div>
                                                <div
                                                    style="display: flex;flex-direction: row;align-items: center;flex: 1;">
                                                    <span>
                                                        <Icon icon="material-symbols:bookmarks-outline" height="18" />
                                                    </span><span style="font-size: 12px;">{{ item.collect_num ?
                                                        item.collect_num : 0 }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="height: 50px;width: 100%;flex: 1;display: flex;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 发布弹窗 -->
        <div class="copy-toastas" v-if="jdksihjgisg">
            <div class="copy-toastqwpjg">
                <!-- <div
                    style="color: #fff;background-color: #222;width: 100%;font-size: 16px;height: 40px;line-height: 40px;font-weight: 900;">
                    {{ $t('postDaily') }}
                </div> -->
                <div
                    style="width: 100%;flex: 1;display: flex;flex-direction: column;overflow-y: auto;background-color: #fff;height: 0;">
                    <div style="font-size: 15px;color: #000;width: 100%;background-color: #fff;">
                        <div style="display: flex;flex-direction: row;align-items: center;margin-top: 10px;">
                            <div style="display: flex;flex-direction: row;">
                                <div class="buttdgra" @click="closePublishModal">{{ $t('cancelText') }}</div>
                            </div>
                            <div class="buttdgrc" @click="confirmUpload"
                                v-if="previewImages.length > 0 || videoPreview">
                                {{ $t('publish') }}
                            </div>
                        </div>
                        <div style="display: flex;padding: 15px;">
                            <div style="display: flex;width: 100%;font-size: 14px;">
                                <textarea v-model="inputMessage" class="auto-textarea" :placeholder="$t('artist_input_tip')"></textarea>
                            </div>
                        </div>
                    </div>
                    <div
                        style="position: fixed; left: 0; right: 0; bottom: 0; max-width: 500px; margin: 0 auto 50px auto; background: #fff; z-index: 999;">
                        <!-- 图片预览区域 -->
                        <div v-if="previewImages.length > 0"
                            style="padding:10px 0px;background-color: #fff;width: 100%;align-items: center;margin-top: -2px;">
                            <div
                                style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px;padding:10px 15px;">
                                <img v-for="(url, idx) in previewImages" :key="idx" :src="url"
                                    style="width:100%;height:125px;object-fit:cover;border-radius:8px;">
                            </div>
                        </div>

                        <!-- 视频预览区域 -->
                        <div v-if="videoPreview" style="padding:10px 25px;background:#fff;text-align: left;">
                            <video :src="videoPreview" controls
                                style="width:auto;max-height:240px;border-radius:8px;"></video>
                        </div>

                        <div style="display:flex;padding:0 10px;">
                            <!-- 选图片按钮 -->
                            <div class="buttdgrb" @click="selectImageOnly">
                                {{ fileType === 'image' ? $t('artist_rechoose_img'):  $t('artist_choose_img') }}
                            </div>
                            <!-- 选视频按钮 -->
                            <div class="buttdgrb" @click="selectVideoOnly" style="background-color:#6c5ce7;">
                                {{ fileType === 'video' ?  $t('artist_rechoose_video') :  $t('artist_choose_video') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 文件选择：支持图片+视频，accept 合并 -->
        <input ref="fileInputRef" type="file" accept="image/*,video/*" multiple style="display:none"
            @change="handleFileChange" />

        <div class="copy-toast" v-if="showToast">
            <div style="font-size: 30PX;">
                <Icon icon="iconoir:check" width="58" />
            </div>
            <div class="toast-text" style="font-size: 16px;">{{ showtext }}</div>
        </div>

        <div class="img-preview" v-if="previewVisible" @click="closePreview">
            <img :src="previewUrl" class="preview-img" />
        </div>

        <div v-if="alertVisible" class="custom-modal">
            <div class="modal-box" @click.stop>
                <Icon icon="iconoir:xmark" width="58" />
                <div class="modal-text">{{ alertMsg }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed, nextTick, watch, onBeforeUnmount } from 'vue';

import { Icon } from '@iconify/vue';
import router from '../../router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import request from '@/utils/request';
import moment from 'moment';
const showToast = ref<boolean>(false);
const jdksihjgisg = ref<boolean>(false);
const alertVisible = ref(false);
const alertMsg = ref('');
const showtext = ref('');

const baseURL = request.defaults.baseURL || '';
const { t } = useI18n();
const route = useRoute();
const userId = ref(route.query.id || 1);
const inputMessage = ref('');

// ========== 新增：文件相关变量 ==========
// 文件类型：image 图片 / video 视频 / '' 未选择
const fileType = ref<'image' | 'video' | ''>('');
// 图片列表
const selectedFiles = ref<File[]>([])
const previewImages = ref<string[]>([])
// 视频单独（只允许一个）
const videoFile = ref<File | null>(null)
const videoPreview = ref<string>('')

const dynamicList = ref<any>([])

// 跳转详情页并携带动态唯一id
const goDetail = (dynamicId: any) => {
    router.push({
        path: '/dynamicIndex',
        query: { id: dynamicId }
    })
}

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectImageOnly = () => {
    // 强制只能选图片
    fileInputRef.value?.setAttribute('accept', 'image/*')
    fileInputRef.value?.removeAttribute('multiple')
    fileInputRef.value?.setAttribute('multiple', 'multiple') // 图片允许多选
    fileInputRef.value?.click()
}

// 选视频（只能选视频，只能1个）
const selectVideoOnly = () => {
    // 强制只能选视频
    fileInputRef.value?.setAttribute('accept', 'video/*')
    fileInputRef.value?.removeAttribute('multiple') // 视频只能1个，关掉multiple
    fileInputRef.value?.click()
}
// 关闭发布弹窗 + 清空选择
const closePublishModal = () => {
    jdksihjgisg.value = false
    resetFileData()
}

// 重置所有文件数据
const resetFileData = () => {
    selectedFiles.value = []
    previewImages.value = []
    videoFile.value = null
    videoPreview.value = ''
    fileType.value = ''
    inputMessage.value = ''
}


// 文本域自适应高度
const autoHeight = () => {
    const el = document.querySelector('.auto-textarea') as HTMLTextAreaElement
    if (!el) return
    // 先重置高度，再根据内容撑开
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
}

// 监听内容变化，自动调整高度
watch(inputMessage, () => {
    nextTick(() => autoHeight())
}, { immediate: true })
// 文件选择回调：区分图片/视频 + 互斥 + 数量限制
const handleFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (!files || files.length === 0) return

    const fileArr = Array.from(files)
    // 先清空原有数据（二选一）
    resetFileData()

    // 判断第一个文件类型，决定本次是图片还是视频
    const firstFile = fileArr[0]
    const isVideo = firstFile.type.startsWith('video/')
    const isImage = firstFile.type.startsWith('image/')

    if (isVideo) {
        // 视频：只保留第一个，最多1个
        fileType.value = 'video'
        const targetVideo = fileArr[0]
        videoFile.value = targetVideo
        videoPreview.value = URL.createObjectURL(targetVideo)
    } else if (isImage) {
        // 图片：最多4张
        fileType.value = 'image'
        const imgList = fileArr.slice(0, 4)
        selectedFiles.value = imgList
        previewImages.value = imgList.map(file => URL.createObjectURL(file))
    } else {
        // 不支持的文件类型
        showToast.value = true
        showtext.value = t('artist_file_tip')
        setTimeout(() => showToast.value = false, 1500)
        return
    }
}

// 图片样式分类
const getImgClass = (item: any) => {
    const len = Array.isArray(item.images) ? item.images.length : 0
    if (len === 1) return 'imagesdiva'
    if (len === 2) return 'imagesdivb'
    if (len === 3) return 'imagesdivc'
    return 'imagesdivd'
}
//背景图
const nameareva = computed(() => {
    // 有自定义背景用用户图，没有用默认底图
    let bgFullUrl: string;
    if (user.avatar_bg) {
        // 有自定义背景：拼接接口域名
        bgFullUrl = baseURL + user.avatar_bg;
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

// ==========================
// 发布上传：区分 图片 / 视频
const confirmUpload = async () => {
    if (previewImages.value.length === 0 && !videoFile.value) {
        showToast.value = true
        showtext.value = t('pleaseSelectImage')
        setTimeout(() => showToast.value = false, 1000)
        return
    }

    const userStr = localStorage.getItem('user');
    const userInfo = userStr ? JSON.parse(userStr) : {};
    const group_user = userInfo.group_user || 0;
    const dynamicId = Date.now() + '' + Math.random().toString(36).slice(2, 10)

    try {
        const formData = new FormData()
        formData.append('user_id', currentUser.id)
        formData.append('content', inputMessage.value)
        formData.append('dynamic_id', dynamicId)
        formData.append('group_user', group_user)
        formData.append('username', userInfo.username || '')
        formData.append('avatar', userInfo.avatar || '')
        formData.append('nickname', userInfo.nickname || '')

        // 统一字段 image_files
        if (fileType.value === 'image') {
            selectedFiles.value.forEach(file => {
                formData.append('image_files', file)
            })
        } else if (fileType.value === 'video' && videoFile.value) {
            formData.append('image_files', videoFile.value)
        }

        await request.post('/api/artist/batchImage', formData)

        showToast.value = true
        showtext.value = t('publishSuccess')
        setTimeout(() => showToast.value = false, 1000)

        closePublishModal()
        getUserDetail()
    } catch (err) {
        console.error(err)
        showToast.value = true
        showtext.value = t('publishFailed')
        setTimeout(() => showToast.value = false, 1000)
    }
}

interface UserInfo {
    height: string;
    figure: string;
    city: string;
    avatar: string;
    like_count: number;
    intro: string;
    nickname: string;
    vip_level: string;
    username: string;
    view_count: string;
    role_level: string;
    group_user: string;
    avatar_bg: string;
}

const user = reactive<UserInfo>({
    height: '',
    figure: '',
    city: '',
    avatar: '',
    like_count: 0,
    intro: '',
    nickname: '',
    vip_level: '',
    username: '',
    view_count: '',
    role_level: '',
    group_user: '',
    avatar_bg: ''
});

const deleteImage = async (dynamic_id: any) => {
    try {
        await request.post('/api/artist/image/delete', {
            dynamic_id: dynamic_id
        });
        showToast.value = true;
        showtext.value = t('deleteSuccess');
        setTimeout(() => showToast.value = false, 1000);
        getUserDetail();
    } catch (err) {
        showToast.value = true;
        showtext.value = t('deleteFailed');
        setTimeout(() => showToast.value = false, 1000);
    }
};

const isLiked = ref(false);
const userData = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser = reactive({
    id: userData.id || '',
    role_level: userData.role_level || '0'
});

const handlePublishClick = () => {
    const role = Number(user.role_level) || 0;
    if (role > 1) {
        jdksihjgisg.value = true;
        resetFileData()
    } else {
        alertVisible.value = true;
        alertMsg.value = t('noPermissionTip');
        setTimeout(() => {
            alertVisible.value = false;
        }, 2000);
    }
};

const getUserDetail = async () => {
    try {
        const { data: res } = await request.post('/api/user/detail', {
            id: userId.value,
            current_user_id: currentUser.id
        });
        if (res.code === 1) {
            user.nickname = res.user.nickname || '';
            user.vip_level = res.user.vip_level || '';
            user.height = res.user.height || '';
            user.figure = res.user.figure || '';
            user.city = res.user.city || '';
            user.avatar = res.user.avatar || '';
            user.like_count = res.user.like_count || 0;
            user.intro = res.user.intro || '';
            user.username = res.user.username || '';
            user.view_count = res.user.view_count || '';
            user.role_level = res.user.role_level || '0';
            user.group_user = res.user.group_user || '0';
            user.avatar_bg = res.user.avatar_bg || '';
            isLiked.value = res.isLiked || false;
        }

        // 获取动态列表 自动兜底images为数组
        const { data: imgRes } = await request.post('/api/user/imagesnew', {
            user_id: userId.value
        });
        if (imgRes.code === 1) {
            dynamicList.value = imgRes.data.map((row: any) => {
                const rawImg = (row.image_url ?? '').toString();
                const imgArr = rawImg.split(',').filter((s: string) => s.trim() !== '');
                return {
                    ...row,
                    images: imgArr,
                    isLike: Boolean(row.isLike ?? 0),
                    isCollect: Boolean(row.isCollect ?? 0)
                };
            });
        }
    } catch (err) {
        console.log( err);
    }
};

const heartremix = async () => {
    try {
        const { data: res } = await request.post('/api/user/like', {
            user_id: userId.value,
            liked_by: currentUser.id
        });
        if (res.code === 1) {
            if (res.action === 'like') {
                isLiked.value = true;
                user.like_count++;
            } else {
                isLiked.value = false;
                user.like_count--;
            }
        }
    } catch (err) {
        console.log(err);
    }
};

const goBack = () => router.back();
const message = () => router.push(`/message/${userId.value}`);

const previewVisible = ref(false);
const previewUrl = ref('');
const openPreview = (url: string) => {
    previewUrl.value = url;
    previewVisible.value = true;
    document.body.style.overflow = 'hidden';
};
const closePreview = () => {
    previewVisible.value = false;
    document.body.style.overflow = 'auto';
}
const scrollWrap = ref<HTMLElement | null>(null);
// 保存滚动位置
const saveScrollPos = () => {
    if (!scrollWrap.value) return;
    localStorage.setItem('profile_scroll_top', String(scrollWrap.value.scrollTop));
};

// 离开页面强制存一次
onBeforeUnmount(() => {
    if (scrollWrap.value) {
        localStorage.setItem('profile_scroll_top', String(scrollWrap.value.scrollTop));
    }
});

watch(dynamicList, () => {
    nextTick(() => {
        setTimeout(() => {
            const top = localStorage.getItem('profile_scroll_top');
            if (scrollWrap.value && top) {
                scrollWrap.value.scrollTop = Number(top);
            }
        }, 300);
    });
}, { once: true });

onMounted(() => {
    getUserDetail();
});
</script>

<style scoped>
/* 你原来所有样式完全保留，没动 */
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
    background-color: #222;
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
    margin-left: 10px;
    cursor: pointer;
    color: #a88035;
    width: 30px;
    display: flex;
}

.allar-top-r {
    font-size: 15px;
    font-weight: bold;
    color: #a88035;
    text-align: center;
    width: 100%;
    margin-right: 40px;
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
}

.cuekdil {
    width: 100%;
    min-height: 100%;
}

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

.img-preview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
}

.imageselel {
    background: rgb(192, 126, 4);
    color: white;
    font-size: 11px;
    font-weight: bold;
    text-align: right;
    margin-left: auto;
    cursor: pointer;
    padding: 0 5px;
    border-radius: 4px;
}

.copy-toastas {
    position: fixed;
    width: 100%;
    max-width: 500px;
    min-width: 200px;
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    color: #fff;
    display: flex;
    flex-direction: column;
    z-index: 9999;
}

.copy-toastqwpjg {
    width: 100%;
    height: 100%;
    background: #222;
    color: #fff;
    display: flex;
    flex-direction: column;
    z-index: 9999;
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
    font-size: 12px;
}

.auto-textarea {
    width: 100%;
    min-height: 300px;
    /* 初始最小高度 */
    max-height: 100%;
    /* 最大高度，超出滚动 */
    padding: 8px 12px;
    font-size: 15px;
    line-height: 1.5;
    background: #fff;
    border: none;
    /* 去掉边框 */
    outline: none;
    /* 去掉聚焦外边框 */
    resize: none;
    /* 禁止手动拖拽大小 */
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-all;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.auto-textarea::-webkit-scrollbar {
    display: none;
}

.buttdgra {
    background-color: rgb(92, 92, 92);
    padding: 3px 10px;
    font-size: 13px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    margin-left: 15px;
}

.buttdgrb {

    background-color: #009744;
    padding: 5px 10px;
    font-size: 13px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    margin-left: 10px;
}

.buttdgrc {
    background-color: rgb(199, 6, 247);
    padding: 3px 10px;
    font-size: 13px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    text-align: right;
    margin-left: auto;
    margin-right: 15px;
}

.contenttext {
    font-size: 15px;
    padding-bottom: 10px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    word-break: break-word;
}

.custom-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.192);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    color: #c7c7c7;
}

.modal-box {
    background: #000000b4;
    border-radius: 12px;
    padding: 20px 20px 50px 20px;
    display: flex;
    flex-direction: column;
    min-width: 200px;
    text-align: center;
    align-items: center;
    justify-content: center;
}

.topimage {
    height: 100px;
    width: 100%;
    /* background-image: url("/images/userbg.png"); */

}

.userteat-all {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    background-color: #222;
}

.userteat {
    display: flex;
    flex-direction: column;
}

.userteata {
    margin: -20px 0 0 20px;
    height: 60px;
    width: 60px;
    border-radius: 90px;
    overflow: hidden;
    position: relative;
    border: 2px solid #ffffff;
}

.userteataaq {
    margin: 15px 10px 0 20px;
    height: 35px;
    width: 35px;
    border-radius: 90px;
    overflow: hidden;
    position: relative;
    border: 1px solid #ffffff;
}

.userteatb {
    flex: 1;
    margin: 0 20px 20px 20px;
    color: #8f8f8f;
    text-align: left;
    color: #f102f1;
}

.userteatb-one {
    color: #fff;
    text-align: left;
    margin: 10px 0 0 0;
    display: flex;
    flex-direction: row;
    align-items: end;
}

.userteatb-oneaa {
    font-weight: bold;
    font-size: 15px;
}

.userteatb-onea {
    font-weight: bold;
    font-size: 25px;
}

.userteatb-oneb {
    display: flex;
    text-align: center;
    margin-left: 2px;
    color: #ff33ee;
    margin-bottom: 5px;
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
    width: auto;
    padding: 0 8px;
    line-height: 15px;
    align-items: center;
    justify-content: center;
    border: 1px solid #333;
    box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.349);
    font-weight: 999;
    white-space: nowrap;
    color: #fff;
}

.userteatb-oneba {
    margin-left: 10px;
}

.userteatb-onec {
    margin-top: 3px;
    text-align: right;
    margin-left: auto;
    font-size: 13px;
    background-color: #c97d0b;
    border-radius: 5px;
    padding: 3px 0;
}

.userteatb-two {
    color: #dad9d8;
    font-size: 12px;
    word-break: break-all;
    white-space: normal;
}

.userteat-all::-webkit-scrollbar {
    display: none;
}

.inage {
    color: #c7c6c6;
    border-width: 1px 0 0 0;
    border-style: solid;
    border-color: #000;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.boot {
    display: flex;
    flex-direction: row;
    align-items: center;

    background-color: #38383896;
    border-width: 1px 0 0 0;
    border-style: solid;
    border-color: #000;
    padding: 5px 15px;
}

.bootriaa {
    color: #fdfdfd;
    font-size: 13px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 5px 10px 0 0;
}

.bootritt {
    background-color: #d600d6;
    text-align: right;
    margin-left: auto;
    font-size: 12px;
    padding: 3px 15px;
    border-radius: 50px;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 0 5px 2px rgba(255, 235, 251, 0.349);
}

.bootrittaa {
    background-color: #131313;
    text-align: right;
    margin-left: auto;
    font-size: 13px;
    padding: 2px 10px;
    border-radius: 50px;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 0 1px 1px rgba(255, 235, 251, 0.349);
}

.imagesdiva {
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;
    width: 100%;
    cursor: pointer;
}

.imagesdiva:has(img:only-child) {
    max-width: 250px;
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
    width: 100%;
    cursor: pointer;
}

.imagesdivb img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: #111;
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
    background: #222;
    border-radius: 5px;
}

.imagesdivc img:last-child {
    grid-column: 1 / 3;
    height: 125px;
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
    background: #222;
    border-radius: 5px;
}
</style>