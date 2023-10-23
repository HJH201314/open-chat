<script setup lang="ts">

</script>

<template>
  <div class="icon-button">
    <slot class="icon-button-slot" />
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables";
.icon-button {
  position: relative;
  height: 2.5rem;
  width: 2.5rem;
  padding: .5rem;
  border-radius: .5rem;
  cursor: pointer;
  text-align: center;
  transition: all .1s ease-in-out;
  color: $color-black;
  box-shadow: $box-shadow;

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
    background: $color-gray-200;
  }
}
</style>