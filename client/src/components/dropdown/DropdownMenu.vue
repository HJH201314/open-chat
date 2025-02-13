<template>
  <ul v-show="isOpen" ref="menu" :class="[`dropdown-menu--${position}`]" class="dropdown-menu">
    <dropdown-menu-item
      v-for="option in options"
      :key="option.value"
      v-element-hover="() => showOneSubMenu(option)"
      v-on-click-outside="() => closeSubMenu(option)"
      :_current-value-path="_currentValuePath"
      :_depth="_depth"
      :class="{ selected: option.value === selectedValue || _currentValuePath?.includes(option.value) }"
      :option="option"
      :selected-value="selectedValue"
      :show-sub-menu="showSubMenu[option.value] || false"
      class="dropdown-menu-item"
      @click="handleClick(option)"
      @select="(v, arr) => $emit('select', v, arr)"
    />
  </ul>
</template>

<script lang="ts" setup>
import DropdownMenuItem from '@/components/dropdown/DropdownMenuItem.vue';
import type { DropdownMenuEmits, DropdownMenuProps, DropdownOption } from '@/components/dropdown/types';
import { vElementHover, vOnClickOutside } from '@vueuse/components';
import { useArrayFilter, useElementBounding } from '@vueuse/core';
import { computed, defineEmits, defineProps, reactive, useTemplateRef } from 'vue';

const props = withDefaults(
  defineProps<
    {
      options: DropdownOption[];
      parentBounding: ReturnType<typeof useElementBounding>;
      isOpen: boolean;
    } & DropdownMenuProps
  >(),
  {
    position: 'bottom',
    _valuePath: () => [],
  }
);

const optionsWithChildren = useArrayFilter(props.options, (e) => {
  return e.children;
});
const showSubMenu = reactive({
  ...optionsWithChildren.value.reduce(
    (acc, opt) => {
      acc[opt.value] = false;
      return acc;
    },
    {} as Record<string, boolean>
  ),
});

// 收起当前 item 的下级菜单
function closeSubMenu(option: DropdownOption) {
  if (option.children && option.children.length) {
    showSubMenu[option.value] = false;
  }
}

// 展示当前 item 的下级菜单，收起其它 item 的下级菜单
function showOneSubMenu(option: DropdownOption) {
  Object.entries(showSubMenu).forEach(([key]) => {
    showSubMenu[key] = key === option.value;
  });
}

const selfRef = useTemplateRef('menu');

const selfBounding = useElementBounding(selfRef);
const { left: parentLeft, right: parentRight, top: parentTop, bottom: parentBottom } = props.parentBounding;
const pos = reactive({
  top: computed(() => `${parentTop.value}px`),
  left: computed(() => `${parentLeft.value}px`),
  right: computed(() => `${parentRight.value}px`),
  bottom: computed(() => `${parentBottom.value}px`),
});
const topTop = computed(() => `${parentTop.value - selfBounding.height.value}px`);
const leftLeft = computed(() => `${parentLeft.value - selfBounding.width.value}px`);

const emit = defineEmits<DropdownMenuEmits>();

function handleClick(option: DropdownOption) {
  if (option.children && option.children.length) {
    showSubMenu[option.value] = !showSubMenu[option.value];
  } else {
    emit('select', option.value, [...props._valuePath, option.value]);
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.module';

.dropdown-menu {
  position: fixed;
  border-radius: 0.5em;
  background-color: white;
  list-style: none;
  padding: 0;
  box-shadow: $box-shadow;
  z-index: calc(2000 + v-bind(_depth));
  overflow: hidden;

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

  &-item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0.25em 0.5em;
    cursor: pointer;
    transition: background-color 0.2s $ease-out-circ;
    background-color: white;
    color: initial;

    &:hover {
      background-color: $color-grey-200;
    }

    &.selected {
      color: $color-primary;
    }
  }
}
</style>
