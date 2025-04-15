<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core';
import { reactive, ref, useTemplateRef, watchEffect } from 'vue';
import type { InfiniteScrollState } from '@/components/infinite-scroll/types.ts';

const props = withDefaults(
  defineProps<{
    rootMargin?: string;
  }>(),
  {
    rootMargin: '16px',
  }
);

const emit = defineEmits<{
  (e: 'load', state: InfiniteScrollState): void;
}>();

const selfRef = useTemplateRef('self');
const visible = useElementVisibility(selfRef, {
  rootMargin: props.rootMargin,
});

const state = ref<InfiniteScrollState['state']>('running');

const info: InfiniteScrollState = reactive({
  state,
  pause: () => (state.value = 'stopped'),
  resume: () => (state.value = 'running'),
  load: async () => await emit('load', info),
});

watchEffect(async () => {
  if (visible.value && state.value === 'running') {
    await emit('load', info);
  }
});

defineExpose(info);
</script>

<template>
  <div ref="self" class="cus-infinite-scroll"></div>
</template>

<style scoped lang="scss">
.cus-infinite-scroll {
  width: 100%;
  height: 0;
  background: transparent;
}
</style>