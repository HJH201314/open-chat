<script setup lang="ts">
import Panel from "@/components/panel/Panel.vue";
import SideBar from "@/components/sidebar/SideBar.vue";
</script>

<template>
  <div class="app-base">
    <SideBar />
    <div class="app-base-panel">
      <Panel />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
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
  @media screen and (max-width: $screen-sm) {
    padding: 8px 8px 8px 0;
  }
}
</style>
