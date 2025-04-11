<script setup lang="ts">
import { type CSSProperties, computed } from 'vue';

import { getRandomInt } from '@/utils/string.ts';
import { getColorHex, getDarkerColor } from '@/utils/color.ts';

const defaultColors = [
  '#eb5181', '#9031aa', '#613cb0', '#4350af',
  '#4994ec', '#4ba6ee', '#54b9d1', '#429488',
  '#67ad5b', '#97c15c', '#d0dc59', '#f6c344',
  '#f19d38', '#ec6337', '#74574a', '#9e9e9e',
  '#667c89', '#e15241', '#d3313c', '#4a7c8c',
  '#57a6b2', '#f6a35a', '#edb46e', '#f5e67f',
  '#62b7a7', '#bba0a6', '#e8b09b', '#5562e7',
  '#b4cfbc', '#a45159', '#f9b658', '#faa40f',
  '#dadc5b', '#d7bf37', '#d6ed64', '#4284b3',
  '#0a9ac2', '#3cc37d', '#36ba60', '#65c87e',
  '#59ab69', '#e28769', '#d87b41', '#e77665',
  '#a4a62b', '#d2b165', '#8fb03b', '#759f7e',
  '#a3ae75', '#a9d9a1', '#49c5a0', '#50b4b2',
  '#30b57e', '#8abdef', '#9296a0', '#787486',
];

const props = withDefaults(
  defineProps<{
    size?: CSSProperties['width'];
    name?: string;
    color?: CSSProperties['color'];
    shape?: 'circle' | 'square';
    gradient?: boolean;
  }>(),
  {
    size: '2rem',
    name: '',
    color: '',
    shape: 'circle',
    gradient: false,
  }
);

const background = computed(() => {
  let color = 'transparent';
  if (props.color) {
    color = getColorHex(props.color);
  } else {
    color = defaultColors[getRandomInt(0, defaultColors.length - 1)];
  }

  if (props.gradient) {
    return `linear-gradient(-45deg, ${color} 0%, ${getDarkerColor(color, 0.2)} 100%)`;
  } else {
    return color;
  }
});
</script>

<template>
  <div class="cus-avatar" :class="[`cus-avatar__shape-${shape}`]">
    <div class="cus-avatar__name">
      {{ name.slice(0, 1).toUpperCase() }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.cus-avatar {
  user-select: none;
  position: relative;
  width: v-bind('props.size');
  height: v-bind('props.size');
  background: v-bind(background);

  &__shape-circle {
    border-radius: 50%;
  }

  &__shape-square {
    border-radius: 8px;
  }

  &__name {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    font-size: calc(v-bind('props.size') / 2);
    color: rgba(255, 255, 255, 0.6)
  }
}
</style>