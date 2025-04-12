<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getColorHex } from '@/utils/color.ts';

type ProgressProps = {
  // 进度值 (0-100)
  value?: number;
  // 高度
  height?: string;
  // 背景色
  backgroundColor?: string;
  // 前景色
  foregroundColor?: string;
  // 是否显示进度文本
  showText?: boolean;
  // 是否圆角
  rounded?: boolean;
  // 动画持续时间(ms)
  duration?: number;
  // 自定义文本格式
  format?: (percentage: number) => string;
};

const props = withDefaults(defineProps<ProgressProps>(), {
  value: 0,
  height: '8px',
  backgroundColor: '--color-grey-200',
  foregroundColor: '--color-primary',
  showText: false,
  rounded: true,
  duration: 300,
  format: (percentage: number) => `${percentage}%`,
});

const progress = ref(props.value);

watch(
  () => props.value,
  (newValue) => {
    if (newValue !== undefined) {
      progress.value = newValue;
    }
  }
);

// 确保进度在 0-100 范围内
const normalizedProgress = computed(() => {
  return Math.min(100, Math.max(0, progress.value));
});

// 进度条样式
const progressStyle = computed(() => {
  return {
    width: `${normalizedProgress.value}%`,
    height: props.height,
    backgroundColor: getColorHex(props.foregroundColor),
    borderRadius: props.rounded ? '100px' : '0',
    transition: `width ${props.duration}ms ease-in-out`,
  };
});

// 容器样式
const containerStyle = computed(() => {
  return {
    backgroundColor: getColorHex(props.backgroundColor),
    height: props.height,
    borderRadius: props.rounded ? '100px' : '0',
  };
});

// 格式化进度文本
const textContent = computed(() => {
  return props.format(Math.round(normalizedProgress.value));
});
</script>

<template>
  <div class="cus-progress">
    <div class="progress-container" :style="containerStyle">
      <div class="progress-bar" :style="progressStyle"></div>
    </div>
    <div v-if="showText" class="progress-text">{{ textContent }}</div>
  </div>
</template>

<style scoped lang="scss">
.cus-progress {
  display: flex;
  align-items: center;
  width: 100%;

  .progress-container {
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  .progress-bar {
    position: absolute;
    left: 0;
    top: 0;
  }

  .progress-text {
    flex-shrink: 0;
    margin-left: 8px;
    font-size: 14px;
    color: var(--text-secondary, #333);
    white-space: nowrap;
  }
}
</style>