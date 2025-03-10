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

function handleClick() {
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
    :class="{ checked: radioChecked, [CheckedClassName]: radioChecked, [typeClassName]: !!typeClassName }"
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
  padding: 0.5em 0.75em;
  border-radius: 0.5rem;
  line-height: 1;
  transition: color 0.2s $ease-out-circ;

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

  &:not(:last-child):before {
    content: '';
    position: absolute;
    top: 35%;
    right: -0.5px;
    width: 1px;
    height: 30%;
    background-color: rgba(0, 0, 0, 0.05);
    transition: opacity 0.2s $ease-out-circ;
  }

  &.checked {
    &:not(:last-child):before {
      opacity: 0;
    }
  }

  > input[type='radio'] {
    display: none;
  }
}
</style>
