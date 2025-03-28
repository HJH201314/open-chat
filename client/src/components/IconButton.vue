<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '@/components/theme/useTheme.ts';

const props = withDefaults(
  defineProps<{
    type?: 'normal' | 'secondary';
    color?: 'danger' | 'warning' | 'success' | 'info' | 'primary' | string;
  }>(),
  {
    type: 'normal',
    color: '',
  }
);

const { theme } = useTheme();

const color = computed(() => {
  switch (props.color) {
    case 'danger':
    case 'warning':
    case 'success':
    case 'info':
      return theme[`--color-${props.color}`];
    default:
      return props.color || theme.colorPrimary;
  }
});

// 注意 color-mix 兼容性
const secondaryColorBackground = computed(() => `color-mix(in srgb, ${color.value}, transparent 85%)`);
const secondaryColorBackgroundHover = computed(() => `color-mix(in srgb, ${color.value}, transparent 80%)`);
const secondaryColorBackgroundActive = computed(() => `color-mix(in srgb, ${color.value}, transparent 75%)`);
const secondaryColorForeground = computed(() => `color-mix(in srgb, ${color.value}, transparent 5%)`);
</script>

<template>
  <div class="icon-button" :class="[`icon-button-${type}`]">
    <div class="icon-button-slot" :class="[`icon-button-slot-${type}`]">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;
@use 'sass:color';

.icon-button {
  position: relative;
  height: 2rem;
  width: 2rem;
  padding: 0.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.1s ease-in-out;
  color: $color-black;
  background: $color-grey-50;

  &-secondary {
    box-shadow: $box-shadow-shallower;
    color: v-bind(secondaryColorForeground);
    background: v-bind(secondaryColorBackground);

    &:hover {
      background: v-bind(secondaryColorBackgroundHover);
    }

    &:active {
      background: v-bind(secondaryColorBackgroundActive);
    }
  }

  &-normal {
    &:hover {
      background: $color-grey-200;
    }
  }

  &-slot {
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
