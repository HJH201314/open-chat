<script lang="ts" setup>
import { computed, type CSSProperties, ref, watch } from 'vue';
import variables from '@/assets/variables.module.scss';
import { TransitionPresets, useTransition } from "@vueuse/core";
import { useTheme } from '@/components/theme/useTheme.ts';

type CircularProgressProps = {
  value?: number;
  backgroundColor?: string;
  foregroundColor?: string;
  size?: string;

  // 自定义style
  barStyle?: CSSProperties;
};

const { theme } = useTheme();

const props = withDefaults(defineProps<CircularProgressProps>(), {
  // TODO: use theme
  backgroundColor: variables.colorGrey200,
  foregroundColor: theme.colorPrimary,
  value: 10,
  size: '6rem',
});

const progress = ref(props.value);

watch(() => props.value, (newValue, oldValue) => {
  if (newValue != undefined && newValue !== oldValue) {
    progress.value = newValue;
  }
});

const transitionProgress = useTransition(progress, {
  duration: 200,
  transition: TransitionPresets.easeInOutCirc,
});

// 根据进度计算样式
const progressStyle = computed(() => {
  return {
    background: `conic-gradient(${props.foregroundColor} 0, ${props.foregroundColor} ${transitionProgress.value}%, ${props.backgroundColor} ${transitionProgress.value + 1}%, ${props.backgroundColor})`,
    ...props.barStyle,
  };
});

</script>

<template>
  <div class="circular-progress">
    <div class="progress-bar" :style="progressStyle">
    </div>
    <div class="slot">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;
.circular-progress {
  position: relative;
  width: v-bind(size);
  height: v-bind(size);

  > .progress-bar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    mask: radial-gradient(circle at center, transparent, transparent 55%, #000 57%, #000 100%);
  }

  > .slot {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
