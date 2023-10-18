<script setup lang="ts">
import Panel from "@/components/panel/Panel.vue";
import SideBar from "@/components/sidebar/SideBar.vue";
</script>

<template>
  <div class="base">
    <SideBar />
    <div class="panel">
      <Panel class="panel" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.base {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
}
.panel {
  flex: 1;
  box-sizing: border-box;
  padding: 12px;
}
</style>
