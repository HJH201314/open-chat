<script setup lang="ts">

import { computed, inject, useTemplateRef, type VNode } from 'vue';
import { AdminLayoutContentSizeKey } from '@/pages/admin/types.ts';

const tableWrapperRef = useTemplateRef('table-wrapper');

const contentSize = inject(AdminLayoutContentSizeKey);
const tableWidth = computed(() => contentSize?.width?.value || 1200);
const maxHeight = computed(() => {
  return tableWrapperRef.value?.offsetHeight ? `${tableWrapperRef.value.offsetHeight - 56}px` : '100%';
});

defineSlots<{
  default: (params: { maxHeight: string }) => VNode;
}>()
</script>

<template>
  <div ref="table-wrapper" :style="{ 'overflow-x': 'auto', width: `${tableWidth}px`, flex: 'auto', 'min-height': 0, position: 'relative' }">
    <slot :max-height="maxHeight" />
  </div>
</template>

<style scoped lang="scss">

</style>