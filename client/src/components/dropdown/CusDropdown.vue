<script lang="ts" setup>
import type { DropdownOption } from '@/components/dropdown/CusDropdown';
import DropdownMenuItem from '@/components/dropdown/DropdownMenuItem.vue';
import { useMouseInElement, useMousePressed } from '@vueuse/core';
import { computed, type CSSProperties, ref, useTemplateRef, watch, watchEffect } from 'vue';

type DropdownProps = {
  modelValue?: string; // 双向绑定
  options: DropdownOption[]; // 下拉选项，支持嵌套
  placeholder?: string; // 占位符
  position?: 'top' | 'bottom' | 'left' | 'right'; // 弹出方位
  disabled?: boolean; // 是否禁用

  toggleStyle?: CSSProperties;
};

const props = withDefaults(defineProps<DropdownProps>(), {
  placeholder: '请选择',
  position: 'bottom',
  toggleStyle: () => ({}),
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const selfRef = useTemplateRef('dropdown');
const menuRef = useTemplateRef('menu');

watch(
  () => props.modelValue,
  (newVal) => {
    selectedValue.value = newVal;
  }
);

const isOpen = ref(false);
const selectedValue = ref(props.modelValue);

const selectedLabel = computed(() => {
  const selectedOption = props.options.find((option) => option.value === selectedValue.value);
  return selectedOption ? selectedOption.label : props.placeholder;
});

function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
}

function selectOption(value: string) {
  selectedValue.value = value;
  emit('update:modelValue', value);
  isOpen.value = false;
}

// 点击 Dropdown 外部则关闭
const { isOutside: isOutsideSelf } = useMouseInElement(selfRef);
const { isOutside: isOutsideMenu } = useMouseInElement(menuRef);
const { pressed } = useMousePressed();
watchEffect(() => {
  if (pressed.value && isOutsideSelf.value && isOutsideMenu.value) {
    isOpen.value = false;
  }
});
</script>

<template>
  <div ref="dropdown" :class="{ active: isOpen, disabled: disabled }" class="dropdown">
    <div
      :class="{ 'dropdown-toggle--active': isOpen }"
      :style="toggleStyle"
      class="dropdown-toggle"
      @click="toggleDropdown"
    >
      {{ selectedLabel }}
      <span class="arrow"></span>
    </div>
    <ul v-if="isOpen" ref="menu" :class="[`dropdown-menu--${position}`]" class="dropdown-menu">
      <dropdown-menu-item
        v-for="option in options"
        :key="option.value"
        :option="option"
        :selected-value="selectedValue"
        @select="selectOption"
      ></dropdown-menu-item>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.module';

.dropdown {
  position: relative;
  display: inline-block;

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

  &-menu {
    position: absolute;
    border-radius: 0.5em;
    background-color: white;
    list-style: none;
    padding: 0;
    box-shadow: $box-shadow;
    overflow: hidden;
    z-index: 1000;

    &--top {
      bottom: 100%;
      left: 0;
    }

    &--bottom {
      top: 100%;
      left: 0;
    }

    &--left {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
    }

    &--right {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
    }

    li {
      padding: 0.25em 0.5em;
      cursor: pointer;
      transition: background-color 0.2s $ease-out-circ;
      background-color: white;

      &:hover {
        background-color: $color-grey-200;
      }

      &.selected {
        color: $color-primary;
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
}
</style>
