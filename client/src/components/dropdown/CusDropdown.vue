<script setup lang="ts">
import { useMouseInElement, useMousePressed } from '@vueuse/core';
import { ref, computed, watch, useTemplateRef, watchEffect } from 'vue';

type DropdownProps = {
  modelValue?: string; // 双向绑定
  options: { label: string; value: string }[]; // 下拉选项
  placeholder?: string; // 占位符
  position?: 'top' | 'bottom' | 'left' | 'right'; // 弹出方位
  disabled?: boolean; // 是否禁用
};

const props = withDefaults(defineProps<DropdownProps>(), {
  placeholder: '请选择',
  position: 'bottom',
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
  <div ref="dropdown" class="dropdown" :class="{ active: isOpen, disabled: disabled }">
    <div class="dropdown-toggle" :class="{ 'dropdown-toggle--active': isOpen }" @click="toggleDropdown">
      {{ selectedLabel }}
      <span class="arrow"></span>
    </div>
    <ul ref="menu" v-if="isOpen" class="dropdown-menu" :class="[`dropdown-menu--${position}`]">
      <li
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option.value)"
        :class="{ selected: option.value === selectedValue }"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/variables.module';

.dropdown {
  position: relative;
  display: inline-block;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &-toggle {
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
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
    border-radius: 0.5rem;
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
      padding: 0.25rem 0.5rem;
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
    margin-left: 0.25rem;
    border: solid $color-grey-500;
    border-width: 0 0.125rem 0.125rem 0;
    display: inline-block;
    padding: 0.175rem;
    transform: rotate(45deg);
    transition: transform 0.2s ease;
  }
}
</style>
