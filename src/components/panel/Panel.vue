<script setup lang="ts">

</script>

<template>
  <div class="panel">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.panel {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  // border: 2px solid $color-gray;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  border-radius: .5rem;
  // padding: .5rem;
  max-width: 1240px;
  margin: 0 auto;
}
</style>