<template>
    <div class="maina">
        <div class="all">
            <div class="search-box">
                <span class="search-label">输入用户名：</span>
                <el-input v-model="searchName" placeholder="请输入用户名模糊搜索" clearable @input="getUserList" />
            </div>

            <div class="role-tabs">
                <div class="tab-item" :class="{ active: currentRole === 1 }" @click="switchRole(1)">
                    普通用户
                </div>
                <div class="tab-item" :class="{ active: currentRole === 2 }" @click="switchRole(2)">
                    入驻用户
                </div>
            </div>

            <div class="user-table-wrap no-scroll">
                <div class="user-item"
                    style="display: flex;border-radius: 6px 6px 0 0; align-items: center;background-color: #a33299;">
                    <div class="user-info" style="flex: 1; display: flex;">
                        <div style="width: 5%;">ID</div>
                        <div style="width: 10%;">用户名</div>
                        <div style="width: 10%;">昵称</div>
                        <div style="width: 10%;">角色</div>
                        <div style="width: 5%;">点赞数</div>
                        <div style="width: 5%;">查看数</div>
                        <div style="width: 5%;">VIP</div>
                        <div style="width: 10%;">余额</div>
                        <div style="width: 10%;">城市</div>
                        <div style="width: 10%;">用户组</div>
                    </div>
                    <div style="width: 20%; text-align: center;font-size: 13px;color: #fff;">编辑</div>
                </div>
                <div  class="hide-scroll" style="max-height: 550px; overflow-y: auto; display: block;" ref="scrollBox">
                    <div v-for="item in showList" :key="item.id" class="user-item"
                        style="display: flex; align-items: center;">
                        <div class="user-infoa" style="flex: 1; display: flex;">
                            <div style="width: 5%;">{{ item.id }}</div>
                            <div style="width: 10%;">{{ item.username }}</div>
                            <div style="width: 10%;">{{ item.nickname }}</div>
                            <div style="width: 10%;">{{ item.role_level == 1 ? '普通' : '入驻' }}</div>
                            <div style="width: 5%;">{{ item.like_count }}</div>
                            <div style="width: 5%;">{{ item.view_count }}</div>
                            <div style="width: 5%;">{{ item.vip_level }}</div>
                            <div style="width: 10%;">{{ item.balance }}</div>
                            <div style="width: 10%;">{{ item.city }}</div>
                            <div style="width: 10%;">{{ item.group_user }}</div>
                        </div>
                        <div style="width: 20%; text-align: center;">
                            <el-button style="background-color: #a33299;border: 1px solid #a33299;" type="primary" size="small" @click="openEdit(item)"
                                v-if="userInfo.status != '3'">编辑</el-button>
                            <el-button style="background-color: brown;border: 1px solid brown;" type="primary"
                                size="small" @click="buttap(item.id)" v-if="userInfo.status == '1'">删除</el-button>
                        </div>
                    </div>
                    <div v-if="loading" style="padding:10px;text-align:center">加载中...</div>
                    <div v-if="noMore" style="padding:10px;text-align:center">已加载全部</div>
                </div>
            </div>
        </div>

        <el-dialog v-model="editVisible" title="编辑用户信息" width="460px" destroy-on-close>
            <div class="edit-form">
                <div class="form-item">
                    <label>用户名</label>
                    <div class="text">{{ editForm.username }}</div>
                </div>

                <div class="form-item">
                    <label>角色等级</label>
                    <el-select v-model="roleText" placeholder="请选择角色">
                        <el-option label="普通用户" value="普通用户" />
                        <el-option label="入驻用户" value="入驻用户" />
                    </el-select>
                </div>

                <div class="form-item" v-if="userInfo.status != 3">
                    <label>用户组</label>
                    <el-select v-model="grouplevel" placeholder="请选择组别">
                        <el-option v-for="item in zubeikd" :key="item.id" :label="item.group_level"
                            :value="item.group_level" />
                    </el-select>
                </div>

                <div class="form-item">
                    <label>点赞数</label>
                    <el-input v-model.number="editForm.like_count" :disabled="roleText === '普通用户'" />
                </div>
                <div class="form-item">
                    <label>查看数</label>
                    <el-input v-model.number="editForm.view_count" :disabled="roleText === '普通用户'" />
                </div>
            </div>

            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="saveEdit">保存修改</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';
import router from '@/router';

const searchName = ref('');
const currentRole = ref(1);
const allUserList = ref<any[]>([]);
const userList = ref<any[]>([]);
const showList = ref<any[]>([]);

const scrollBox = ref<HTMLDivElement>();
const page = ref(1);
const pageSize = 20;
const loading = ref(false);
const noMore = ref(false);

const editVisible = ref(false);
const userInfo = reactive(JSON.parse(localStorage.getItem("adminuser") || "{}"));

const zubeikd = ref<any[]>([]);
const grouplevel = ref('');

const xujfkdwobei = async () => {
    const { data } = await request.get('/api/admin_user/zubeikd');
    zubeikd.value = data.data || [];
};

const editForm = ref({
    id: 0,
    username: '',
    role_level: 1,
    like_count: 0,
    view_count: 0,
    vip_level: '',
    balance: 0,
    city: '',
    group_user: '',
});

const roleText = ref('')

