<template>
  <li ref="menu-item" v-element-hover="(state) => handleHover(state)" class="menu-item" :style="option.style">
    <div
      ref="menu-item-body"
      class="menu-item-body"
      :class="{
        selected:
          option.value === dropdownCurrent?.currentValue?.value ||
          dropdownCurrent?.currentOptionPath?.value?.includes(option),
      }"
      @click="handleClick"
    >
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
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import {
  DropdownCurrentInfoInjectionKey,
  type DropdownMenuInnerProps,
  type DropdownOption,
} from '@/components/dropdown/types';
import { Right } from '@icon-park/vue-next';
import { vElementHover } from '@vueuse/components';
import { useArrayFilter, useArrayIncludes, useElementBounding } from '@vueuse/core';
import { computed, defineProps, h, inject, reactive, useTemplateRef } from 'vue';
import useGlobal from '@/commands/useGlobal.ts';
import { nextFrame } from '@/utils/element.ts';

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
    return props.option.icon ? h(props.option.icon) : null;
  }
});

// 注入当前选中项信息
const dropdownCurrent = inject(DropdownCurrentInfoInjectionKey);

const currentShowingPath = defineModel<string[]>('currentShowingPath', { default: () => [] });
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
const bounding = reactive(useElementBounding(menuItemRef));
const isSubMenuOpen = useArrayIncludes(
  () => currentShowingPath.value ?? [],
  () => props.option.value
);

const showSubMenu = () => {
  // 更新一下本菜单项位置，以便子菜单显示位置正确
  currentShowingPath.value = [...frontPath.value, props.option.value];
  bounding.update();
};
const hideSubMenu = () => {
  currentShowingPath.value = [...frontPath.value];
};

// 处理鼠标悬停，切换子菜单显示状态
function handleHover(state: boolean) {
  if (currentShowingPath.value && state) {
    nextFrame(() => {
      showSubMenu();
    });
  }
}

const { isLargeScreen } = useGlobal();

// 处理菜单项点击
function handleClick() {
  if (props.option.children?.length) {
    isLargeScreen.value && isSubMenuOpen.value ? hideSubMenu() : showSubMenu();
  } else {
    const path = [...props._valuePath, props.option.value];
    dropdownCurrent?.onSelect?.(props.option, path);
    props.option.onClick?.(props.option, path);
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/variables' as *;

.menu-item {
  min-width: 5rem;
  cursor: pointer;
  color: var(--text-primary);
  padding-inline: 0.25rem;
  padding-top: 0.25rem;
  line-height: 1;

  &:last-child {
    padding-bottom: 0.25rem;
  }

  &-body {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    white-space: nowrap;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background-color 0.2s $ease-out-circ;

    &:hover {
      background-color: var(--color-trans-200);
    }

    &:active {
      background-color: var(--color-trans-300);
    }

    &.selected {
      color: var(--color-primary);
    }
  }
}
</style>