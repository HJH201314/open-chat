<script setup lang="ts">

</script>

<template>
  <div class="icon-button">
    <slot class="icon-button-slot" />
  </div>
</template>

<style scoped lang="scss">
.icon-button {
  position: relative;
  height: 2.5rem;
  width: 2.5rem;
  padding: .5rem;
  border: 2px solid #e5e7eb;
  border-radius: .5rem;
  cursor: pointer;
  text-align: center;
  transition: all .1s ease-in-out;

  &-slot {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    inline-size: 100%;
    block-size: 100%;
  }
  &:hover {
    border-color: #10b981;
    // 通过filter改变图标颜色
    filter: invert(50%) sepia(92%) saturate(392%) hue-rotate(109deg) brightness(96%) contrast(96%);
  }
}
</style>