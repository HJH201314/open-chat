<script lang="ts" setup>
import Panel from '@/components/panel/Panel.vue';
import SideBar from '@/components/sidebar/SideBar.vue';
import { noPaddingKey } from '@/constants/eventBusKeys';
import { useEventBus } from '@vueuse/core';
import { ref } from 'vue';

const showPadding = ref(true);
const noPaddingBus = useEventBus(noPaddingKey);
noPaddingBus.on((v) => {
  showPadding.value = !v;
});
</script>

<template>
  <div class="app-base">
    <SideBar />
    <div :class="{ 'no-padding': !showPadding }" class="app-base-panel">
      <Panel />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.module';

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
  transition: padding 0.1s ease-in-out;
  @media screen and (max-width: $screen-sm) {
    padding: 8px 8px 8px 0;
  }

  &.no-padding {
    padding: 0;
  }
}
</style>
