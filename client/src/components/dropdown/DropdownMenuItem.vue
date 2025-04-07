<template>
  <li ref="menu-item" v-element-hover="(state) => handleHover(state)" class="menu-item">
    <div
      ref="menu-item-body"
      class="menu-item-body"
      :class="{
        selected:
          option.value === dropdownCurrent?.currentValue.value || dropdownCurrent?.currentOptionPath?.value?.includes(option),
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
import { computed, defineProps, h, inject, useTemplateRef, watch, watchEffect } from 'vue';
import useGlobal from '@/commands/useGlobal.ts';

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
const bounding = useElementBounding(menuItemRef);
const isSubMenuOpen = useArrayIncludes(
  () => currentShowingPath.value ?? [],
  () => props.option.value
);

watch(() => currentShowingPath.value, (newVal) => {
  console.log('currentShowingPath', props.option, newVal)
})

const showSubMenu = () => {
  currentShowingPath.value = [...frontPath.value, props.option.value];
};
const hideSubMenu = () => {
  currentShowingPath.value = [...frontPath.value];
};

// 处理鼠标悬停，切换子菜单显示状态
function handleHover(state: boolean) {
  if (currentShowingPath.value && state) {
    console.log('hover1')
    showSubMenu();
  }
}

const { isLargeScreen } = useGlobal();

// 处理菜单项点击
function handleClick() {
  if (props.option.children?.length) {
    console.log('click1', isSubMenuOpen.value)
    isLargeScreen.value && isSubMenuOpen.value ? hideSubMenu() : showSubMenu();
  } else {
    console.log('click2')
    dropdownCurrent?.onSelect(props.option, [...props._valuePath, props.option.value]);
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
    gap: 0.25em;
    white-space: nowrap;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background-color 0.2s $ease-out-circ;

    &:hover {
      background-color: $color-grey-200;
    }

    &.selected {
      color: var(--color-primary);
    }
  }
}
</style>