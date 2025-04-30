<template>
  <Teleport to="body">
    <Transition name="dropdown">
      <ul v-show="isOpen" v-bind="$attrs" ref="menu" :class="[`dropdown-menu--${position}`]" class="dropdown-menu">
        <dropdown-menu-item
          v-for="option in options"
          :key="option.value"
          v-model:current-showing-path="currentShowingPath"
          :_depth="_depth"
          :_value-path="_valuePath"
          :option="option"
          class="dropdown-menu-item"
        />
      </ul>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import DropdownMenuItem from '@/components/dropdown/DropdownMenuItem.vue';
import { type DropdownMenuProps, type Horizontal, type Vertical } from '@/components/dropdown/types';
import { useElementBounding, useWindowSize } from '@vueuse/core';
import { computed, defineProps, reactive, useTemplateRef, watchEffect } from 'vue';

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  position: 'bottom',
});
defineOptions({
  inheritAttrs: false,
});

const currentShowingPath = defineModel<string[]>('currentShowingPath', { default: () => [] });

const selfRef = useTemplateRef('menu');

const { height: selfHeight, width: selfWidth } = useElementBounding(selfRef);
const { height: windowHeight, width: windowWidth } = useWindowSize();
const parent = reactive(props.parentBounding);
// 菜单最小宽度
const minWidth = computed(() => (!props._depth ? `${parent.width}px` : `unset`));
// 最终样式
const finalStyle = reactive({
  top: 'unset',
  right: 'unset',
  bottom: 'unset',
  left: 'unset',
  translate: 'unset',
  transformOrigin: 'center center',
});
watchEffect(() => {
  let topNum: number | undefined = undefined;
  let leftNum: number | undefined = undefined;
  let bottomNum: number | undefined = undefined;
  let rightNum: number | undefined = undefined;
  let translate = '';
  let transformOrigin: [string, string] = ['center', 'center'];

  const pos = props.position;

  if (pos.includes('-')) {
    // 组合方向，支持 `${Vertical}-${Horizontal}` 或 `${Horizontal}-${Vertical}`
    const parts = pos.split('-') as (Vertical | Horizontal)[];
    const firstPart = parts[0];
    const secondPart = parts[1];

    if (!firstPart || !secondPart) {
      console.warn('Invalid position prop:', pos);
      return;
    }

    // 首个方向定位
    switch (firstPart) {
      case 'top':
        bottomNum = windowHeight.value - parent.top;
        transformOrigin[0] = 'bottom';
        break;
      case 'bottom':
        topNum = parent.bottom;
        transformOrigin[0] = 'top';
        break;
      case 'left':
        rightNum = windowWidth.value - parent.left;
        transformOrigin[1] = 'right';
        break;
      case 'right':
        leftNum = parent.right;
        transformOrigin[1] = 'left';
        break;
    }

    // 二个方向定位
    switch (secondPart) {
      case 'left':
        leftNum = parent.left;
        transformOrigin[1] = 'left';
        break;
      case 'right':
        rightNum = windowWidth.value - parent.right;
        transformOrigin[1] = 'right';
        break;
      case 'top':
        topNum = parent.top;
        transformOrigin[0] = 'top';
        break;
      case 'bottom':
        bottomNum = windowHeight.value - parent.bottom;
        transformOrigin[0] = 'bottom';
        break;
    }
  } else {
    // 单方向定位
    switch (pos) {
      case 'top':
        bottomNum = windowHeight.value - parent.top;
        leftNum = parent.left + parent.width / 2;
        translate = '-50% 0';
        transformOrigin = ['bottom', 'center'];
        break;
      case 'bottom':
        topNum = parent.bottom;
        leftNum = parent.left + parent.width / 2;
        translate = '-50% 0';
        transformOrigin = ['top', 'center'];
        break;
      case 'left':
        topNum = parent.top + parent.height / 2;
        rightNum = windowWidth.value - parent.left;
        translate = '0 -50%';
        transformOrigin = ['center', 'right'];
        break;
      case 'right':
        topNum = parent.top + parent.height / 2;
        leftNum = parent.right;
        translate = '0 -50%';
        transformOrigin = ['center', 'left'];
        break;
    }
  }

  // 边界检测及调整
  const margin = 4;
  if (topNum != undefined) {
    if (topNum + selfHeight.value > windowHeight.value - margin) bottomNum = margin;
    if (topNum < margin) topNum = margin;
  }
  if (leftNum != undefined) {
    if (leftNum + selfWidth.value > windowWidth.value - margin) leftNum = windowWidth.value - selfWidth.value - margin;
    if (leftNum < margin) leftNum = margin;
  }
  if (bottomNum != undefined) {
    if (bottomNum + selfHeight.value > windowHeight.value - margin) topNum = margin;
    if (bottomNum < margin) bottomNum = margin;
  }
  if (rightNum != undefined) {
    if (rightNum + selfWidth.value > windowWidth.value - margin)
      rightNum = windowWidth.value - selfWidth.value - margin;
    if (rightNum < margin) rightNum = margin;
  }

  finalStyle.transformOrigin = transformOrigin.join(' ');
  finalStyle.top = topNum != undefined ? topNum + 'px' : 'unset';
  finalStyle.right = rightNum != undefined ? rightNum + 'px' : 'unset';
  finalStyle.bottom = bottomNum != undefined ? bottomNum + 'px' : 'unset';
  finalStyle.left = leftNum != undefined ? leftNum + 'px' : 'unset';

  finalStyle.translate = translate || 'unset';
});
</script>

<style lang="scss" scoped>
@use '@/assets/variables' as *;

.dropdown-menu {
  position: fixed;
  top: v-bind('finalStyle.top');
  right: v-bind('finalStyle.right');
  bottom: v-bind('finalStyle.bottom');
  left: v-bind('finalStyle.left');
  translate: v-bind('finalStyle.translate');
  transform-origin: v-bind('finalStyle.transformOrigin');
  background-color: var(--color-white);
  list-style: none;
  padding: 0;
  box-shadow: $box-shadow-deeper;
  border: 1px solid var(--color-trans-200);
  border-radius: 8px;
  z-index: calc(2000 + 2 * v-bind(_depth));
  min-width: v-bind(minWidth);
  // 限制最大高度和宽度
  max-height: calc(100 * var(--vh));
  max-width: 100vw;
  overflow: auto; // 超过最大大小时可以滚动

  //@media screen and (max-width: $screen-sm) {
  //  left: 50% !important;
  //  top: 50% !important;
  //  transform: translate(-50%, -50%);
  //  font-size: 1.5em;
  //
  //  &::before {
  //    position: fixed;
  //    inset: 0;
  //    scale: v-bind(scaleX) v-bind(scaleY);
  //    content: '';
  //    z-index: -1;
  //    background-color: rgba(0 0 0 / 50%);
  //  }
  //}
}
</style>
<style lang="scss">
@use '@/assets/variables' as *;

.dropdown-enter-active {
  transition:
    scale 0.2s $ease-out-cubic,
    opacity 0.2s linear;
}

.dropdown-leave-active {
  transition:
    scale 0.15s $ease-out-cubic,
    opacity 0.15s linear;
}

.dropdown-enter-from,
.dropdown-leave-to {
  scale: 0;
  opacity: 0;
}
</style>
