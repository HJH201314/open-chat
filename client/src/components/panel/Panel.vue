<script setup lang="ts">

</script>

<template>
  <div class="panel">
    <slot />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;
@use '@/assets/animations';

.panel {
  position: relative;
  background-color: white;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  box-shadow: $box-shadow-shallower-right-bottom;
  border-radius: 12px;
  margin: 0 auto;
}
</style>