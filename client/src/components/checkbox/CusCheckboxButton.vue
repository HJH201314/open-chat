<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { CheckboxCheckedClassName, type CusCheckboxButtonProps, CheckboxGroupInjectionKey } from './types';

const props = withDefaults(defineProps<CusCheckboxButtonProps>(), {
  disabled: false
});

const innerChecked = ref(false);

const groupInject = inject(CheckboxGroupInjectionKey);

const checkboxName = computed(() => groupInject?.name || props.name);
const checkboxValue = computed(() => props.value);
const checkboxChecked = computed(() => (groupInject ? groupInject.isSelected(checkboxValue.value) : innerChecked.value));

const typeClassName = computed(() => `type-${groupInject?.type || 'highlight'}`);

function handleClick() {
  if (props.disabled) return;
  groupInject?.toggleValue(checkboxValue.value);
}
</script>

<template>
  <div
    class="cus-checkbox-button"
    :class="{
      checked: checkboxChecked,
      [CheckboxCheckedClassName]: checkboxChecked,
      [typeClassName]: !!typeClassName,
      disabled: props.disabled
    }"
    @click="handleClick"
  >
    <input :value="checkboxValue" :name="checkboxName" type="checkbox" :checked="checkboxChecked" :disabled="props.disabled" />
    <div class="checkbox-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    </div>
    <span class="label">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.cus-checkbox-button {
  position: relative;
  cursor: pointer;
  z-index: 1;
  padding: 8px 12px;
  border-radius: 8px;
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.1s $ease-out-circ;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .checkbox-icon {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s $ease-out-circ;
    background-color: white;
    
    svg {
      width: 14px;
      height: 14px;
      fill: transparent;
      transition: fill 0.2s $ease-out-circ;
    }
  }

  &.type-normal {
    &.checked {
      .checkbox-icon {
        border-color: var(--color-primary);
        background-color: transparent;
        
        svg {
          fill: var(--color-primary);
        }
      }
    }
  }

  &.type-highlight {
    &.checked {
      .checkbox-icon {
        border-color: var(--color-primary);
        background-color: var(--color-primary);
        
        svg {
          fill: white;
        }
      }
    }
  }

  &:not(:last-child) {
    &:before {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -0.5px;
      transform: translateX(-50%);
      height: 1px;
      width: 30%;
      max-width: 1em;
      background-color: rgba(0, 0, 0, 0.05);
      transition: opacity 0.2s $ease-out-circ;
    }
  }

  > input[type='checkbox'] {
    display: none;
  }
}
</style> 