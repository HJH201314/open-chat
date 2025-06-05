<script lang="ts" setup>
import { siteLoadingKey } from '@/constants/eventBusKeys';
import { useEventBus, useTitle, useWindowFocus, useWindowSize } from '@vueuse/core';
import { computed, useTemplateRef, watchEffect } from 'vue';
import CusFullSiteProgress from '@/components/progress/CusFullSiteProgress.vue';
import { useUserStore } from '@/store/useUserStore.ts';
import { useTheme } from '@/components/theme/useTheme.ts';

useTheme();
useUserStore();

const siteProgressRef = useTemplateRef('site-progress');
const siteProgressBus = useEventBus(siteLoadingKey);
siteProgressBus.on((evt) => {
  if (evt == 'start') {
    siteProgressRef.value?.start();
  } else if (evt == 'finish') {
    siteProgressRef.value?.finish();
  }
});

const isWindowFocused = useWindowFocus();
useTitle(computed(() => 'F' + (isWindowFocused.value ? '-_-' : '>_<') + 'Chat - AI 对话'));

// 解决某些移动端浏览器下 vh 并非视口高度的问题
const { height: windowHeight } = useWindowSize();
watchEffect(() => {
  if (windowHeight.value > 0) {
    const vh = windowHeight.value / 100;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
});
</script>

<template>
  <div class="app-base">
    <CusFullSiteProgress ref="site-progress" />
    <RouterView class="app-base-router" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;

.app-base {
  height: 100%;
  position: relative;

  &-router {
    height: 100%;
    width: 100%;
  }
}
</style>
