<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all">
                <!-- 顶部导航 -->
                <div class="allar-top">
                    <div class="allar-top-a" @click="goBack">
                        <Icon icon="tabler:chevron-left" height="30" />
                    </div>
                    <div class="allar-top-r">{{ $t('dynam.post') }}</div>
                </div>

                <!-- 滚动容器 -->
                <div class="content-wrapper">
                    <div class="cuekdil">
                        <!-- 动态列表 -->
                        <div class="dynamic-list">
                            <div class="inage" v-for="(item, i) in dynamicList" :key="item.dynamic_id"
                                style="border-bottom:3px solid #000;padding-top: 10px;">
                                <div style="display: flex;flex-direction: row;padding-bottom: 5px;">
                                    <div class="userteataaq" @click="goUserPage(item.user_id)">
                                        <img :src="baseURL + item.avatar"
                                            style="width:100%;height:100%;object-fit:cover;">
                                    </div>
                                    <div style="display: flex;flex-direction: column;flex: 1;margin-right: 20px;">
                                        <div
                                            style="display: flex;flex-direction: row;margin-top: 10px;align-items: end;">
                                            <div class="userteatb-oneaa">{{ item.nickname }}</div>

                                            <div class="userteatb-oneba">
                                                <Icon icon="mingcute:safety-certificate-fill" height="15"
                                                    style="color: #f3bb02;" />
                                            </div>
                                            <div class="userteatb-oneb" v-if="item.vip_level && item.vip_level !== '0'">
                                                <Icon icon="mingcute:flower-2-fill" height="15" />
                                            </div>
                                            <div
                                                style="font-size: 11px;padding: 5px 10px;text-align: right;margin-left: auto; color:#999;">
                                                {{ moment(item.created_at).format('YYYY.MM.DD HH:mm') }}
                                            </div>
                                        </div>
                                        <div style="font-size: 13px;text-align: left;color:#999;">@{{ item.username }}
                                        </div>

                                    </div>
                                </div>
                                <div style="padding: 0 20px;">
                                    <div class="contenttext">{{ item.content }}</div>
                                    <!-- 图片区域 -->
                                    <div class="imagesdiv" :class="getImgClass(item)"
                                        v-if="item.file_type === 'image' && item.images.length">
                                        <img v-for="(img, idx) in item.images" :key="idx" :src="baseURL + img"
                                            @click="openPreview(baseURL + img)">
                                    </div>

                                    <!-- 视频区域：高度限制240px，宽度自适应原比例，不拉伸 -->
                                    <div v-if="item.file_type === 'video' && item.video_url"
                                        style="margin-top:8px; text-align:left;">
                                        <video :src="baseURL + item.video_url" controls style="max-height: 380px;width: auto;max-width: 100%; border-radius: 8px; display: block;" @click="openFullscreen($event.target)"></video>
                                    </div>
                                    <!-- 操作栏 点赞/评论/收藏/浏览 -->
                                    <div class="boot" style="margin-top:12px;">
                                        <div class="bootriaa">
                                            <div style="flex: 1;" @click="showCommentModal = true">
                                                <span>
                                                    <Icon icon="majesticons:chat-line" height="18"
                                                        style="color:#d600d6;" />
                                                </span>
                                                <span style="margin: 0 5px 0 2px">{{ item.comment_num }}</span>
                                            </div>
                                            <div style="flex: 1;" @click="toggleLike(item)">
                                                <Icon icon="iconoir:heart-solid" height="18" style="color:#d600d6;"
                                                    v-if="item.isLike" />
                                                <Icon icon="iconoir:heart" height="18" style="color:#d600d6;" v-else />
                                                <span style="margin: 0 5px 0 2px">{{ item.like_num }}</span>
                                            </div>
                                            <div style="flex: 1;">
                                                <Icon icon="material-symbols:equalizer-rounded" height="18"
                                                    style="color:#d600d6;" />
                                                <span style="margin: 0 5px 0 2px">{{ item.view_num }}</span>
                                            </div>
                                            <div style="flex: 1;" @click="toggleCollect(item)">
                                                <Icon icon="material-symbols:bookmarks-outline" height="18"
                                                    style="color:#d600d6;" />
                                                <span style="margin: 0 5px 0 2px">{{ item.collect_num }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="empty-tip" v-if="!loading && dynamicList.length === 0">
                            {{ $t('dynam.emptyData') }}
                        </div>
                        <div class="load-tip" v-if="loading">{{ $t('dynam.loading') }}</div>
                        <div class="load-tip" v-if="noMore && dynamicList.length">{{ $t('dynam.noMore') }}</div>

                        <div class="page-comment-wrap">
                            <div class="page-comment-item" v-for="c in commentList" :key="c.id">
                                <div class="c-avatar">
                                    <img :src="baseURL + c.avatar">
                                </div>
                                <div class="c-body">
                                    <div class="c-name">{{ c.nickname }}</div>
                                    <div class="c-text">{{ c.content }}</div>
                                    <!-- 展示评论图片 -->
                                    <div v-if="c.images" class="imagesdiv" :class="c.images.length == 1 ? 'imagesdiva' :
                                        c.images.length == 2 ? 'imagesdivb' :
                                            c.images.length == 3 ? 'imagesdivc' : 'imagesdivd'">
                                        <img v-for="(img, idx) in c.images.split(',')" :key="idx" :src="baseURL + img"
                                            @click="openPreview(baseURL + img)" />
                                    </div>

                                    <!-- 展示评论视频 -->
                                    <div v-if="c.video" style="margin:6px 0;">
                                        <video :src="baseURL + c.video" style="width:60%; border-radius:4px;" controls
                                            @click="openFullscreen($event.target)"></video>
                                    </div>
                                    <div class="c-time">{{ moment(c.created_at).format('YYYY.MM.DD HH:mm') }}</div>
                                </div>
                            </div>
                            <div class="empty-comment" v-if="commentList.length === 0">{{ $t('dynam.emptyComment') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 评论弹窗 -->
        <div class="copy-toastas" v-if="showCommentModal"
            style="position:fixed;top:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:999;">
            <div class="copy-toastqwpjg"
                style="width:100%;height:100%;background:#fff;display:flex;flex-direction:column;">
                <!-- 顶部栏：左上角取消、右上角发送 -->
                <div
                    style="display:flex;justify-content:space-between;align-items:center;padding:10px 15px;border-bottom:1px solid #eee;font-size: 14px;">
                    <div style="color: #000;" @click="showCommentModal = false">{{ $t('dynam.cancel') }}</div>
                    <div>
                        <div class="buttdgrc" @click="sendComment">{{ $t('dynam.send') }}</div>
                    </div>
                </div>

                <!-- 输入滚动区域 -->
                <div style="overflow-y:auto;margin:15px;flex:1;">
                    <textarea ref="textDom" v-model="commentInput" :placeholder="$t('dynam.inputComment')"
                        style="width:97%;min-height:80px;border:none;resize:none;overflow:hidden;outline:none;background:transparent;"
                        @input="changeHeight"></textarea>
                </div>

                <!-- 底部上传区域 -->
                <div style="padding:12px 15px;border-top:1px solid #eee;color: #000;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <!-- 图片上传 -->
                        <label style="cursor:pointer;">
                            <input type="file" accept="image/*" multiple style="display:none;"
                                @change="handleImageUpload" />
                            <span
                                style="font-size: 13px;border: 1px solid #ccc;padding: 2px 5px;border-radius: 6px;background-color: #eee;">{{
                                $t('dynam.addImg') }}</span>
                        </label>
                        <!-- 视频上传 -->
                        <label style="cursor:pointer;">
                            <input type="file" accept="video/*" style="display:none;" @change="handleVideoUpload" />
                            <span
                                style="font-size: 13px;border: 1px solid #ccc;padding: 2px 5px;border-radius: 6px;background-color: #eee;">{{
                                $t('dynam.addVideo') }}</span>
                        </label>
                    </div>
                    <!-- 预览区域 -->
                    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
                        <!-- 图片预览 -->
                        <div v-for="(item, idx) in imgList" :key="idx"
                            style="width:70px;height:70px;position:relative;">
                            <img :src="item.preview"
                                style="width:100%;height:100%;object-fit:cover;border-radius:4px;" />
                            <span @click="delImg(idx)"
                                style="position:absolute;top:-6px;right:-6px;background:#000;color:#fff;border-radius:50%;width:18px;height:18px;text-align:center;line-height:18px;font-size:12px;cursor:pointer;">×</span>
                        </div>
                        <!-- 视频预览 -->
                        <div v-if="videoItem" style="width:70px;height:70px;position:relative;">
                            <video :src="videoItem.preview"
                                style="width:100%;height:100%;object-fit:cover;border-radius:4px;"></video>
                            <span @click="delVideo"
                                style="position:absolute;top:-6px;right:-6px;background:#000;color:#fff;border-radius:50%;width:18px;height:18px;text-align:center;line-height:18px;font-size:12px;cursor:pointer;">×</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 大图预览 -->
        <div class="img-preview" v-if="previewVisible" @click="closePreview">
            <img :src="previewUrl" class="preview-img" />
        </div>

        <!-- Toast提示 -->
        <div class="copy-toast" v-if="showToast">
            <div style="font-size: 30PX;">
                <Icon icon="iconoir:check" width="58" />
            </div>
            <div class="toast-text" style="font-size: 16px;">{{ toastText }}</div>
        </div>

        <!-- 弹窗提示 -->
        <div v-if="alertVisible" class="custom-modal">
            <div class="modal-box" @click.stop>
                <Icon icon="iconoir:xmark" width="58" />
                <div class="modal-text">{{ alertMsg }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import router from '../../router';
import { useRoute } from 'vue-router';
import request from '@/utils/request';
import moment from 'moment';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const route = useRoute();
const baseURL = request.defaults.baseURL || '';

// 弹窗状态
const showToast = ref(false);
const toastText = ref('');
const alertVisible = ref(false);
const alertMsg = ref('');
const showCommentModal = ref(false);

// 当前登录用户
const userData = JSON.parse(localStorage.getItem('user') || '{}');
const currentUser = reactive({
    id: userData.id || '',
    role_level: userData.role_level || '0'
});

// 分页
const loading = ref(false);
const noMore = ref(false);
const dynamicList = ref<any[]>([]);

// 评论
const curDynamicId = ref('');
const commentList = ref<any[]>([]);

// 图片预览
const previewVisible = ref(false);
const previewUrl = ref('');

// 返回
const goBack = () => router.back();

// 跳转用户主页
const goUserPage = (uid: number) => {
    router.push({ path: '/artist', query: { id: uid } });
};

// 多图样式
const getImgClass = (item: any) => {
    const len = Array.isArray(item.images) ? item.images.length : 0
    if (len === 1) return 'imagesdiva'
    if (len === 2) return 'imagesdivb'
    if (len === 3) return 'imagesdivc'
    return 'imagesdivd'
};

// 大图预览
const openPreview = (url: string) => {
    previewUrl.value = url;
    previewVisible.value = true;
    document.body.style.overflow = 'hidden';
};
// 视频全屏
const openFullscreen = (target: EventTarget) => {
    const videoEl = target as HTMLVideoElement;
    if (!videoEl) return;

    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        if (videoEl.requestFullscreen) {
            videoEl.requestFullscreen();
        } else if ((videoEl as any).webkitRequestFullscreen) {
            (videoEl as any).webkitRequestFullscreen();
        } else if ((videoEl as any).msRequestFullscreen) {
            (videoEl as any).msRequestFullscreen();
        }
    }
};
const closePreview = () => {
    previewVisible.value = false;
    document.body.style.overflow = 'auto';
};

const commentInput = ref('')
const textDom = ref<HTMLTextAreaElement | null>(null)

// 上传资源存储
const imgList = ref<{ file: File; preview: string }[]>([])
const videoItem = ref<{ file: File; preview: string } | null>(null)

// textarea自动增高
const changeHeight = () => {
    if (!textDom.value) return
    textDom.value.style.height = 'auto'
    textDom.value.style.height = textDom.value.scrollHeight + 'px'
}

// 选择图片：自动清空视频
const handleImageUpload = (e: Event) => {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (!files) return

    // 存在视频，直接清空视频资源
    if (videoItem.value) {
        URL.revokeObjectURL(videoItem.value.preview)
        videoItem.value = null
    }

    const remain = 4 - imgList.value.length
    if (remain <= 0) {
        alertVisible.value = true;
        alertMsg.value = t('dynam.maxImg4');
        setTimeout(() => alertVisible.value = false, 2000);
        target.value = ''
        return
    }

    const addNum = Math.min(files.length, remain)
    for (let i = 0; i < addNum; i++) {
        const file = files[i]
        const preview = URL.createObjectURL(file)
        imgList.value.push({ file, preview })
    }
    target.value = ''
}

// 选择视频：自动清空全部图片
const handleVideoUpload = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    // 存在图片，批量释放预览并清空数组
    if (imgList.value.length > 0) {
        imgList.value.forEach(item => URL.revokeObjectURL(item.preview))
        imgList.value = []
    }

    // 替换新视频
    if (videoItem.value) {
        URL.revokeObjectURL(videoItem.value.preview)
    }
    const preview = URL.createObjectURL(file)
    videoItem.value = { file, preview }
    target.value = ''
}

// 删除单张图片
const delImg = (index: number) => {
    URL.revokeObjectURL(imgList.value[index].preview)
    imgList.value.splice(index, 1)
}

// 删除视频
const delVideo = () => {
    if (videoItem.value) {
        URL.revokeObjectURL(videoItem.value.preview)
        videoItem.value = null
    }
}

// 发送提交
const sendComment = async () => {
    if (!curDynamicId.value) {
        alertVisible.value = true;
        alertMsg.value = t('dynam.noDynamicId');
        setTimeout(() => alertVisible.value = false, 2000);
        return;
    }
    if (!currentUser.id) {
        alertVisible.value = true;
        alertMsg.value = t('dynam.needLogin');
        setTimeout(() => alertVisible.value = false, 2000);
        return;
    }
    if (!commentInput.value.trim() && imgList.value.length === 0 && !videoItem.value) {
        alertVisible.value = true;
        alertMsg.value = t('dynam.emptyCommentTip');
        setTimeout(() => alertVisible.value = false, 2000);
        return;
    }

    const formData = new FormData();
    // 后端必填参数补上
    formData.append('dynamic_id', curDynamicId.value);
    formData.append('user_id', currentUser.id);
    formData.append('reply_id', ''); // 无回复人填空
    formData.append('content', commentInput.value.trim());

    // 多张图片
    imgList.value.forEach((item, i) => {
        formData.append('images', item.file);
    });
    // 单个视频
    if (videoItem.value) {
        formData.append('video', videoItem.value.file);
    }

    try {
        // 改用封装好的request，自动带baseURL、token
        const { data } = await request.post('/api/dynamic/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (data.code === 1) {
            // 清空表单
            commentInput.value = '';
            imgList.value.forEach(item => URL.revokeObjectURL(item.preview));
            imgList.value = [];
            if (videoItem.value) {
                URL.revokeObjectURL(videoItem.value.preview);
                videoItem.value = null;
            }
            showCommentModal.value = false;
            // 刷新评论列表 + 增加评论数量
            await loadComment();
            const target = dynamicList.value.find(d => d.dynamic_id === curDynamicId.value);
            if (target) target.comment_num += 1;
        } else {
            console.error('err');
        }
    } catch (err) {
        console.error(err);
    }
};
// 加载单条动态详情（修复图片渲染BUG）
const loadDynamicList = async () => {
    if (loading.value) return;
    loading.value = true;
    try {
        const id = route.query.id
        if (!id) {
            dynamicList.value = [];
            loading.value = false;
            return
        }
        const { data: res } = await request.post('/api/dynamic/detail', {
            id,
            user_id: currentUser.id
        });
        if (res.code === 1) {
            const data = res.data
            const imgArr = (data.image_url || '').toString().split(',').filter((s: string) => s.trim());

            const formatItem = {
                ...data,
                images: imgArr,
                // 绑定后端视频字段：和你数据库 video_url 保持一致
                video_url: data.video_url || '',
                isLike: Boolean(data.isLike ?? 0),
                isCollect: Boolean(data.isCollect ?? 0)
            }
            dynamicList.value = [formatItem]
            curDynamicId.value = data.dynamic_id
            await loadComment()
        }
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
}


// 点赞/取消点赞（匹配后端接口）
let likeLock = false;
const toggleLike = async (item: any) => {
    if (likeLock) return;
    if (!currentUser.id) {
        alertVisible.value = true;
        alertMsg.value = t('dynam.needLogin');
        setTimeout(() => alertVisible.value = false, 2000);
        return;
    }
    // 缓存原始值，失败回滚
    const oldIsLike = !!item.isLike;
    const oldNum = Number(item.like_num || 0);
    likeLock = true;
    try {
        const { data: res } = await request.post('/api/dynamic/like', {
            dynamic_id: item.dynamic_id,
            user_id: currentUser.id
        });
        if (res.code === 1) {
            if (res.action === 'like') {
                item.isLike = true;
                item.like_num = oldNum + 1;
            } else {
                item.isLike = false;
                item.like_num = Math.max(oldNum - 1, 0);
            }
        } else {
            // 接口返回失败，恢复原样
            item.isLike = oldIsLike;
            item.like_num = oldNum;
        }
    } catch (err) {
        // 网络异常强制回滚
        item.isLike = oldIsLike;
        item.like_num = oldNum;
        console.log('点赞失败', err);
    } finally {
        likeLock = false;
    }
};

// 收藏/取消收藏（匹配后端接口）
const toggleCollect = async (item: any) => {
    if (!currentUser.id) {
        alertVisible.value = true;
        alertMsg.value = t('dynam.needLogin');
        setTimeout(() => alertVisible.value = false, 2000);
        return;
    }
    try {
        const { data: res } = await request.post('/api/dynamic/collect', {
            dynamic_id: item.dynamic_id,
            user_id: currentUser.id
        });
        if (res.code === 1) {
            if (res.action === 'collect') {
                item.isCollect = true;
                item.collect_num++;
            } else {
                item.isCollect = false;
                item.collect_num--;
            }
        }
    } catch (err) {
        console.log(err);
    }
};

// 加载评论
const loadComment = async () => {
    try {
        const { data: res } = await request.post('/api/dynamic/list', {
            dynamic_id: curDynamicId.value
        });
        if (res.code === 1) commentList.value = res.data.list;
    } catch (err) {
        commentList.value = [];
    }
};

onMounted(async () => {
    await nextTick();
    window.scrollTo(0, 0);
    loadDynamicList();
    // 页面打开立刻加载评论
    if (dynamicList.value.length > 0) {
        curDynamicId.value = dynamicList.value[0].dynamic_id
        loadComment()
    }
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
    flex: 1;
    width: 100%;
    --el-input-textarea-line-height: normal !important;
}

.auto-textarea :deep(.el-textarea__inner) {
    padding: 8px 12px !important;
    flex: 1;
    width: 100%;
    height: 200px !important;
    font-size: 15px;
    line-height: normal !important;
    resize: none;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-all;
    display: flex;
    align-items: center;
    background: #ffffff !important;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.buttdgra {
    background-color: rgb(92, 92, 92);
    padding: 6px 10px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    flex: 1;
    text-align: center;
}

.buttdgrb {
    background-color: #976200;
    padding: 6px 10px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    flex: 1;
    text-align: center;
}

.buttdgrc {
    background-color: rgb(105, 0, 131);
    padding: 3px 10px;
    font-size: 14px;
    flex: 1;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    text-align: center;
}

.contenttext {
    font-size: 15px;
    padding: 10px 0px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    word-break: break-word;
    color: #eee;
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

.userteataaq {
    margin: 15px 10px 0 20px;
    height: 35px;
    width: 35px;
    border-radius: 90px;
    overflow: hidden;
    position: relative;
    border: 1px solid #ffffff;
}

.userteatb-oneaa {
    font-weight: bold;
    font-size: 15px;
    color: #fff;
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

.userteatb-oneb {
    display: flex;
    text-align: center;
    margin-left: 2px;
    color: #ff33ee;
    margin-bottom: 5px;
}

.userteatb-oneba {
    margin-left: 10px;
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
    padding-right: 35px;
    /* background-color: #38383896; */

}

.bootriaa {
    color: #fdfdfd;
    font-size: 13px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 5px;
    gap: 10px;
    width: 100%;
    text-align: left;
}

.bootritt {
    background-color: #d600d6;
    text-align: right;
    margin-left: auto;
    font-size: 13px;
    padding: 3px 15px;
    border-radius: 50px;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 0 5px 2px rgba(255, 235, 251, 0.349);
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

.comment-item {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.c-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
}

.c-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.c-body {
    flex: 1;
    margin-left: 10px;
}

.c-name {
    color: #fff;
    font-weight: bold;
    font-size: 14px;
}

.c-text {
    color: #ccc;
    font-size: 13px;
    margin: 4px 0;
}

.c-time {
    color: #777;
    font-size: 11px;
}

.empty-comment {
    color: #888;
    text-align: center;
    padding: 30px 0;
}

.empty-tip,
.load-tip {
    text-align: center;
    padding: 40px 0;
    color: #999;
    font-size: 14px;
}

.page-comment-wrap {
    text-align: left;
}

.page-comment-item {
    display: flex;
    padding: 20px;
    flex-direction: row;
    border-bottom: 1px solid #000;
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
</style>