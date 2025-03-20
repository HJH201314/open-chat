<template>
  <li ref="menu-item" v-element-hover="(state) => handleHover(state)" class="menu-item">
    <div ref="menu-item-body" class="menu-item-body" @click="handleClick">
      <Component :is="iconComponent" v-if="iconComponent" />
      <div style="flex: 1">
        <span>{{ option.label }}</span>
      </div>
      <Right v-if="option.children" class="arrow" style="margin-left: auto"></Right>
    </div>
    <dropdown-menu
      v-if="option.children"
      v-model:current-showing-path="currentShowingPath"
      :_depth="_depth + 1"
      :_value-path="[..._valuePath, option.value]"
      :is-open="isSubMenuOpen"
      :options="option.children"
      :parent-bounding="bounding"
      :position="getChildrenPos(option)"
    ></dropdown-menu>
  </li>
</template>

<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import {
  DropdownCurrentInfoInjectionKey,
  type DropdownMenuInnerProps,
  type DropdownOption,
} from '@/components/dropdown/types';
import { Right } from '@icon-park/vue-next';
import { vElementHover } from '@vueuse/components';
import { useArrayFilter, useArrayIncludes, useElementBounding } from '@vueuse/core';
import { computed, defineProps, h, inject, useTemplateRef } from 'vue';

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

const iconComponent = computed(() => {
  if (typeof props.option.icon == 'string') {
    return h('img', { style: 'width: 1em; height: 1em;', src: props.option.icon });
  } else {
    return props.option.icon ? h(props.option.icon, { style: 'width: 1em; height: 1em;' }) : null;
  }
})

const currentDropdownInfo = inject(DropdownCurrentInfoInjectionKey);

const currentShowingPath = defineModel<string[]>('currentShowingPath');
const frontPath = useArrayFilter(
  () => currentShowingPath.value ?? [],
  (_, i) => {
    return i < props._depth - 1;
  }
);

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
function handleClick() {
  if (props.option.children && props.option.children.length) {
    isLargeScreen.value && isSubMenuOpen.value ? hideSubMenu() : showSubMenu();
  } else {
    currentDropdownInfo?.onSelect(props.option, [...props._valuePath, props.option.value]);
  }
}
</script>

<style lang="scss" scoped>
.menu-item {
  min-width: 5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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

  &-body {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.25em;
  }
}
</style>