<template>
  <li
    ref="menu-item"
    v-element-hover="(state) => handleHover(state)"
    class="menu-item"
    @click.stop="handleClick(option)"
  >
    <div>
      <span>{{ option.label }}</span>
    </div>
    <Right v-if="option.children" class="arrow" style="margin-left: auto"></Right>
    <dropdown-menu
      v-if="option.children"
      v-model:current-showing-path="currentShowingPath"
      :_current-option-path="_currentOptionPath"
      :_depth="_depth + 1"
      :_value-path="[..._valuePath, option.value]"
      :is-open="isSubMenuOpen"
      :options="option.children"
      :parent-bounding="bounding"
      :position="getChildrenPos(option)"
      :selected-value="selectedValue"
      @select="(v, o, arr) => $emit('select', v, o, arr)"
    ></dropdown-menu>
  </li>
</template>

<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import type { DropdownMenuEmits, DropdownMenuInnerProps, DropdownOption } from '@/components/dropdown/types';
import { Right } from '@icon-park/vue-next';
import { vElementHover } from '@vueuse/components';
import { useArrayFilter, useArrayIncludes, useElementBounding } from '@vueuse/core';
import { defineEmits, defineProps, useTemplateRef } from 'vue';

const props = withDefaults(
  defineProps<
    {
      option: DropdownOption;
    } & DropdownMenuInnerProps
  >(),
  {
    position: 'bottom',
  }
);

const currentShowingPath = defineModel<string[]>('currentShowingPath');
const frontPath = useArrayFilter(
  () => currentShowingPath.value ?? [],
  (v, i) => {
    return i < props._depth - 1;
  }
);

const emit = defineEmits<DropdownMenuEmits>();

/**
 * 获取下级菜单的位置
 * @param option 包含下级菜单的上级菜单项
 */
const getChildrenPos = (option: DropdownOption) => {
  if (option.childrenMenuOption?.position) return option.childrenMenuOption.position;
  else return 'right';
};

const menuItemRef = useTemplateRef('menu-item');
const bounding = useElementBounding(menuItemRef);
const isSubMenuOpen = useArrayIncludes(
  () => currentShowingPath.value ?? [],
  () => props.option.value
);

const showSubMenu = () => {
  // console.log('showSubMenu', props.option, [...frontPath.value, props.option.value]);
  currentShowingPath.value = [...frontPath.value, props.option.value];
};
const hideSubMenu = () => {
  // console.log('hideSubMenu', props.option, [...frontPath.value]);
  currentShowingPath.value = [...frontPath.value];
};

// 处理鼠标悬停，切换子菜单显示状态
function handleHover(state: boolean) {
  if (currentShowingPath.value && state) {
    showSubMenu();
  }
}

const { isLargeScreen } = useGlobal();

// 处理菜单项点击
function handleClick(option: DropdownOption) {
  if (option.children && option.children.length) {
    isLargeScreen.value && isSubMenuOpen.value ? hideSubMenu() : showSubMenu();
  } else {
    emit('select', option.value, option, [...props._valuePath, option.value]);
  }
}
</script>

<style lang="scss" scoped>
.menu-item {
  white-space: nowrap;

  &:not(:last-child):first-child {
    border-radius: 8px 8px 0 0;
  }

  &:not(:first-child):last-child {
    border-radius: 0 0 8px 8px;
  }

  &:is(:first-child):last-child {
    border-radius: 8px;
  }
}
</style>