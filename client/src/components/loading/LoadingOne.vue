<script setup lang="ts">
import { computed } from 'vue';
import { getColorHex } from '@/utils/color.ts';

const props = withDefaults(
  defineProps<{
    size?: string;
    color?: string;
  }>(),
  {
    size: '1em',
    color: '#fff',
  }
);

const height = computed(() => {
  return props.size;
});
const width = computed(() => {
  return `calc(${props.size} * 0.8)`;
});
const color = computed(() => {
  return getColorHex(props.color);
});
</script>

<template>
  <div class="loader loader--style6" title="5">
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      :width="width"
      :height="height"
      viewBox="0 0 24 30"
      xml:space="preserve"
    >
      <rect x="0" y="13" width="4" height="5" fill="#333">
        <animate
          attributeName="height"
          attributeType="XML"
          values="5;21;5"
          begin="0s"
          dur="0.9s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          attributeType="XML"
          values="13; 5; 13"
          begin="0s"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="10" y="13" width="4" height="5" fill="#333">
        <animate
          attributeName="height"
          attributeType="XML"
          values="5;21;5"
          begin="0.225s"
          dur="0.9s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          attributeType="XML"
          values="13; 5; 13"
          begin="0.225s"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="20" y="13" width="4" height="5" fill="#333">
        <animate
          attributeName="height"
          attributeType="XML"
          values="5;21;5"
          begin="0.45s"
          dur="0.9s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y"
          attributeType="XML"
          values="13; 5; 13"
          begin="0.45s"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  </div>
</template>

<style scoped lang="scss">
svg path,
svg rect {
  fill: v-bind(color);
}
</style>
