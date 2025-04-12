<script setup lang="ts">
import { computed } from 'vue';
import { getColorHex } from '@/utils/color.ts';

type CusSpinProps = {
  show?: boolean; // 使用默认旋转组件时，决定是否展示；使用插槽时，决定是否执行旋转
  size?: string; // 大小，需要单位
  thickness?: string; // 厚度，需要单位
  color?: string;
};

const props = withDefaults(defineProps<CusSpinProps>(), {
  show: true,
  size: '1em',
  thickness: '2px',
  color: '#fff',
});

const slots = defineSlots<{
  // 自定义嵌入旋转组件
  default?(): any;
}>();

const indicatorColor = computed(() => getColorHex(props.color));
const showDefaultSpinning = computed(() => props.show && !slots.default);
const slotSpinning = computed(() => props.show && slots.default);
</script>

<template>
  <div class="cus-spin">
    <div v-if="showDefaultSpinning" class="spinning damping-circle"></div>
    <div v-if="slots.default" :class="{ spinning: slotSpinning }">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

@keyframes spinning-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spinning-scale {
  0%,
  100% {
    scale: 1;
  }
  50% {
    scale: 0.9;
  }
}

.cus-spin {
  // 重置行高避免旋转多余的行高导致旋转的元素不为 1:1
  line-height: 1;
}

.spinning {
  position: relative;
  width: v-bind(size);
  height: v-bind(size);
  transform-origin: center;
  animation:
    spinning-rotate 1.5s linear infinite,
    spinning-scale 1.5s $ease-out-circ infinite;
}

.damping-circle {
  border: v-bind(thickness) solid v-bind(indicatorColor);
  border-top: 2px solid transparent;
  border-radius: 50%;
}
</style>