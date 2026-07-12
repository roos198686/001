<template>
    <div class="stat-wrap">
        <div>
            <!-- 筛选栏 -->
            <div class="filter-bar">
                <div class="title">员工收入统计</div>
                <input v-model="monthuser" type="month" class="month-input" />
                <div class="query-btn" @click="getStats">查询</div>
            </div>

            <!-- 列表区域 -->
            <div class="list-container">
                <div v-for="(item, idx) in list" :key="idx" class="list-item">
                    <div class="rank">{{ idx + 1 }}</div>
                    <div class="name">用户名:{{ item.nickname || '-' }}</div>
                    <div class="total">总计:{{ item.total_amount || 0 }}</div>
                    <div class="profit">抽成:{{ statisticslist[0]?.staff_rate * item.total_amount / 100 }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import request from '@/utils/request'

// 用户信息
const userInfo = reactive(JSON.parse(localStorage.getItem("adminuser") || "{}"))

// 筛选月份、列表数据
const monthuser = ref('')
const list = ref<any[]>([])

// 抽成比例数据
const statisticslist = ref<any[]>([])

// 获取员工收入统计
const getStats = async () => {
    try {
        const group_level = userInfo.group_level
        const { data } = await request.get('/api/admin/groupUserWithdrawStats', {
            params: {
                group_level,
                month: monthuser.value || ''
            }
        })
        if (data.code === 1) {
            list.value = data.data
        }
    } catch (e) {
        console.error('数据获取失败', e)
    }
}

// 获取抽成配置
const recommendlist = async () => {
    try {
        const group_user = userInfo.group_level
        const status = userInfo.status
        const { data } = await request.get('/api/admin/recommendlist', {
            params: { group_user, status }
        })
        if (data.code === 1) {
            statisticslist.value = data.data
        }
    } catch (e) {
        console.error('抽成配置获取失败', e)
    }
}

onMounted(() => {
    recommendlist()
    getStats()
})
</script>

<style scoped>
.stat-wrap {
    padding: 30px;
    width: 100%;
    box-sizing: border-box;
}

.filter-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.title {
    font-size: 18px;
    font-weight: bold;
    color: #a3329e;
    flex: 1;
    text-align: left;
}

.month-input {
    padding: 6px;
    background: #eee;
    color: #000;
    border: none;
    border-radius: 6px;
}

.query-btn {
    background-color: #a3329e;
    color: #fff;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
}

.list-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #eee;
    border-radius: 6px;
    padding: 15px 0;
}

.list-item {
    font-size: 13px;
    display: flex;
    gap: 10px;
    /* background: #fdf6fd; */
    padding: 5px 15px;
    border-bottom: 1px solid #ddd;
    border-radius: 4px;
    margin: 0 8px;
    text-align: left;
}

.rank {
    width: 50px;
}

.name,
.total,
.profit {
    flex: 1;
}
</style>