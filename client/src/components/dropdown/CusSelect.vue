<script lang="ts" setup>
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import type { CusSelectProps, DropdownMenuEmits, DropdownOption } from '@/components/dropdown/types';
import { onClickOutside, useElementBounding } from '@vueuse/core';
import { computed, ref, useTemplateRef, watch } from 'vue';

const props = withDefaults(defineProps<CusSelectProps>(), {
  placeholder: '请选择',
  position: 'bottom',
  _depth: 0,
  toggleStyle: () => ({}),
});

const emit = defineEmits<
  {
    (event: 'update:modelValue', value: string): void;
  } & DropdownMenuEmits
>();

const selfRef = useTemplateRef('dropdown');
const toggleRef = useTemplateRef('dropdown-toggle');
const toggleBounding = useElementBounding(toggleRef);

watch(
  () => props.modelValue,
  (newVal) => {
    // v-model 更新时手动更新选中项
    receiveModelValue(newVal);
  },
);
watch(
  () => props.options,
  () => {
    // 选项更新时重新更新选中项
    receiveModelValue(props.modelValue);
  },
);

const receiveModelValue = (newVal?: string) => {
  selectedValue.value = newVal;
  selectedOption.value = findCurrentValueOption(props.options, newVal);
};

const isOpen = ref(false);

const findCurrentValueOption = (options: DropdownOption[], target: string | undefined): DropdownOption | undefined => {
  if (!target) return undefined;
  return options
    .flatMap((opt) => {
      return [opt, ...(opt.children ?? [])];
    })
    .find((opt) => opt.value === target);
};
// 当前选中值
const selectedValue = ref(props.modelValue);
// 当前选中项
const selectedOption = ref(findCurrentValueOption(props.options, props.modelValue));
// 当前选中项的 label
const selectedLabel = computed(() => {
  return selectedOption.value ? selectedOption.value.label : props.placeholder;
});
// 计算目标路径
const getTargetPath = (
  options: DropdownOption[],
  target: DropdownOption,
  path: DropdownOption[] = [],
): DropdownOption[] | null => {
  for (const option of options) {
    // 包含当前 level 的 value
    const currentPath = path.concat(option);
    // 如果找到了目标，返回当前路径
    if (option.value === target.value) {
      return currentPath;
    }
    // 如果存在 children，递归查找
    if (option.children) {
      const result = getTargetPath(option.children, target, currentPath);
      if (result) {
        return result;
      }
    }
  }
  // 未找到返回 null
  return null;
};
// 当前选中项的路径
const selectedOptionPath = computed(() => {
  if (selectedOption.value) {
    return getTargetPath(props.options, selectedOption.value) || [];
  } else {
    return [];
  }
});

// 当前展开的路径
const currentShowingPath = ref<string[]>([]);

// 切换 Dropdown 展示状态
function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
    currentShowingPath.value = [];
  }
}

// 点击 Dropdown 外部则关闭
onClickOutside(
  useTemplateRef<HTMLElement>('root-menu'),
  () => {
    // console.log('root-menu-click-outside', event.target);
    isOpen.value = false;
    currentShowingPath.value = [];
  },
  {
    ignore: [selfRef, toggleRef],
  },
);

function selectOption(value: string, option: DropdownOption, valuePath: string[]) {
  console.log('selected', value, option, valuePath);
  selectedValue.value = value;
  selectedOption.value = option;
  emit('update:modelValue', value);
  emit('select', value, option, valuePath);
  isOpen.value = false;
  currentShowingPath.value = [];
}
</script>

<template>
  <div ref="dropdown" :class="{ active: isOpen, disabled: disabled }" class="dropdown">
    <div
      ref="dropdown-toggle"
      :class="{ 'dropdown-toggle--active': isOpen }"
      :style="toggleStyle"
      class="dropdown-toggle"
      @click="toggleDropdown"
    >
      {{ labelRenderText?.(selectedOption, selectedOptionPath) || selectedLabel }}
      <span class="arrow"></span>
    </div>
    <Teleport to="body">
      <dropdown-menu
        ref="root-menu"
        v-model:current-showing-path="currentShowingPath"
        :_current-option-path="selectedOptionPath"
        :_depth="1"
        :_value-path="[]"
        :is-open="isOpen"
        :options="options"
        :parent-bounding="toggleBounding"
        :position="position"
        :selected-value="selectedValue"
        @select="selectOption"
      ></dropdown-menu>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;

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
