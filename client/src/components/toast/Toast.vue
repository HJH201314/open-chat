<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { ToastProps } from './types';
import variables from '@/assets/variables.module.scss';

const props = withDefaults(defineProps<ToastProps>(), {
  text: '',
  position: 'top-center',
  duration: 'normal',
  type: 'normal',
});

const emits = defineEmits<{
  (evt: 'click'): void;
}>()

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
    myself.value?.remove();
  }, durationTimeMs.value);
})

const toastClass = computed(() => {
  let className: string = props.position;
  if (className === 'top') className = 'top-center';
  if (className === 'bottom') className = 'bottom-center';
  return ['toast', `toast-${className}`];
});

const wrapperColor = computed(() => {
  switch (props.type) {
    case 'success':
      return variables.colorSuccess;
    case 'warning':
      return variables.colorWarning;
    case 'danger':
      return variables.colorDanger;
    case 'info':
      return variables.colorInfo;
    default:
      return variables.colorPrimary;
  }
});
</script>

<template>
  <Teleport to="body">
    <div ref="myself" :class="toastClass" @click="$emit('click')">
      <div class="toast-wrapper">
        <span v-if="text" class="toast-text">{{ props.text }}</span>
        <slot v-if="$slots.default"></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;
.toast {
  position: absolute;
  z-index: 10000;

  &-wrapper {
    border-radius: .5rem;
    padding: .25rem .5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
    color: $color-white;
    background-color: v-bind(wrapperColor);
    box-shadow: 0 0 4px v-bind(wrapperColor);
    opacity: 0.9;
  }

  &-top-center {
    margin-top: .75rem;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    -webkit-animation: top-center-in .25s $ease-out-circ;
    -o-animation: top-center-in .25s $ease-out-circ;
    animation: top-center-in .25s $ease-out-circ;

    @keyframes top-center-in {
      0% {
        transform: translate(-50%, -100%);
      }
      100% {
        transform: translate(-50%, 0);
      }
    }
  }
  &-top-left {
    margin-top: .75rem;
    margin-left: .75rem;
    top: 0;
    left: 0;
    -webkit-animation: top-left-in .25s $ease-out-circ;;
    -o-animation: top-left-in .25s $ease-out-circ;;
    animation: top-left-in .25s $ease-out-circ;;
    @keyframes top-left-in {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(0);
      }
    }
  }
  &-top-right {
    margin-top: .75rem;
    margin-right: .75rem;
    top: 0;
    right: 0;
    -webkit-animation: top-right-in .25s $ease-out-circ;
    -o-animation: top-right-in .25s $ease-out-circ;
    animation: top-right-in .25s $ease-out-circ;
    @keyframes top-right-in {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(0);
      }
    }
  }
  &-bottom-center {
    margin-bottom: .75rem;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    -webkit-animation: bottom-center-in .25s $ease-out-circ;
    -o-animation: bottom-center-in .25s $ease-out-circ;
    animation: bottom-center-in .25s $ease-out-circ;
    @keyframes bottom-center-in {
      0% {
        transform: translate(-50%, 100%);
      }
      100% {
        transform: translate(-50%, 0);
      }
    }
  }
  &-bottom-left {
    margin-bottom: .75rem;
    margin-left: .75rem;
    bottom: 0;
    left: 0;
    -webkit-animation: bottom-left-in .25s $ease-out-circ;
    -o-animation: bottom-left-in .25s $ease-out-circ;
    animation: bottom-left-in .25s $ease-out-circ;
    @keyframes bottom-left-in {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(0);
      }
    }
  }
  &-bottom-right {
    margin-bottom: .75rem;
    margin-right: .75rem;
    bottom: 0;
    right: 0;
    -webkit-animation: bottom-right-in .25s $ease-out-circ;
    -o-animation: bottom-right-in .25s $ease-out-circ;
    animation: bottom-right-in .25s $ease-out-circ;
    @keyframes bottom-right-in {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(0);
      }
    }
  }
}
</style>