<template>
  <div ref="refresh-container">
    <div
      class="pull-refresh"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div ref="refresh-tip" :style="{ transform: `translateY(${pullDistance}px)`, transitionDuration: transitionDuration }" class="refresh-tip">{{ statusText }}</div>
      <div :style="{ transform: `translateY(${pullDistance}px)`, transitionDuration: transitionDuration }" class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';

const props = withDefaults(
  defineProps<{
    threshold?: number; // 触发刷新的下拉阈值（像素）
    resetTime?: number; // 加载完成后复位时间（毫秒）
  }>(),
  {
    threshold: 48,
    resetTime: 500,
  }
);

const emit = defineEmits<{
  (e: 'refresh'): Promise<void> | void;
}>();

const refreshContainerRef = useTemplateRef('refresh-container');

const startY = ref<number>(0);
const currentY = ref<number>(0);
const isLoading = ref<boolean>(false);
const transitionDuration = computed(() => startY.value ? '0.2s' : '0.4s')

// 当前下拉距离
const pullDistance = computed(() => {
  console.log(refreshContainerRef.value?.scrollTop)
  if (isLoading.value) {
    return props.threshold;
  }

  const delta = currentY.value - startY.value;
  if (delta <= 0 || (refreshContainerRef.value?.scrollTop ?? 1) > 0) return 0;

  // 阻尼计算：超过阈值部分使用50%的阻力
  let dampedDelta = delta;
  const excessStart = props.threshold / 1.25;
  if (delta > excessStart) {
    const excess = delta - excessStart;
    dampedDelta = excessStart + excess * 0.15;
  }

  // 限制最大下拉距离为阈值的2倍
  // dampedDelta = Math.min(dampedDelta, props.threshold * 2);

  return dampedDelta;
});

// 状态提示文字
const statusText = computed(() => {
  if (isLoading.value) return '加载中...';
  return pullDistance.value >= props.threshold ? '释放立即刷新' : '下拉刷新';
});

const onTouchStart = (e: TouchEvent) => {
  console.log('[touchstart]', e);
  if (isLoading.value || (refreshContainerRef.value?.scrollTop ?? 1) != 0) {
    startY.value = 0;
    currentY.value = 0;
    return;
  }
  startY.value = e.touches[0].pageY;
  currentY.value = startY.value;
};

const onTouchMove = (e: TouchEvent) => {
  console.log('[touchmove]', e);
  if (isLoading.value || (refreshContainerRef.value?.scrollTop ?? 1) != 0) {
    startY.value = 0;
    currentY.value = 0;
    return;
  }
  currentY.value = e.touches[0].pageY;
};

const onTouchEnd = async () => {
  if (isLoading.value) return;

  if (pullDistance.value >= props.threshold) {
    isLoading.value = true;
    try {
      await emit('refresh');
    } finally {
      setTimeout(() => {
        isLoading.value = false;
        startY.value = 0;
        currentY.value = 0;
      }, props.resetTime);
    }
  } else {
    startY.value = 0;
    currentY.value = 0;
  }
};
</script>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.pull-refresh {
  position: relative;
}

.refresh-tip {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
  transition: transform 0.2s $ease-out-circ;
}

.content {
  transition: transform 0.2s $ease-out-circ;
}
</style>
