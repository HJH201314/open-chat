<script setup lang="ts">
type TooltipProps = {
  text?: string;
};
const props = withDefaults(defineProps<TooltipProps>(), {
  text: '',
});
</script>

<template>
  <Transition appear>
    <div v-if="text" :class="{ 'tooltip-info': text, 'tooltip-slot': !text }" role="tooltip">
      <span v-if="text" class="tooltip-info-text">{{ text }}</span>
      <slot v-else name="tip" />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.tooltip {
  &-info {
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: var(--color-black);
    z-index: 999;
    opacity: 0.9;
    box-sizing: border-box;
    display: flex;

    &-text {
      font-size: 1rem;
      line-height: 1;
      white-space: nowrap;
      color: var(--color-white);
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
