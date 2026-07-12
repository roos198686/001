<template>
    <div class="main">
        <div class="register-container">
            <div class="register-all" style="position: relative;">
                <!-- 保留：顶部导航 -->
                <div class="allcoueksi">
                    <div class="allcoueksi-a">Hi</div>
                    <div class="allcoueksi-b">
                        <div>
                            <div>Today Income</div>
                            <div>$</div>
                        </div>
                        <div>
                            <div>Account balance</div>
                            <div>$</div>
                        </div>
                        <div>
                            
                        </div>
                    </div>
                </div>
                <!-- 底部导航 + 未读消息红点 -->
                <div class="allaq">
                    <div class="allar">
                        <div class="buttnone">
                            <div class="buttnone-all">
                                <div v-for="menu in menuList" :key="menu.key" class="buttnone-alla"
                                    :style="{ color: isMenuActive(menu.key) ? '#fa33fa' : '#d6a6d6' }"
                                    @click="activeMenu(menu.path)">
                                    <div style="position: relative;">
                                        <Icon :icon="menu.icon" height="24" />
                                        <!-- 未读红点 -->
                                        <div v-if="menu.unread && menu.unread > 0" class="badge">
                                            {{ menu.unread > 99 ? '99+' : menu.unread }}
                                        </div>
                                    </div>
                                    <div>{{ $t(menu.mobileName.toLowerCase()) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import router from '../../router';
import { useRoute } from 'vue-router';
import axios from 'axios'
const route = useRoute();


//跳转到dating 
const dating = () => {
    router.push('/dating')
}
const authn = () => {
    router.push('/authn')
}

// ==================== 底部菜单（完全不动） ====================

const menuList = ref([
    { key: 'a', path: '/index', pathPrefix: '/index', mobileName: 'Home', icon: 'streamline-flex:home-2-solid', unread: 0 },
    { key: 'b', path: '/dating', pathPrefix: '/dating', mobileName: 'Dating', icon: 'material-symbols:alarm-rounded', unread: 0 },
    { key: 'c', path: '/contacts', pathPrefix: '/contacts', mobileName: 'Contacts', icon: 'material-symbols:ecg-heart', unread: 12 }, // 未读12条
    { key: 'd', path: '/authn', pathPrefix: '/authn', mobileName: 'Authn', icon: 'material-symbols:ecg-heart', unread: 0 },
    { key: 'e', path: '/user', pathPrefix: '/user', mobileName: 'User', icon: 'ic:baseline-face-6', unread: 0 }, // 未读3条
]);

const isMenuActive = (menuKey: string) => {
    const menu = menuList.value.find(item => item.key === menuKey);
    return menu ? route.path.startsWith(menu.pathPrefix) : false;
};

const activeMenu = (path: string) => {
    router.push({ path, replace: true });
    localStorage.setItem('last_path', path);
};

watch(() => route.path, () => {
    localStorage.setItem('last_path', route.path);
}, { immediate: true });

onMounted(() => {
    const lastPath = localStorage.getItem('last_path');
    if (lastPath && route.path === '/') {
        router.replace(lastPath);
    }
});


</script>

<style scoped>
@import '../../assets/css/index.css';

.allaq {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #1f1336;
    padding: 6px 0;
}

.buttnone-all {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.buttnone-alla {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 11px;
    gap: 4px;
}

.allcoueksi {
    width: 100%;
    height: 100%;
    background-color: #141414;
}

/* 未读红点 */
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
    padding: 0 3px;
    box-sizing: bord
}
</style>