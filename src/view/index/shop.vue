<template>
  <div class="main">
    <div class="register-container">
      <div class="register-all">
        <!-- 顶部标题 -->
        <div class="allar-top">
          <div class="allar-top-a">{{ $t("dating") }}</div>
        </div>

        <div class="alla">
          <div class="allakldo">
            <div class="allakldoaq"><div>系統維護中......</div></div>
          </div>
        </div>

        <!-- 底部导航 -->
        <div class="buttnone">
          <div class="buttnone-all">
            <div
              v-for="menu in menuList"
              :key="menu.key"
              class="buttnone-alla"
              :style="{ color: isMenuActive(menu.key) ? '#fa33fa' : '#d6a6d6' }"
              @click="activeMenu(menu.path)"
            >
              <div style="position: relative">
                <Icon :icon="menu.icon" height="24" />
                <div v-if="menu.unread > 0" class="badge">
                  {{ menu.unread > 99 ? "99+" : menu.unread }}
                </div>
              </div>
              <div>{{ $t(menu.i18nKey) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import router from "../../router";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const route = useRoute();

const listContainer = ref<HTMLElement | null>(null);

let scrollTimer: any = null;

// 底部导航
const menuList = ref([
  {
    key: "a",
    path: "/index",
    pathPrefix: "/index",
    i18nKey: "home",
    icon: "streamline-flex:home-2-solid",
    unread: 0,
  },
  {
    key: "b",
    path: "/shop",
    pathPrefix: "/shop",
    i18nKey: "dating",
    icon: "tabler:video",
    unread: 0,
  },
  {
    key: "c",
    path: "/contacts",
    pathPrefix: "/contacts",
    i18nKey: "contacts",
    icon: "material-symbols:group-rounded",
    unread: 0,
  },
  {
    key: "e",
    path: "/user",
    pathPrefix: "/user",
    i18nKey: "user",
    icon: "ic:baseline-face-6",
    unread: 0,
  },
]);

// 底部菜单切换
const activeMenu = (path: string) => {
  router.push({ path, replace: true });
};

const isMenuActive = (menuKey: string) => {
  const m = menuList.value.find((x) => x.key === menuKey);
  return m ? route.path.startsWith(m.pathPrefix) : false;
};

// 页面挂载：读取缓存+恢复滚动位置
onMounted(async () => {
  await nextTick();
});

// 销毁清除定时器&事件
onUnmounted(() => {
  if (scrollTimer) clearTimeout(scrollTimer);
  const el = listContainer.value;
});
</script>

<style scoped>
.main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  overscroll-behavior: none;
}

.register-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.register-all {
  width: 100%;
  max-width: 500px;
  height: 100%;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  padding: 9px 0;
  background: #141414;
  justify-content: center;
  border-bottom: 1px solid #414141;
}

.allar-top-a {
  font-size: 15px;
  font-weight: bold;
  color: #a88035;
  text-align: center;
  flex: 1;
}

.alla {
  flex: 1;
  padding-top: 40px;
  margin-bottom: 60px;
  overflow: hidden;
  background: #42424271;
  position: relative;
  /* 新增背景图配置 */
  background-image: url(../../assets/images/bg.jpg); /* 替换成你的图片实际路径 */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed; /* 可选：滚动时背景固定 */
}
.reimengcesu-twoa-d {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  padding: 0 5px 80px 5px;
}

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
  padding: 0 3px;
  box-sizing: border-box;
}

.empty-tip {
  text-align: center;
  padding: 30px 0;
  font-size: 13px;
  color: #999;
}

.loading-tip {
  text-align: center;
  padding: 15px 0;
}

.refresh-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

::-webkit-scrollbar {
  display: none;
}

.waterfall-box {
  width: 100%;
  column-count: 2;
  column-gap: 0px; /* 加大间隙，避免挤压 */
  column-fill: balance; /* 均衡列高度，减少高度突变 */
}

.waterfall-item {
  break-inside: avoid;
  padding: 5px;
}

.waterfall-item-all {
  background: #383838;
  border-radius: 6px;
}

.fksjklgds {
  flex: 1;
  color: #ccc;
  font-size: 11px;
  padding: 7px 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #8d8d8d3d;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
.fksjklgds.active {
  background: linear-gradient(85deg, #fd74fd27 0%, #cd01e028 100%);
  color: #ff76ff;
  border-color: #ff76ff66;
}
.allakldo {
  height: 100%;
  background-color: #00000083;
  display: flex;
  align-items: center;
  justify-content: center;
}
.allakldoaq{
    background-color: #1414149a;
    width: 50%;
    height: 30%;
    border-radius: 10px;
    color: #fff;
    display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width: 768px) {
  .allar-top {
    height: 44px;
    box-sizing: border-box;
  }
  .alla {
    padding-top: 44px !important;
    margin-bottom: 70px !important;
  }
}
</style>
