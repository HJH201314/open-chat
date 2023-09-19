<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    enableIconHoverColor: boolean;
  }>(),
  {
    enableIconHoverColor: true,
  }
);
</script>

<template>
  <div class="relative h-10 border-2 rounded-lg aspect-square p-2 hover:border-emerald-500 transition-all cursor-pointer" style="text-align: center;"
       :class="{'button-icon-hover': enableIconHoverColor}"
  >
    <slot class="absolute top-0 left-0 right-0 bottom-0 inline-block" />
  </div>
</template>

<style scoped lang="scss">
.button-icon-hover:hover {
  filter: invert(50%) sepia(92%) saturate(392%) hue-rotate(109deg) brightness(96%) contrast(96%);
}
</style>