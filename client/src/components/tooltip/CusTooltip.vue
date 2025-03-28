<script setup lang="ts">
/* Tooltip 悬浮提示组件 */
import { type VNode } from 'vue';
import CusPopover from '@/components/tooltip/CusPopover.vue';

type TooltipProps = {
  text?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  enabled?: boolean;
};
const props = withDefaults(defineProps<TooltipProps>(), {
  text: '',
  position: 'right',
  enabled: true,
});

defineSlots<{
  default: () => VNode;
  tip: () => VNode;
}>();
</script>

<template>
  <CusPopover :position="position" :enabled="enabled">
    <slot />
    <template #popover>
      <div :class="{ 'tooltip-info': text, 'tooltip-slot': !text }" role="tooltip">
        <span v-if="text" class="tooltip-info-text">{{ props.text }}</span>
        <slot v-else name="tip" />
      </div>
    </template>
  </CusPopover>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.tooltip {
  &-info {
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #303030;
    z-index: 999;
    opacity: 0.9;
    box-sizing: border-box;
    display: flex;

    &-text {
      font-size: 1rem;
      line-height: 1;
      white-space: nowrap;
      color: $color-white;
    }
  }

  &-slot {
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: $box-shadow;
    z-index: 999;
    opacity: 0.9;
    box-sizing: border-box;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s $ease-out-circ;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