const roleMap = {
    1: '普通用户',
    2: '入驻用户'
}
const roleToNum = {
    '普通用户': 1,
    '入驻用户': 2
}

const resetPage = () => {
    page.value = 1;
    showList.value = [];
    noMore.value = false;
};

// 过滤角色 只过滤一次
const filterUserList = () => {
    // 全部原始数据
    let temp = allUserList.value.filter(item => item.role_level === currentRole.value);
    userList.value = temp;

    resetPage();
    // 先加载第一页
    loadFirstPage();
};

// 初始加载第一页
const loadFirstPage = () => {
    const start = 0;
    const end = pageSize;
    showList.value = userList.value.slice(start, end);
    noMore.value = showList.value.length >= userList.value.length;
};

// 滚动加载下一页
const loadMore = () => {
    if (noMore.value) return;

    const el = scrollBox.value;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
        page.value++;
        const start = (page.value - 1) * pageSize;
        const end = page.value * pageSize;

        // 关键：往后截，不是从头截
        const nextArr = userList.value.slice(start, end);
        showList.value = [...showList.value, ...nextArr];

        if (end >= userList.value.length) {
            noMore.value = true;
        }
    }
};

const switchRole = (val: number) => {
    currentRole.value = val;
    filterUserList();
};

// const filterUserList = () => {
//     userList.value = allUserList.value.filter(item => item.role_level === currentRole.value);
//     resetPage();
//     cutPage();
// };

const getAllUser = async () => {
    const group_user = userInfo.group_level;
    const status = userInfo.status;

    const { data } = await request.get('/api/admin_user/listAll', {
        params: {
            group_user: group_user,
            status: status
        }
    });

    allUserList.value = data.data;
    filterUserList();
};

const getUserList = async () => {
    resetPage();
    if (!searchName.value) {
        getAllUser();
        return;
    }
    const { data } = await request.get('/api/admin_user/search', {
        params: { username: searchName.value }
    });
    allUserList.value = data.data;
    filterUserList();
};

const openEdit = async (row) => {
    editVisible.value = true
    editForm.value = { ...row }
    roleText.value = roleMap[row.role_level]
    await xujfkdwobei();
    grouplevel.value = row.group_user;
}

const saveEdit = async () => {
    try {
        if (userInfo.status == 3) {
            grouplevel.value = editForm.value.group_user;
        }
        const role_level = roleToNum[roleText.value];
        const params = {
            id: editForm.value.id,
            role_level: role_level,
            like_count: editForm.value.like_count,
            view_count: editForm.value.view_count,
            group_user: grouplevel.value,
        };

        const { data } = await request.get('/api/admin_user/update', { params });

        if (data.code === 1) {
            ElMessage.success('保存成功');
            editVisible.value = false;
            getUserList();
        } else {
            ElMessage.error('保存失败');
        }
    } catch (err) {
        ElMessage.error('保存失败');
        console.error(err);
    }
};
const buttap = async (id: any) => {
    try {
        const params = {
            id: id,
        };
        const { data } = await request.get('/api/admin_user/buttaptt', { params });
        if (data.code === 1) {
            ElMessage.success('删除成功');
            editVisible.value = false;
            getUserList();
        } else {
            ElMessage.error('保存失败');
        }
    } catch (err) {
        ElMessage.error('保存失败');
        console.error(err);
    }
};

onMounted(() => {
    const adminStr = localStorage.getItem('adminuser');
    if (!adminStr) {
        router.replace('/admin_login');
    }
    getUserList();

    // 只加这一句：绑定滚动
    scrollBox.value?.addEventListener('scroll', loadMore);
});

onUnmounted(() => {
    scrollBox.value?.removeEventListener('scroll', loadMore);
});
</script>

<style scoped>
.maina {
    padding: 20px;
}

.search-box {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;
}

.search-label {
    white-space: nowrap;
    font-size: 13px;
}

.search-box :deep(.el-input) {
    width: 260px;
    height: 25px;
}

.role-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.tab-item {
    padding: 2px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
}

.tab-item.active {
    background: #a33299;
    color: #fff;
    border-color: #a33299;
}

.user-table-wrap {
    border: 1px solid #eee;
    border-radius: 6px;
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
    padding: 3px 15px;
    border-bottom: 1px solid #d3d2d2;
    background-color: #fafafa;
    text-align: left;
}

.user-item:hover {
    background-color: #dad8d8;
}

.user-item:last-child {
    border-bottom: none;
}
.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none; 
}
.hide-scroll::-webkit-scrollbar {
  display: none; 
}
.user-info {
    display: flex;
    gap: 20px;
    font-size: 13px;
    color: #fff;
}

.user-infoa {
    display: flex;
    gap: 20px;
    font-size: 13px;
    color: #000;
}

.empty-tip {
    text-align: center;
    padding: 40px 0;
    color: #999;
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 10px 0;
}

.form-item {
    display: flex;
    align-items: center;
}

.form-item label {
    width: 100px;
    text-align: right;
    margin-right: 12px;
    font-weight: 500;
    color: #333;
}

.form-item .text {
    padding: 0 10px;
    line-height: 32px;
}

.form-item :deep(.el-input),
.form-item :deep(.el-select) {
    flex: 1;
}
</style>