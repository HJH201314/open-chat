<template>
  <Teleport to="body">
    <Transition name="dropdown">
      <ul v-show="isOpen" ref="menu" :class="[`dropdown-menu--${position}`]" class="dropdown-menu">
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
import {
  type DropdownMenuInnerProps,
  type DropdownOption,
  type Horizontal,
  type Vertical,
} from '@/components/dropdown/types';
import { useElementBounding, useWindowSize } from '@vueuse/core';
import { computed, defineProps, type Reactive, reactive, useTemplateRef, watchEffect } from 'vue';

const props = withDefaults(
  defineProps<
    {
      options: DropdownOption[];
      parentBounding: Reactive<ReturnType<typeof useElementBounding>>;
      isOpen: boolean;
    } & DropdownMenuInnerProps
  >(),
  {
    position: 'bottom',
  }
);

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
  // if (topNum < 0 || bottomNum + selfHeight.value > windowHeight.value) {
  //   if (topNum < 0) topNum = 0;
  //   transformOrigin[0] = 'top';
  // }
  // if (leftNum < 0 || rightNum + selfWidth.value > windowWidth.value) {
  //   if (leftNum < 0) leftNum = 0;
  //   transformOrigin[1] = 'left';
  // }
  // if (bottomNum < 0 || bottomNum + selfHeight.value > windowHeight.value) {
  //   if (bottomNum < 0) bottomNum = windowHeight.value;
  //   transformOrigin[0] = 'bottom';
  // }
  // if (rightNum < 0 || leftNum + selfWidth.value > windowWidth.value) {
  //   if (rightNum < 0) rightNum = windowWidth.value;
  //   transformOrigin[1] = 'right';
  // }

  finalStyle.transformOrigin = transformOrigin.join(' ');

  // if (topNum + selfHeight.value > windowHeight.value) topNum = windowHeight.value - selfHeight.value;
  // if (leftNum + selfWidth.value > windowWidth.value) leftNum = windowWidth.value - selfWidth.value;

  finalStyle.top = topNum != undefined ? topNum + 'px' : 'unset';
  finalStyle.right = rightNum != undefined ? rightNum + 'px' : 'unset';
  finalStyle.bottom = bottomNum != undefined ? bottomNum + 'px' : 'unset';
  finalStyle.left = leftNum != undefined ? leftNum + 'px' : 'unset';

  finalStyle.translate = translate || 'unset';
});

// watchEffect(async () => {
//   let topNum = 0;
//   let leftNum = 0;
//   let bottomNum = 0;
//   let rightNum = 0;
//   let transformOrigin = ['center', 'center'];
//   // 根据方位和父元素位置计算出菜单的位置
//   switch (props.position) {
//     case 'top':
//       bottomNum = windowHeight.value - parentTop.value;
//       leftNum = parentLeft.value;
//       transformOrigin = ['bottom', 'left'];
//       break;
//     case 'bottom':
//       topNum = parentBottom.value;
//       leftNum = parentLeft.value;
//       transformOrigin = ['top', 'left'];
//       break;
//     case 'left':
//       topNum = parentTop.value;
//       rightNum = windowWidth.value - parentLeft.value;
//       transformOrigin = ['top', 'right'];
//       break;
//     case 'right':
//       topNum = parentTop.value;
//       leftNum = parentRight.value;
//       transformOrigin = ['top', 'left'];
//   }
//
//   // 菜单超出屏幕边界时，调整位置
//   if (topNum < 0 || bottomNum + selfHeight.value > windowHeight.value) {
//     if (topNum < 0) topNum = 0;
//     transformOrigin[0] = 'top';
//   }
//   if (leftNum < 0 || rightNum + selfWidth.value > windowWidth.value) {
//     if (leftNum < 0) leftNum = 0;
//     transformOrigin[1] = 'left';
//   }
//   if (bottomNum < 0 || bottomNum + selfHeight.value > windowHeight.value) {
//     if (bottomNum < 0) bottomNum = windowHeight.value;
//     transformOrigin[0] = 'bottom';
//   }
//   if (rightNum < 0 || leftNum + selfWidth.value > windowWidth.value) {
//     if (rightNum < 0) rightNum = windowWidth.value;
//     transformOrigin[1] = 'right';
//   }
//   finalStyle.transformOrigin = transformOrigin.join(' ');
//
//   if (topNum + selfHeight.value > windowHeight.value) topNum = windowHeight.value - selfHeight.value;
//   if (leftNum + selfWidth.value > windowWidth.value) leftNum = windowWidth.value - selfWidth.value;
//
//   finalStyle.top = topNum + 'px';
//   finalStyle.right = rightNum + 'px';
//   finalStyle.bottom = bottomNum + 'px';
//   finalStyle.left = leftNum + 'px';
//   if (!finalStyle.transformOrigin.includes('right')) {
//     finalStyle.right = 'unset';
//   }
//   if (!finalStyle.transformOrigin.includes('bottom')) {
//     finalStyle.bottom = 'unset';
//   }
//   if (!finalStyle.transformOrigin.includes('left')) {
//     finalStyle.left = 'unset';
//   }
//   if (!finalStyle.transformOrigin.includes('top')) {
//     finalStyle.top = 'unset';
//   }
// });
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

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    scale 0.25s $ease-out-back,
    opacity 0.25s linear;
}

.dropdown-enter-from,
.dropdown-leave-to {
  scale: 0;
  opacity: 0;
}
</style>
