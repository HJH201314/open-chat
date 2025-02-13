<script lang="ts" setup>
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import type { CusSelectProps, DropdownMenuEmits, DropdownOption } from '@/components/dropdown/types';
import { onClickOutside, useElementBounding } from '@vueuse/core';
import { computed, ref, useTemplateRef, watch, watchEffect } from 'vue';

const props = withDefaults(defineProps<CusSelectProps>(), {
  placeholder: '请选择',
  position: 'bottom',
  _depth: 0,
  toggleStyle: () => ({}),
});
const modelValuePath = defineModel<string[]>('value-path');

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
} & DropdownMenuEmits>();

const toggleRef = useTemplateRef('dropdown-toggle');
const toggleBounding = useElementBounding(toggleRef);

watch(
  () => props.modelValue,
  (newVal) => {
    selectedValue.value = newVal;
  }
);

const isOpen = ref(false);
const selectedValue = ref(props.modelValue);

// 当前选中项
const selectedOption = computed(() => {
  const findCurrentValueOption = (options: DropdownOption[]): DropdownOption | undefined => {
    return options
      .flatMap((opt) => {
        return [opt, ...(opt.children ?? [])];
      })
      .find((opt) => opt.value === selectedValue.value);
  };
  return findCurrentValueOption(props.options);
});
// 当前选中项的 label
const selectedLabel = computed(() => {
  return selectedOption.value ? selectedOption.value.label : props.placeholder;
});
// 当当前选中项路径为空时，计算当前选中项的路径并双向绑定
watchEffect(() => {
  if (!modelValuePath.value?.length && selectedOption.value) {
    const findCurrentOptionPath = (
      options: DropdownOption[],
      target: DropdownOption,
      path: string[] = []
    ): string[] | null => {
      for (let option of options) {
        // 包含当前 level 的 value
        const currentPath = path.concat(option.value);
        // 如果找到了目标，返回当前路径
        if (option.value === target.value) {
          return currentPath;
        }
        // 如果存在 children，递归查找
        if (option.children) {
          const result = findCurrentOptionPath(option.children, target, currentPath);
          if (result) {
            return result;
          }
        }
      }
      // 未找到返回 null
      return null;
    };
    modelValuePath.value = findCurrentOptionPath(props.options, selectedOption.value) ?? [];
  }
});

// 切换 Dropdown 展示状态
function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
}

// 点击 Dropdown 外部则关闭
onClickOutside(
  useTemplateRef<HTMLElement>('root-menu'),
  () => {
    isOpen.value = false;
  },
  {
    ignore: [toggleRef],
  }
);

function selectOption(value: string, valuePath: string[]) {
  console.log('selected', value, valuePath);
  selectedValue.value = value;
  emit('update:modelValue', value);
  emit('select', value, valuePath);
  modelValuePath.value = valuePath;
  isOpen.value = false;
}
</script>

<template>
  <div :class="{ active: isOpen, disabled: disabled }" class="dropdown">
    <div
      ref="dropdown-toggle"
      :class="{ 'dropdown-toggle--active': isOpen }"
      :style="toggleStyle"
      class="dropdown-toggle"
      @click="toggleDropdown"
    >
      {{ labelRenderText?.(selectedOption, modelValuePath) || selectedLabel }}
      <span class="arrow"></span>
    </div>
    <Teleport to="body">
      <dropdown-menu
        ref="root-menu"
        :_current-value-path="modelValuePath"
        :_depth="0"
        :_value-path="[]"
        :is-open="isOpen"
        :options="options"
        :parentBounding="toggleBounding"
        :position="position"
        :selected-value="selectedValue"
        @select="selectOption"
      ></dropdown-menu>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.module';

.dropdown {
  position: relative;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &-toggle {
    padding: 0.25em 0.5em;
    border-radius: 0.5em;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $color-grey-100;
    transition: background-color 0.2s $ease-out-circ;

    &--active {
      background-color: $color-grey-300;
    }

    &:hover {
      border-color: $color-primary;
    }
  }
}

.arrow {
  margin-left: 0.25em;
  border: solid $color-grey-500;
  border-width: 0 0.125em 0.125em 0;
  display: inline-block;
  padding: 0.175em;
  transform: rotate(45deg);
  transition: transform 0.2s ease;
}
</style>
