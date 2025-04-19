<template>
  <div ref="dropdown" :class="{ active: isOpen, disabled: disabled }" class="dropdown">
    <div
      ref="dropdown-toggle"
      :class="{ 'dropdown-toggle--active': isOpen, [backgroundModeClassName]: true }"
      :style="toggleStyle"
      class="dropdown-toggle"
      @click="toggleDropdown"
    >
      <Component :is="currentIconComponent" v-if="currentIconComponent" />
      {{ labelRenderText?.(selectedOption, selectedOptionPath) || selectedLabel }}
      <span class="arrow"></span>
    </div>
    <CommonModal
      v-model:visible="isOpen"
      :show-close="false"
      close-on-click-mask
      :mask-style="{ backgroundColor: 'transparent' }"
    >
      <dropdown-menu
        ref="root-menu"
        v-model:current-showing-path="currentShowingPath"
        :_depth="1"
        :_value-path="[]"
        :is-open="isOpen"
        :options="options"
        :parent-bounding="toggleBounding"
        :position="position"
      ></dropdown-menu>
    </CommonModal>
  </div>
</template>

<script lang="ts" setup>
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import {
  type CusSelectEmits,
  type CusSelectProps,
  DropdownCurrentInfoInjectionKey,
  type DropdownOption,
} from '@/components/dropdown/types';
import { useElementBounding } from '@vueuse/core';
import { computed, h, provide, ref, useTemplateRef, watch } from 'vue';
import { treeEach } from '@liuli-util/tree';
import CommonModal from '@/components/modal/CommonModal.vue';

// 双向绑定 modelValue: 当前选中项的 value
const selectedValue = defineModel<string>('modelValue');
const props = withDefaults(defineProps<CusSelectProps>(), {
  backgroundMode: 'transparent',
  placeholder: '请选择',
  position: 'bottom',
  _depth: 0,
  toggleStyle: () => ({}),
});

const backgroundModeClassName = computed(() => `bg-mode-${props.backgroundMode}`);

const emit = defineEmits<CusSelectEmits>();

const selfRef = useTemplateRef('dropdown');
const toggleRef = useTemplateRef('dropdown-toggle');
const toggleBounding = useElementBounding(toggleRef);

watch(
  () => selectedValue.value,
  (newVal) => {
    // v-model 更新时手动更新选中项
    receiveModelValue(newVal);
  }
);
watch(
  () => props.options,
  () => {
    // 选项更新时重新更新选中项
    receiveModelValue(selectedValue.value);
  }
);

const receiveModelValue = (newVal?: string) => {
  selectedOption.value = findCurrentValueOption(props.options, newVal);
};

const isOpen = ref(false);

const findCurrentValueOption = (options: DropdownOption[], target: string | undefined): DropdownOption | undefined => {
  if (!target) return undefined;
  try {
    treeEach(
      options,
      (opt) => {
        if (opt.value === target) {
          // 这里使用 throw 来中断 treeEach 直接返回
          throw opt;
        }
      },
      {
        id: 'value',
        children: 'children',
      }
    );
  } catch (opt) {
    return opt as DropdownOption;
  }
  return undefined;
};
// 当前选中项
const selectedOption = ref(findCurrentValueOption(props.options, selectedValue.value));
// 当前选中项的 label
const selectedLabel = computed(() => {
  return selectedOption.value ? selectedOption.value.label : props.placeholder;
});
const currentIconComponent = computed(() => {
  if (!selectedOption.value) return null;
  if (typeof selectedOption.value.icon == 'string') {
    return h('img', { style: 'width: 1em; height: 1em;', src: selectedOption.value.icon });
  } else {
    return selectedOption.value.icon
      ? h(selectedOption.value.icon, { style: 'width: 1em; height: 1em; scale: 1.25;' })
      : null;
  }
});
// 计算目标路径
const getTargetPath = (
  options: DropdownOption[],
  target: DropdownOption,
  path: DropdownOption[] = []
): DropdownOption[] | null => {
  for (const option of options) {
    // 包含当前 level 的 value
    const currentPath = [...path, option];
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

function onSelectOption(option: DropdownOption, valuePath: string[]) {
  console.debug('selected', option, valuePath);
  selectedValue.value = option.value;
  selectedOption.value = option;
  emit('select', option.value, option, valuePath);
  isOpen.value = false;
  currentShowingPath.value = [];
}

// 提供当前选中项的信息
provide(DropdownCurrentInfoInjectionKey, {
  currentOptionPath: selectedOptionPath,
  currentValue: selectedValue,
  onSelect: onSelectOption,
});

// 当前展开的路径（子菜单是否展示依赖此变量）
const currentShowingPath = ref<string[]>([]);

watch(
  () => isOpen.value,
  (newVal) => {
    // 当关闭时重置当前展开路径
    if (!newVal) {
      currentShowingPath.value = [];
    }
  }
);

// 切换 Dropdown 展示状态
function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
    currentShowingPath.value = [];
  }
}
</script>

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
    align-items: center;
    justify-content: space-between;
    gap: 0.25em;
    background-color: var(--color-grey-100);
    transition: background-color 0.2s $ease-out-circ;

    &.bg-mode {
      &-color {
        background-color: var(--color-grey-100);
      }

      &-transparent {
        background-color: var(--color-trans-100);
      }
    }

    &--active {
      &.bg-mode {
        &-color {
          background-color: var(--color-grey-300);
        }

        &-transparent {
          background-color: var(--color-trans-300);
        }
      }
    }

    &:hover {
      border-color: var(--color-primary);
    }
  }
}

.arrow {
  margin-left: 0.25em;
  border: solid var(--color-grey-500);
  border-width: 0 0.125em 0.125em 0;
  display: inline-block;
  padding: 0.175em;
  transform: rotate(45deg);
  transition: transform 0.2s ease;
}
</style>
