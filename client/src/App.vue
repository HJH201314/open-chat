<script lang="ts" setup>
import Panel from '@/components/panel/Panel.vue';
import SideBar from '@/components/sidebar/SideBar.vue';
import { noPaddingKey, siteLoadingKey } from '@/constants/eventBusKeys';
import { useEventBus, useWindowSize } from '@vueuse/core';
import { ref, useTemplateRef, watchEffect } from 'vue';
import CusFullSiteProgress from '@/components/progress/CusFullSiteProgress.vue';
import { provideTheme } from '@/components/theme/useTheme.ts';

provideTheme();

const siteProgressRef = useTemplateRef('site-progress');
const siteProgressBus = useEventBus(siteLoadingKey);
siteProgressBus.on((evt) => {
  if (evt == 'start') {
    siteProgressRef.value?.start();
  } else if (evt == 'finish') {
    siteProgressRef.value?.finish();
  }
});
const showPadding = ref(true);
const noPaddingBus = useEventBus(noPaddingKey);
noPaddingBus.on((v) => {
  showPadding.value = !v;
});

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
    <SideBar />
    <div :class="{ 'no-padding': !showPadding }" class="app-base-panel">
      <Panel />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;

.app-base {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
}

.app-base-panel {
  flex: 1;
  box-sizing: border-box;
  padding: 12px 12px 12px 0;
  transition: padding 0.1s $ease-out-cubic;
  @media screen and (max-width: $screen-sm) {
    padding: 8px 8px 8px 0;
  }

  &.no-padding {
    padding: 0;
  }
}
</style>
