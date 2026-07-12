<template>
    <div class="admin-layout">
        <!-- 顶部导航栏 -->
        <div class="top-nav">
            <div class="nav-list">
                <div class="nav-item" :class="{ active: currentPath === '/admin_shop' }" @click="goTo('/admin_shop')">
                    上传商品
                </div>
                <div class="nav-item" :class="{ active: currentPath === '/admin_goodsmanage' }" @click="goTo('/admin_goodsmanage')">
                    商品管理
                </div>
                <div class="nav-item" :class="{ active: currentPath === '/mall/logistics' }">
                    物流管理
                </div>
                <div class="nav-item" :class="{ active: currentPath === '/mall/order' }" >
                    订单管理
                </div>
            </div>
        </div>

        <!-- 页面内容区域 -->
        <div class="content-box">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import router from '../../router'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentPath = ref('')

watch(
    () => route.path,
    (newPath) => {
        currentPath.value = newPath
    },
    { immediate: true }
)

const goTo = (path: string) => {
    router.push(path)
}
</script>

<style scoped>
/* 整体布局：顶部导航 + 下方内容 */
.admin-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* 顶部导航 */
.top-nav {
    width: 100%;
    height: 35px;
    background: #f8f9fa;
    box-shadow: 0 1px 0 #e5e7eb;
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
}

.nav-list {
    display: flex;
    height: 100%;
    gap: 2px;
}

/* 导航项 */
.nav-item {
    height: 100%;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: 0.2s;
}

.nav-item:hover {
    background: #e9ecef;
}

/* 选中高亮 */
.nav-item.active {
    box-shadow: 0 3px 0 #ac01ce;
    /* border-bottom: 3px solid #fa9804; */
    padding: 0 10px;
    color: #ac01ce;
    font-weight: 500;
}

/* 内容区域 */
.content-box {
    flex: 1;
    padding: 10px 0;
    overflow: auto;
}
</style>