<template>
    <div class="maina">
        <div class="all">
            <div class="search-box">
                <span class="search-label">搜索好友：</span>
                <el-input v-model="searchKey" placeholder="请输入昵称/备注搜索" clearable @input="refreshContacts" />
            </div>

            <div class="user-table-wrap no-scroll" max-height="650px" ref="scrollBox">
                <div class="user-item" style="background-color: aliceblue;">
                    <div class="user-info" style="flex: 1; display: flex;">
                        <div style="width: 5%;">头像</div>
                        <div style="flex: 1;">名称</div>
                        <div style="width: 20%;"></div>
                        <div
                            style="text-align: right;margin-left: auto;padding-right: 50px;display: flex; flex-direction: row;">
                            <div>时间</div>
                            <div style="margin-left: 50px;width: 80px;">未读</div>
                        </div>
                    </div>
                </div>

                <div v-for="item in filteredContacts" :key="item.id" class="user-item" @click="toChat(item.id)"
                    style="cursor: pointer;">
                    <div class="user-info" style="flex: 1; display: flex;align-items: center;">
                        <div style="width: 5%; display: flex; justify-content: start;">
                            <div class="avatar" style="width: 35px; height: 35px;">
                                <img :src="baseURL + item.avatar" alt="avatar" />
                            </div>
                        </div>
                        <div style="flex: 1;">
                            <div>{{ item.name }}</div>
                            <div style=" color: #666;">
                                {{
                                    item.lastMsg == "[T]"
                                        ? $t("image")
                                        : item.lastMsg == "[Z]"
                                            ? $t("transfer")
                                            : item.lastMsg == "[Y]"
                                                ? $t("card")
                                                : item.lastMsg == "[S]"
                                                    ? $t("video")
                                                    : item.lastMsg
                                }}
                            </div>
                        </div>
                        <div
                            style="text-align: right;margin-left: auto;padding-right: 50px;display: flex; flex-direction: row;">
                            <div>{{ formatRelativeTime(item.timestamp) }}</div>
                            <div style="margin-left: 50px; color: #888;width: 80px;">
                                <div v-if="item.unread_count > 0" style="
                  display: inline-block;
                  background: red;
                  color: #fff;
                  font-size: 12px;
                  padding: 2px 6px;
                  border-radius: 10px;
                ">
                                    {{ item.unread_count > 99 ? "99+" : item.unread_count }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="loading" style="padding: 10px; text-align: center">
                    加载中...
                </div>
                <div v-if="finished && filteredContacts.length > 0" style="padding: 10px; text-align: center">
                    已加载全部
                </div>
                <div v-if="filteredContacts.length === 0 && !loading"
                    style="padding: 20px; text-align: center; color:#999">
                    暂无联系人
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, onActivated, nextTick } from "vue";
import router from "../../router";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import request from "@/utils/request";
import { io } from "socket.io-client";

const baseURL = request.defaults.baseURL || "";
const { t } = useI18n();
const route = useRoute();

interface ContactItem {
    id: number;
    name: string;
    avatar: string;
    lastMsg: string;
    timestamp: number;
    unread_count: number;
}

const filteredContacts = ref<ContactItem[]>([]);
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
const pageSize = ref(10);
const searchKey = ref("");
const scrollBox = ref<any>(null);
let socket: any = null;

// 跳转聊天
const toChat = (userId: number) => {
    router.push(`/message/${userId}`);
};

// 格式化时间
const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return t("justNow");
    if (minutes < 60) return `${minutes}${t("minutesAgo")}`;
    if (hours < 24) return `${hours}${t("hoursAgo")}`;
    if (days < 7) return `${days}${t("daysAgo")}`;
    return t("longAgo");
};

// 获取当前用户
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("adminuser") || "{}");
};

// 加载数据
const loadMore = async () => {
    const currentUser = getCurrentUser();
    const group_user = currentUser.group_level || "";

    if (loading.value || finished.value) return;
    loading.value = true;

    try {
        const { data: res } = await request.post("/api/contact/listadmin", {
            keyword: searchKey.value,
            page: page.value,
            limit: pageSize.value,
            group_user,
        });

        if (res.code === 1) {
            const list = res.data || [];
            filteredContacts.value = page.value === 1 ? list : [...filteredContacts.value, ...list];
            finished.value = list.length < pageSize.value;
            if (!finished.value) page.value++;
        } else {
            finished.value = true;
        }
    } catch (err) {
        console.error("加载失败", err);
        finished.value = true;
    } finally {
        loading.value = false;
    }
};

// 刷新联系人列表（实时更新核心）
const refreshContacts = async () => {
    // 重置分页
    page.value = 1;
    finished.value = false;
    filteredContacts.value = [];
    await nextTick();
    loadMore();
};

// 滚动加载
const handleScroll = () => {
    const el = scrollBox.value;
    if (!el) return;
    if (loading.value || finished.value) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore();
    }
};

// 路由监听
watch(
    () => route.path,
    (newPath) => {
        if (newPath === "/contacts") {
            refreshContacts();
        }
    }
);
let timer:any = null;
onMounted(() => {
    refreshContacts();
    scrollBox.value?.addEventListener("scroll", handleScroll);
    // 3秒自动刷新，不用socket
    // timer = setInterval(refreshContacts, 3000);
});

// 页面激活刷新（keep-alive）
onActivated(() => {
    refreshContacts();
});

// 销毁清理
onUnmounted(() => {
    scrollBox.value?.removeEventListener("scroll", handleScroll);
    if (socket) {
        socket.disconnect();
    }
    window.removeEventListener("messageRead", refreshContacts);
});
</script>

<style scoped>
.maina {
    padding: 20px 50px 20px 20px;
}

.search-box {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;
}

.search-label {
    white-space: nowrap;
}

.search-box :deep(.el-input) {
    width: 260px;
}

.user-table-wrap {
    border: 1px solid #eee;
    border-radius: 6px;
    max-height: 650px;
    overflow-y: auto;
    display: block;
}

.no-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.no-scroll::-webkit-scrollbar {
    display: none;
}

.user-item {
    display: flex;
    padding: 8px 15px;
    border-bottom: 1px solid #d3d2d2;
    background-color: #eeeeee;
    text-align: left;
    align-items: center;
}

.user-item:hover {
    background-color: #dad8d8;
}

.user-item:last-child {
    border-bottom: none;
}

.avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>