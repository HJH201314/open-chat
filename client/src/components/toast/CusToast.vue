<script setup lang="ts">
import { computed, h, ref, watchEffect } from 'vue';
import type { ToastProps } from './types';
import variables from '@/assets/variables.module.scss';
import { Alarm, Caution, Info, Remind, Success } from '@icon-park/vue-next';

const props = withDefaults(defineProps<ToastProps>(), {
  text: '',
  position: 'top-center',
  duration: 'normal',
  type: 'normal',
  showIcon: true,
});

const emits = defineEmits<{
  (evt: 'click'): void;
}>();

const myself = ref<HTMLElement>();
const durationTimeMs = computed(() => {
  switch (props.duration) {
    case 'long':
      return 2000;
    case 'normal':
      return 1250;
    case 'short':
      return 750;
    case 'forever':
      return -1;
    default:
      return props.duration;
  }
});

watchEffect(() => {
  if (durationTimeMs.value > 0) {
    setTimeout(() => {
      myself.value?.remove();
    }, durationTimeMs.value);
  } else if (durationTimeMs.value === 0) {
    myself.value?.remove();
  }
});

const teleportedTo = ref(props.teleportTo || 'body');

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

const iconElement = computed(() => {
  switch (props.type) {
    case 'success':
      return h(Success);
    case 'warning':
      return h(Caution);
    case 'danger':
      return h(Alarm);
    case 'info':
      return h(Info);
    default:
      return h(Remind);
  }
});
</script>

<template>
  <Teleport :to="teleportedTo">
    <div ref="myself" :class="toastClass" @click="$emit('click')">
      <div class="toast-wrapper">
        <component :is="iconElement" v-if="showIcon" class="toast-icon" />
        <div v-if="text" class="toast-text" v-text="props.text"></div>
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
  max-width: calc(100vw - 1.5rem);
  width: max-content;
  margin: 0.75rem;

  &-text {
    white-space: pre-line;
    word-break: break-word;
    overflow-wrap: anywhere;
    flex-grow: 1;
  }

  &-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.5rem;
    padding: 0.25rem 0.5rem;
    color: $color-white;
    background-color: v-bind(wrapperColor);
    box-shadow: $box-shadow;
    backdrop-filter: opacity(50%) blur(10px);
  }

  &-top-center {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    animation: top-center-in 0.25s $ease-out-circ;

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
    top: 0;
    left: 0;
    animation: top-left-in 0.25s $ease-out-circ;
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
    top: 0;
    right: 0;
    animation: top-right-in 0.25s $ease-out-circ;
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
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    animation: bottom-center-in 0.25s $ease-out-circ;
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
    bottom: 0;
    left: 0;
    animation: bottom-left-in 0.25s $ease-out-circ;
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
    bottom: 0;
    right: 0;
    animation: bottom-right-in 0.25s $ease-out-circ;
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