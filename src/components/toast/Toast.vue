<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { ToastProps } from './index';

const props = withDefaults(defineProps<ToastProps>(), {
  text: '',
  position: 'top-center',
  duration: 'normal',
});

const myself = ref<HTMLElement>();
const durationTimeMs = computed(() => {
  switch (props.duration) {
    case 'long':
      return 1500;
    case 'normal':
      return 1000;
    case 'short':
      return 500;
    default:
      return props.duration;
  }
})

onMounted(() => {
  setTimeout(() => {
    console.log(myself.value?.remove());
  }, durationTimeMs.value);
})

const toastClass = computed(() => {
  let className: string = props.position;
  if (className === 'top') className = 'top-center';
  if (className === 'bottom') className = 'bottom-center';
  return ['toast', `toast-${className}`];
});
</script>

<template>
  <Teleport to="body">
    <div :class="toastClass" ref="myself">
      <div class="toast-wrapper">
        <span v-if="text" class="toast-text">{{ props.text }}</span>
        <slot v-if="$slots.default"></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@import "@/assets/variables";
.toast {
  position: absolute;

  &-wrapper {
    border-radius: .5rem;
    box-shadow: $box-shadow;
    padding: .25rem .5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
    color: $color-white;
    background-color: $color-primary;
    opacity: 0.9;
  }

  &-top-center {
    margin-top: .75rem;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  &-top-left {
    margin-top: .75rem;
    margin-left: .75rem;
    top: 0;
    left: 0;
  }
  &-top-right {
    margin-top: .75rem;
    margin-right: .75rem;
    top: 0;
    right: 0;
  }
  &-bottom-center {
    margin-bottom: .75rem;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  &-bottom-left {
    margin-bottom: .75rem;
    margin-left: .75rem;
    bottom: 0;
    left: 0;
  }
  &-bottom-right {
    margin-bottom: .75rem;
    margin-right: .75rem;
    bottom: 0;
    right: 0;
  }
}
</style>