<script setup lang="ts">
const props = defineProps<{
  title?: string;
  subtitle?: string;
}>();
</script>

<template>
  <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center; flex-wrap: wrap;">
    <div style="display: flex; gap: 0.5rem; align-items: flex-end; flex-wrap: wrap; line-height: 1; padding-inline: 0.25rem; margin-right: auto;">
      <div style="font-size: 1.25rem; font-weight: bold">{{ title }}</div>
      <div style="color: var(--text-secondary)">{{ subtitle }}</div>
    </div>
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>