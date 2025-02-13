<script lang="ts" setup>
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import type { DropdownMenuEmits, DropdownMenuProps, DropdownOption } from '@/components/dropdown/types';
import { Right } from '@icon-park/vue-next';
import { useElementBounding } from '@vueuse/core';
import { defineEmits, defineProps, useTemplateRef } from 'vue';

const props = withDefaults(
  defineProps<
    {
      option: DropdownOption;
      showSubMenu: boolean;
    } & DropdownMenuProps
  >(),
  {
    position: 'bottom',
    _valuePath: () => [],
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
</script>

<template>
  <li ref="menu-item">
    <div>
      <span>{{ option.label }}</span>
    </div>
    <Right v-if="option.children" class="arrow" style="margin-left: auto"></Right>
    <dropdown-menu
      v-if="option.children"
      :_current-value-path="_currentValuePath"
      :_depth="_depth + 1"
      :_value-path="[..._valuePath, option.value]"
      :is-open="showSubMenu"
      :options="option.children"
      :parentBounding="bounding"
      :position="getChildrenPos(option)"
      :selected-value="selectedValue"
      @select="(v, arr) => $emit('select', v, arr)"
    ></dropdown-menu>
  </li>
</template>

<style lang="scss" scoped></style>