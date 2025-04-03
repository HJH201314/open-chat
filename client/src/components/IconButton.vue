<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '@/components/theme/useTheme.ts';
import { getColorHex, getLighterColor } from '@/utils/color.ts';

const props = withDefaults(
  defineProps<{
    type?: 'normal' | 'secondary';
    shape?: 'rect' | 'circle';
    shadow?: boolean;
    color?: 'danger' | 'warning' | 'success' | 'info' | 'primary' | string;
    noNormalBackground?: boolean;
  }>(),
  {
    type: 'normal',
    shape: 'rect',
    color: '',
    shadow: false,
    noNormalBackground: false,
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
const secondaryColorForeground = computed(() => getColorHex(color.value));
const secondaryColorBackground = computed(
  () => props.noNormalBackground ? 'transparent' : `color-mix(in srgb, ${getLighterColor(secondaryColorForeground.value, 0.9)}, transparent 30%)`
);
const secondaryColorBackgroundHover = computed(
  () => `color-mix(in srgb, ${getLighterColor(secondaryColorForeground.value, 0.85)}, transparent 20%)`
);
const secondaryColorBackgroundActive = computed(
  () => `color-mix(in srgb, ${getLighterColor(secondaryColorForeground.value, 0.8)}, transparent 10%)`
);
</script>

<template>
  <div
    class="icon-button"
    :class="{ [`icon-button-${type}`]: true, [`icon-button-${shape}`]: true, 'icon-button-shadowed': shadow }"
  >
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
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease-in-out;
  line-height: 1; // 避免行高影响居中布局
  color: $color-black;
  background: $color-grey-50;

  &-shadowed {
    box-shadow: $box-shadow-shallower;
  }

  &-secondary {
    color: v-bind(secondaryColorForeground);
    background: v-bind(secondaryColorBackground);
    backdrop-filter: blur(5px);

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

  &-circle {
    border-radius: 50%;
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
