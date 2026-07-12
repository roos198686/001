<template>
  <div class="main">
    <div class="register-container">
      <div class="register-all">
        <!-- 顶部标题 -->
        <div class="allar-top">
             <div @click="goBack" style="margin-left: 10px;">
                        <Icon icon="material-symbols:arrow-back-ios-rounded" width="18" />
                    </div>
          <div class="allar-top-a">{{ $t('user') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../router';
import { Icon } from '@iconify/vue';
const route = useRoute();
const goBack = () => router.go(-1);
// 路由持久化（保留）
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

/* 只保留页面必须的样式，其余全部删除 */
.allar-top {
  text-align: center;
  width: 100%;
}
</style>