<script setup lang="ts">
import { computed } from 'vue';

type CusSpinProps = {
  show?: boolean;
  size?: string; // 大小，需要单位
  thickness?: string; // 厚度，需要单位
  color?: string | string[];
};

const props = withDefaults(defineProps<CusSpinProps>(), {
  show: true,
  size: '1em',
  thickness: '2px',
  color: '#fff',
});

const slots = defineSlots<{
  // 自定义嵌入旋转组件
  default?(): any
}>();

const showDefaultSpinning = computed(() => props.show && !slots.default);
const slotSpinning = computed(() => props.show && slots.default);
</script>

<template>
  <div>
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
  0%, 100% {
    scale: 1;
  }
  50% {
    scale: 0.9;
  }
}

.spinning {
  position: relative;
  width: v-bind(size);
  height: v-bind(size);
  // 重置行高避免旋转多余的行高导致旋转的元素不为 1:1
  line-height: 1;
  transform-origin: center;
  animation: spinning-rotate 1.5s linear infinite, spinning-scale 1.5s $ease-out-circ infinite;
}

.damping-circle {
  border: v-bind(thickness) solid v-bind(color);
  border-top: 2px solid transparent;
  border-radius: 50%;
}

</style>