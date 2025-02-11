<template>
  <li :class="{ selected: option.value === selectedValue }">
    <div @click="handleClick(option.value)">
      {{ option.label }}
      <span v-if="option.children">
        <!-- 显示箭头或图标以指示子菜单 -->
      </span>
    </div>
    <ul v-if="option.children">
      <dropdown-menu-item
        v-for="childOption in option.children"
        :key="childOption.value"
        :option="childOption"
        :selected-value="selectedValue"
        @select="handleClick"
      ></dropdown-menu-item>
    </ul>
  </li>
</template>

<script setup lang="ts">
import type { DropdownOption } from '@/components/dropdown/CusDropdown';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  option: DropdownOption;
  selectedValue: string | undefined;
}>();

const emit = defineEmits<{
  (event: 'select', value: string): void;
}>();

function handleClick(value: string) {
  emit('select', value);
}
</script>

<style scoped>
/* 样式调整，可能根据需要改变 */
</style>