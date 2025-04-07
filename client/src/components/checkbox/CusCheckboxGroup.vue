<script setup lang="ts">
import { CheckboxGroupInjectionKey, type CusCheckboxGroupProps } from './types';
import { getRandomString } from '@/utils/string.ts';
import { computed, provide, ref, toRefs, watch } from 'vue';

const props = withDefaults(defineProps<CusCheckboxGroupProps>(), {
  name: getRandomString(5),
  type: 'highlight',
  barAnimation: true,
  direction: 'column',
  backgroundMode: 'color',
  displayStyle: 'icon',
});

const modelValue = defineModel<any[]>({ default: [] });

const emits = defineEmits<{
  (event: 'change', value: any[]): void;
}>();
defineSlots<{
  default(): any;
}>();

const selectedValues = ref<any[]>(modelValue.value || []);

// 观测 modelValue
watch(
  () => modelValue.value,
  (newModelValue) => {
    console.debug('[checkbox] newModelValue', newModelValue);
    if (
      newModelValue?.length !== selectedValues.value?.length ||
      !newModelValue?.every((v) => selectedValues.value.includes(v))
    ) {
      selectedValues.value = [...(newModelValue || [])];
    }
  },
  { deep: true }
);

// 监听选中值变化，更新modelValue
watch(
  () => selectedValues.value,
  (newValues) => {
    modelValue.value = [...newValues];
    emits('change', newValues);
  },
  { deep: true }
);

function toggleValue(val?: any) {
  if (val === undefined) return;

  const index = selectedValues.value.findIndex((v) => v === val);
  if (index > -1) {
    // 如果值已存在，则移除
    selectedValues.value = [...selectedValues.value.filter((v) => v !== val)];
  } else {
    // 如果值不存在，则添加
    selectedValues.value = [...selectedValues.value, val];
  }
}

function isSelected(val?: any): boolean {
  if (val === undefined) return false;
  return selectedValues.value.includes(val);
}

const { name, type, direction, displayStyle } = toRefs(props);
const displayStyleClassName = computed(() => `display-${props.displayStyle}`);
const backgroundModeClassName = computed(() => `bg-mode-${props.backgroundMode}`);

provide(CheckboxGroupInjectionKey, {
  name,
  type,
  direction,
  displayStyle,
  values: selectedValues,
  toggleValue,
  isSelected,
});
</script>

<template>
  <fieldset class="cus-checkbox-group" :class="[displayStyleClassName, backgroundModeClassName, `direction-${props.direction}`]">
    <slot></slot>
  </fieldset>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.cus-checkbox-group {
  position: relative;
  width: fit-content;
  border-radius: 0.6em;
  display: flex;
  flex-wrap: wrap;
  padding: 3px;
  gap: 2px;

  &.bg-mode {
    &-color {
      background-color: $color-grey-100;
    }
    &-transparent {
      background-color: $color-bg-transparent-100;
    }
  }

  &.direction-row {
    flex-direction: row;
  }

  &.direction-column {
    flex-direction: column;
  }
}
</style>