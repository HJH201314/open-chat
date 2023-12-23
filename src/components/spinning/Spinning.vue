<script setup lang="ts">
type SpinningProps = {
  show?: boolean;
  size?: string; // 大小，需要单位
  thickness?: string; // 厚度，需要单位
  color?: string | string[];
};

const props = withDefaults(defineProps<SpinningProps>(), {
  show: true,
  size: '1rem',
  thickness: '2px',
  color: '#fff',
});
</script>

<template>
  <div class="damping-circle" v-show="show"></div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.module';
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

.damping-circle {
  position: relative;
  width: v-bind(size);
  height: v-bind(size);
  border: v-bind(thickness) solid v-bind(color);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spinning-rotate 1.5s linear infinite, spinning-scale 1.5s $ease-out-circ infinite;
}

</style>