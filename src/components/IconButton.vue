<script setup lang="ts">

</script>

<template>
  <div class="icon-button">
    <div class="icon-button-slot">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.icon-button {
  position: relative;
  height: 2rem;
  width: 2rem;
  padding: .25rem;
  border-radius: .5rem;
  cursor: pointer;
  text-align: center;
  transition: all .1s ease-in-out;
  color: $color-black;
  background: $color-grey-50;

  &-slot {
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &:hover {
    background: $color-grey-200;
  }
}
</style>