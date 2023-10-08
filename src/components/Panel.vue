<script setup lang="ts">

</script>

<template>
  <div class="panel">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main.scss";
.panel {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  border: 2px solid $color-gray;
  border-radius: .5rem;
  padding: .5rem;
}
</style>