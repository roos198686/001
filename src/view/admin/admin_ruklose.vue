<template>
    <div class="maina">
        <div class="all">
            <!-- 搜索栏 -->
            <div class="search-box">
                <span class="search-label">输入用户名：</span>
                <el-input v-model="searchUsername" placeholder="请输入用户名模糊搜索" clearable @input="handleSearch" />
            </div>

            <!-- 列表 滚动容器 -->
            <div ref="scrollWrap" class="list-wrap" style="margin-top: 15px; max-height: 700px; overflow-y: auto;"
                @scroll="handleScroll">
                <div v-if="loading" class="tip">加载中...</div>
                <div v-if="!loading && list.length === 0" class="tip">暂无数据</div>

                <div v-for="item in list" :key="item.dynamic_id" class="item">
                    <div
                        style="display: flex;flex-direction: row;text-align: left;align-items: center;font-size: 14px;">
                        <div class="user-info" style="width: 250px;">
                            <img :src="baseURL + item.avatar" class="avatar" />
                            <span style="display: block; margin: 5px 0">{{ item.nickname }}（{{ item.username }}）</span>
                        </div>
                        <div class="content" style="width: 200px;padding-right: 20px;">{{ item.content }}</div>
                    </div>

                    <div class="imgs" style="width: 300px;">
                        <img :src="baseURL + item.image_url.split(',')[0]" class="img" />
                    </div>
                    <div style="white-space: nowrap;padding: 0 10px;">{{ moment(item.created_at).format('YY/MM/DD HH:mm:ss') }}</div>
                    <div style="white-space: nowrap;padding: 0 20px;">组别：{{ item.group_user }}</div>

                    <!-- 修改日期按钮 -->
                    <div v-if="userInfo.status != '4'" style="text-align: right;margin-left: auto;background-color: #5f9de4;color: #fff;font-size: 13px;padding: 5px 10px;border-radius: 6px;cursor: pointer;"
                        @click="openEditDate(item.dynamic_id, item.created_at)">修改日期</div>
                        <div v-if="userInfo.status != '4'" style="text-align: right;margin-left: auto;background-color: #fc6603;color: #fff;font-size: 13px;padding: 5px 10px;border-radius: 6px;cursor: pointer;"
                        @click="openEditDate(item.dynamic_id, item.created_at)">删除</div>
                </div>

                <div v-if="noMore" class="tip">没有更多了</div>
            </div>
        </div>

        <!-- 修改日期弹窗 -->
        <el-dialog v-model="showDateDialog" title="修改发布日期" width="500px">
            <el-date-picker v-model="editTime" type="datetime" placeholder="选择日期时间" style="width: 100%"
                :editable="false" />
            <template #footer>
                <el-button @click="showDateDialog = false">取消</el-button>
                <el-button type="primary" @click="saveEditTime">确认保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { ElInput, ElDialog, ElDatePicker, ElMessage } from 'element-plus'
import request from '@/utils/request'
import moment from 'moment';
import router from '@/router';
const baseURL = request.defaults.baseURL || '';
const searchUsername = ref('')
const list = ref<any[]>([])
const loading = ref(false)

// 滚动加载分页
const scrollWrap = ref<HTMLDivElement | null>(null)
const page = ref(1)
const pageSize = 10
const noMore = ref(false)

// 修改日期功能
const showDateDialog = ref(false)
const currentDynamicId = ref(null)
const editTime = ref('')

const openEditDate = (dynamic_id, old_time) => {
    currentDynamicId.value = dynamic_id
    // ✅ 用 moment 统一格式化时间
    editTime.value = moment(old_time).format('YYYY-MM-DD HH:mm:ss')
    showDateDialog.value = true
}

const saveEditTime = async () => {
    if (!currentDynamicId.value || !editTime.value) {
        ElMessage.warning('请选择时间')
        return
    }
    if (!moment(editTime.value).isValid()) {
        ElMessage.error('时间格式不正确')
        return
    }
    try {
        // ✅ 提交时也用 moment 统一格式化
        const submitTime = moment(editTime.value).format('YYYY-MM-DD HH:mm:ss')

        await request.post('/api/admin/updateImageTime', {
            dynamic_id: currentDynamicId.value,
            created_at: submitTime
        })

        ElMessage.success('修改成功')
        showDateDialog.value = false
        resetPage()
        getList()
    } catch (err) {
        ElMessage.error('修改失败')
    }
}

// 重置
const resetPage = () => {
    page.value = 1
    list.value = []
    noMore.value = false
}
const userInfo = reactive(JSON.parse(localStorage.getItem("adminuser") || "{}"));
// 获取列表
const getList = async () => {
    if (loading.value || noMore.value) return
    loading.value = true
    

    const remark = userInfo.group_level
    try {
        const res = await request.post('/api/admin/userimages', {
            username: searchUsername.value,
            page: page.value,
            limit: pageSize,
            remark: remark
        })

        const data = res.data.data || []
        if (data.length < pageSize) {
            noMore.value = true
        }

        list.value = [...list.value, ...data]
        page.value++
    } finally {
        loading.value = false
    }
}

// 滚动触底加载
const handleScroll = () => {
    if (!scrollWrap.value) return
    const { scrollTop, scrollHeight, clientHeight } = scrollWrap.value
    if (scrollHeight - scrollTop - clientHeight < 80) {
        getList()
    }
}

// 搜索
const handleSearch = async () => {
    resetPage()
    if (!searchUsername.value) return
    await getList()
}
onMounted(() => {

    const adminStr = localStorage.getItem('adminuser');

    if (!adminStr) {
        router.replace('/admin_login');
    }
});
</script>

<style scoped>
.list-wrap {
    background-color: rgb(235, 235, 235);
    border-radius: 6px;
}

.maina {
    padding: 20px;
}

.search-box {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;
}

.search-box :deep(.el-input) {
    width: 260px;
}

.search-label {
    white-space: nowrap;
}

.tip {
    text-align: center;
    padding: 20px;
    color: #999;
}

.item {
    padding: 5px 15px;
    border-bottom: 1px solid #d8d6d6;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.content {
    margin-bottom: 10px;
}

.imgs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
}

/* 隐藏滚动条（美观） */
.list-wrap::-webkit-scrollbar {
    display: none;
}
</style>