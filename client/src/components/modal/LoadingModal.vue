<script setup lang="ts">
import CommonModal from '@/components/modal/CommonModal.vue';
import CusSpin from '@/components/spinning/CusSpin.vue';
import type { CommonModalProps } from '@/components/modal/types.ts';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<
    CommonModalProps & {
      placeholder?: string;
      color?: string;
    }
  >(),
  {
    placeholder: '加载中...',
    color: '#000',
  }
);

defineOptions({
  inheritAttrs: true,
});
</script>

<template>
  <CommonModal
    v-bind="props"
    preset-body
    :mask-style="{ 'background-color': 'transparent' }"
    :modal-style="{ width: '10rem' }"
    :show-close="false"
  >
    <div class="loading-modal">
      <div class="loading-modal-spin">
        <CusSpin :color="color" size="2rem" thickness="3px" />
      </div>
      <div class="loading-modal-text" :style="{ 'color': color }">{{ placeholder }}</div>
    </div>
  </CommonModal>
</template>

<style scoped lang="scss">
.loading-modal {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  &-text {
    font-size: 1.25rem;
    font-weight: bold;
  }
}
</style>