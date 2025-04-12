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
import { useElementBounding } from '@vueuse/core';
import { computed, defineProps, reactive, useTemplateRef } from 'vue';

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
const topTop = computed(() => `${parentTop.value - selfHeight.value}px`);
const leftLeft = computed(() => `${parentLeft.value - selfWidth.value}px`);
// 菜单最小宽度
const minWidth = computed(() => (!props._depth ? `${parentWidth.value}px` : `unset`));
// 遮罩放大倍数
// const scaleY = computed(() => `${window.outerHeight / selfHeight.value}`);
// const scaleX = computed(() => `${window.outerWidth / selfWidth.value}`);
</script>

<style lang="scss" scoped>
@use '@/assets/variables' as *;

.dropdown-menu {
  position: fixed;
  background-color: var(--color-white);
  list-style: none;
  padding: 0;
  box-shadow: $box-shadow;
  border-radius: 8px;
  z-index: calc(2000 + 2 * v-bind(_depth));
  min-width: v-bind(minWidth);

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

  &--top {
    top: v-bind(topTop);
    left: v-bind('pos.left');
  }

  &--bottom {
    top: v-bind('pos.bottom');
    left: v-bind('pos.left');
  }

  &--left {
    left: v-bind(leftLeft);
    top: v-bind('pos.top');
    //transform: translateY(-50%);
  }

  &--right {
    left: v-bind('pos.right');
    top: v-bind('pos.top');
    //transform: translateY(-50%);
  }
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
