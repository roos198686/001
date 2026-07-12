<template>
    <div class="maina">
        <div class="all">
            <div class="search-box">
                <span class="search-label">输入用户名：</span>
                <el-input v-model="searchName" placeholder="请输入用户名精确搜索" clearable @input="handleSearch" />
            </div>

            <div class="role-tabs">
                <div class="tab-item" :class="{ active: logType === 2 }" @click="changeType(2)">充值记录</div>
                <div class="tab-item" :class="{ active: logType === 1 }" @click="changeType(1)">提现记录</div>
            </div>

            <div class="role-tabs" style="margin-top: 5px">
                <div class="tab-itema" :class="{ active: status === 0 }" @click="changeStatus(0)">未完成</div>
                <div class="tab-itema" :class="{ active: status === 1 }" @click="changeStatus(1)">已完成</div>
            </div>

            <div ref="scrollWrap" class="user-table-wrap" @scroll="handleScroll">
                <!-- 表头 -->
                <div class="user-item" style="background-color: #a33299;color: #fff;border-radius: 6px 6px 0 0;">
                    <div class="user-info">
                        <span style="width:18%">订单号</span>
                        <span style="width:7%">用户ID</span>
                        <span style="width:12%">用户名</span>
                        <span style="width:12%">金额</span>
                        <span style="width:10%">币种</span>
                        <span style="width:22%">钱包地址</span>
                        <span style="width:16%">时间</span>
                        <span style="width:10%">组别</span>
                        <span style="width:10%">状态</span>
                    </div>
                    <div style="width:100px;color: #fff;font-size: 13px;">操作</div>
                </div>

                <!-- 列表 -->
                <div class="hide-scroll" style="max-height: 500px; overflow-y: auto;">
                    <div v-for="item in list" :key="item.id" class="user-item">
                        <div class="user-info">
                            <span style="width:18%">{{ item.order_no }}</span>
                            <span style="width:7%;">{{ item.user_id }}</span>
                            <span style="width:12%">{{ item.username }}</span>
                            <span style="width:12%">{{ item.amount }}</span>
                            <span style="width:10%">{{ item.coin_type }}</span>
                            <span style="width:22%">{{ item.wallet_address }}</span>
                            <span style="width:16%">{{ moment(item.create_time).format('YY/MM/DD HH:mm:ss') }}</span>
                            <span style="width:10%">{{ item.group_user }}</span>
                            <span style="width:10%">{{ item.status === 0 ? '待处理' : item.status === 1 ? '已完成' : '已冻结'
                                }}</span>
                        </div>
                        <div style="width:100px;">
                            <!-- ✅ 这里自动区分 充值/提现 调用不同接口 -->
                            <div v-if="userInfo.status != '4'">
                                <el-button type="primary" size="small" v-if="item.status === 0"
                                    @click="logType === 2 ? confirmRecharge(item.id) : confirmWithdraw(item.id)">
                                    确认完成
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <div v-if="list.length === 0 && !loading" class="empty-tip">暂无记录</div>
                    <div v-if="loading" class="load-txt">加载中...</div>
                    <div v-if="noMore" class="load-txt">没有更多了</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElInput, ElButton } from 'element-plus'
import request from '@/utils/request'
import router from '@/router'
import moment from 'moment';
const searchName = ref('')
const logType = ref(2) // 1=提现 2=充值
const status = ref(0)

const list = ref<any[]>([])
const scrollWrap = ref<HTMLDivElement | null>(null)

const page = ref(1)
const pageSize = 20
const loading = ref(false)
const noMore = ref(false)

const resetPage = () => {
    page.value = 1
    list.value = []
    noMore.value = false
}
const userInfo = reactive(JSON.parse(localStorage.getItem("adminuser") || "{}"));
const getList = async () => {

    const statusat = userInfo.status
    const remark = userInfo.group_level
    console.log(statusat, remark)
    if (loading.value || noMore.value) return
    loading.value = true
    try {
        const res = await request.get('/api/admin/log/listAll', {
            params: {
                type: logType.value,
                status: status.value,
                page: page.value,
                limit: pageSize,
                statusat: statusat,
                remark: remark
            }
        })
        const arr = res.data.data || []
        console.log(arr)
        list.value = [...list.value, ...arr]
        if (arr.length < pageSize) noMore.value = true
        page.value++
    } catch (err) {
        console.log(err)
    } finally {
        loading.value = false
    }
}

const handleScroll = () => {
    if (!scrollWrap.value) return
    const { scrollTop, scrollHeight, clientHeight } = scrollWrap.value
    if (scrollHeight - scrollTop - clientHeight < 80) getList()
}

const changeType = (val: number) => {
    logType.value = val
    resetPage()
    getList()
}

const changeStatus = (val: number) => {
    status.value = val
    resetPage()
    getList()
}

const handleSearch = () => {
    resetPage()
    if (!searchName.value) return getList()
    request.get('/api/admin/log/search', {
        params: {
            username: searchName.value,
            type: logType.value,
            status: status.value
        }
    }).then(res => {
        list.value = res.data.data || []
    })
}

// ==============================================
// ✅ 【充值确认】接口（logType=2）
const confirmRecharge = async (id: number) => {
    await request.post('/api/admin/log/confirmRecharge', { id })
    ElMessage.success('充值已确认完成')
    resetPage()
    getList()
}

// ✅ 【提现确认】接口（logType=1）
const confirmWithdraw = async (id: number) => {
    await request.post('/api/admin/log/confirmWithdraw', { id })
    ElMessage.success('提现已确认完成')
    resetPage()
    getList()
}
// ==============================================

onMounted(() => {

    const adminStr = localStorage.getItem('adminuser');

    if (!adminStr) {
        router.replace('/admin_login');
    }
    getList()
})
</script>

<style scoped>

.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none; 
}
.hide-scroll::-webkit-scrollbar {
  display: none; 
}
.user-info {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 13px;
}

.user-info span {
    overflow: hidden;
    white-space: nowrap;
    font-size: 13px;
}

.maina {
    padding: 20px;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.search-label {
    white-space: nowrap;
}

.search-box :deep(.el-input) {
    width: 260px;
}

.role-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.tab-item {
    padding: 3px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
}

.tab-item.active {
    background: #a3329e;
    color: #fff;
    border-color: #a3329e;
}
.tab-itema {
    margin: 0 16px;
    padding: 3px 0;
    cursor: pointer;
    font-size: 13px;
}

.tab-itema.active {
    font-weight: 800;
    color: #a3329e;
    border-color: #a3329e;
    border-bottom: 3px solid #a3329e; 
}
.user-table-wrap {
    border: 1px solid #eee;
    border-radius: 6px;
}

.user-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 15px;
    background: #f8f8f8;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.user-item:hover {
    background: #f6eaf8;
}
.user-info {
    display: flex;
    gap: 18px;
    font-size: 14px;
}

.empty-tip,
.load-txt {
    text-align: center;
    padding: 30px 0;
    color: #999;
}

.user-table-wrap::-webkit-scrollbar {
    display: none;
}
</style>