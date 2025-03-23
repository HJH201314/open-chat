<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue';
import { CheckedClassName, type CusRadioButtonProps, RadioGroupInjectionKey } from '@/components/radio/types.ts';

const props = withDefaults(defineProps<CusRadioButtonProps>(), {});

const innerChecked = ref(false);

const groupInject = inject(RadioGroupInjectionKey);

const radioName = computed(() => groupInject?.name || props.name);
const radioValue = computed(() => props.value);
const radioChecked = computed(() => (groupInject ? groupInject?.value === radioValue.value : innerChecked.value));

const radioButtonRef = ref<HTMLElement | undefined>(undefined);
const typeClassName = computed(() => `type-${groupInject?.type || 'highlight'}`);
const directionClassName = computed(() => `direction-${groupInject?.direction || 'row'}`);

function handleClick() {
  console.log('setSelectedValue by click', radioValue.value || '');
  groupInject?.setValue(radioValue.value || '');
}

watchEffect(() => {
  if (radioChecked.value) {
    groupInject?.setElement(radioButtonRef.value);
  }
});
</script>

<template>
  <label
    ref="radioButtonRef"
    class="cus-ratio-button"
    :class="{ checked: radioChecked, [CheckedClassName]: radioChecked, [typeClassName]: !!typeClassName, [directionClassName]: !!directionClassName }"
    @click="handleClick"
  >
    <input :value="radioValue" :name="radioName" type="radio" />
    <span>{{ label }}</span>
  </label>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.cus-ratio-button {
  position: relative;
  cursor: pointer;
  z-index: 1;
  padding: 8px 12px;
  border-radius: 8px;
  line-height: 1;
  transition: color 0.1s $ease-out-circ;

  &.type-normal {
    &.checked {
      color: black;
    }
  }

  &.type-highlight {
    &.checked {
      color: white;
    }
  }

  &:not(:last-child) {
    &:before {
      content: '';
      position: absolute;
      background-color: rgba(0, 0, 0, 0.05);
      transition: opacity 0.2s $ease-out-circ;
    }

    &.direction-row:before {
      top: 50%;
      right: -0.5px;
      transform: translateY(-50%);
      width: 1px;
      height: 30%;
      max-height: 1em;
    }

    &.direction-column:before {
      left: 50%;
      bottom: -0.5px;
      transform: translateX(-50%);
      height: 1px;
      width: 30%;
      max-width: 1em;
    }
  }

  > input[type='radio'] {
    display: none;
  }
}
</style>
