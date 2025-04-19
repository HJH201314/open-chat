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
import { type DropdownMenuInnerProps, type DropdownOption } from '@/components/dropdown/types';
import { useElementBounding, useWindowSize } from '@vueuse/core';
import { computed, defineProps, reactive, useTemplateRef, watchEffect } from 'vue';

const props = withDefaults(
  defineProps<
    {
      options: DropdownOption[];
      parentBounding: ReturnType<typeof useElementBounding>;
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
const {
  left: parentLeft,
  right: parentRight,
  top: parentTop,
  bottom: parentBottom,
  width: parentWidth,
} = props.parentBounding;
const pos = reactive({
  top: computed(() => `${parentTop.value}px`),
  left: computed(() => `${parentLeft.value}px`),
  right: computed(() => `${parentRight.value}px`),
  bottom: computed(() => `${parentBottom.value}px`),
});
// 菜单最小宽度
const minWidth = computed(() => (!props._depth ? `${parentWidth.value}px` : `unset`));
// 遮罩放大倍数
// const scaleY = computed(() => `${window.outerHeight / selfHeight.value}`);
// const scaleX = computed(() => `${window.outerWidth / selfWidth.value}`);
const finalPos = reactive({
  top: '0',
  left: '0',
});
watchEffect(() => {
  let topNum = 0;
  let leftNum = 0;
  // 根据方位和父元素位置计算出菜单的位置
  switch (props.position) {
    case 'top':
      topNum = parentTop.value - selfHeight.value;
      leftNum = parentLeft.value;
      break;
    case 'bottom':
      topNum = parentBottom.value;
      leftNum = parentLeft.value;
      break;
    case 'left':
      topNum = parentTop.value;
      leftNum = parentLeft.value - selfWidth.value;
      break;
    case 'right':
      topNum = parentTop.value;
      leftNum = parentRight.value;
  }

  // 菜单超出屏幕边界时，调整位置
  if (topNum < 0) topNum = 0;
  if (leftNum < 0) leftNum = 0;
  if (topNum + selfHeight.value > windowHeight.value) topNum = windowHeight.value - selfHeight.value;
  if (leftNum + selfWidth.value > windowWidth.value) leftNum = windowWidth.value - selfWidth.value;

  finalPos.top = topNum + 'px';
  finalPos.left = leftNum + 'px';
});
</script>

<style lang="scss" scoped>
@use '@/assets/variables' as *;

.dropdown-menu {
  position: fixed;
  top: v-bind('finalPos.top');
  left: v-bind('finalPos.left');
  background-color: var(--color-white);
  list-style: none;
  padding: 0;
  box-shadow: $box-shadow;
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
  transition: opacity 0.1s $ease-out-circ;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}
</style>
