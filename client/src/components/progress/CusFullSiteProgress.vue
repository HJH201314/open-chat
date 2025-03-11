<!-- progress/ProgressBar.vue -->
<template>
  <Transition name="top-move-in-out">
    <div v-show="showProgress" ref="progress-bar" class="progress-bar" :style="barStyle"></div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, useTemplateRef } from 'vue';
import { until } from '@vueuse/core';

const progressBarRef = useTemplateRef('progress-bar');
const progress = ref(0);
const interval = ref<number>();
const showProgress = ref(false);

const barStyle = computed(() => ({
  width: `${progress.value}%`,
  height: '2px',
  backgroundColor: 'var(--color-primary)', // TODO: 接入 token
  transition: 'all 0.25s ease',
}));

const start = async () => {
  showProgress.value = true;
  await until(progressBarRef).not.toBeNull();
  // 在 50 ms 内 finish 则不会显示进度条
  progress.value = 0;
  interval.value = setInterval(() => {
    if (progress.value == 0) progress.value = 1;
    else progress.value = Math.min(progress.value * 1.25, 95);
  }, 50);
};

const finish = () => {
  if (interval.value) {
    clearInterval(interval.value);
    interval.value = undefined;
  }
  // 当进度条不为 0 时，才先将进度条设置为 100%
  if (progress.value != 0) progress.value = 100;
  setTimeout(() => {
    showProgress.value = false;
  }, 300);
};

// 组件卸载时清理定时器
onUnmounted(() => {
  if (interval.value) clearInterval(interval.value);
});

// 暴露方法
defineExpose({ start, finish });
</script>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.top-move-in-out-enter-from,
.top-move-in-out-leave-to {
  opacity: 0;
}
</style>
