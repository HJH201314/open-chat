<script setup lang="ts">
import { CheckboxGroupInjectionKey, type CusCheckboxGroupProps } from './types';
import { getRandomString } from '@/utils/string.ts';
import { provide, reactive, ref, toRefs, watch } from 'vue';

const props = withDefaults(defineProps<CusCheckboxGroupProps>(), {
  name: getRandomString(5),
  type: 'highlight',
  barAnimation: true,
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

const { name, type } = toRefs(props);
provide(
  CheckboxGroupInjectionKey,
  reactive({
    name,
    type,
    values: selectedValues,
    toggleValue,
    isSelected,
  })
);
</script>

<template>
  <fieldset class="cus-checkbox-group">
    <slot></slot>
  </fieldset>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.cus-checkbox-group {
  position: relative;
  width: fit-content;
  border-radius: 0.6em;
  background-color: $color-grey-200;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
}
</style>