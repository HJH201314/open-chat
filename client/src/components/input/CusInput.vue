<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import type { CusInputProps } from '@/components/input/CusInput';

const props = withDefaults(defineProps<CusInputProps>(), {
  validate: () => [],
  inputAttrs: () => {
    return {
      autocomplete: 'off',
    };
  },
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'change', value: string): void;
}>();

const inputRef = useTemplateRef<HTMLInputElement>('input');
const vm = ref(props.modelValue || props.value);

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    if (newValue != undefined && newValue !== oldValue) {
      vm.value = newValue;
    }
  }
);

function handleInput(e: any) {
  emit('update:modelValue', e.target.value as string);
  emit('change', e.target.value as string);
  if (validationFailed.value) {
    handleValidate();
  }
}

const validationFailed = ref(false);
function handleValidate() {
  for (const v of props.validate) {
    const inputVal = vm.value;
    if (inputVal && typeof inputVal == 'string') {
      if (v.regex) {
        if (!v.regex.test(inputVal)) {
          v.error = true;
          v.errorMsg = v.errorMsg || '输入错误';
        } else {
          v.error = false;
        }
      } else if (v.length) {
        if (inputVal.length != v.length) {
          v.error = true;
          v.errorMsg = v.errorMsg || '长度错误';
        } else {
          v.error = false;
        }
      } else if (v.minLength) {
        if (inputVal.length < v.minLength) {
          v.error = true;
          v.errorMsg = v.errorMsg || '长度太短';
        } else {
          v.error = false;
        }
      } else if (v.maxLength) {
        if (inputVal.length > v.maxLength) {
          v.error = true;
          v.errorMsg = v.errorMsg || '长度太长';
        } else {
          v.error = false;
        }
      }
    }
  }
  validationFailed.value = props.validate.some((v) => v.error);
}

defineExpose({
  element: () => inputRef.value,
  focus() {
    inputRef.value?.focus();
  },
  blur() {
    inputRef.value?.blur();
  },
});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div class="cus-input-wrapper">
    <input
      ref="input"
      class="cus-input"
      :class="{ danger: validationFailed }"
      :value="vm"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      v-bind="{ ...$attrs, ...props.inputAttrs }"
      @input="handleInput"
      @blur="handleValidate"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.cus-input-wrapper {
  position: relative;
  width: 100%;
}

.cus-input {
  outline: none;
  resize: none;
  border: 2px solid transparent;
  width: 100%;
  //height: 2rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  padding: 0.125em 0.5em;
  transition:
    background-color 0.2s $ease-out-circ,
    border 0.2s $ease-out-circ;
  background-color: var(--color-trans-100);

  &:hover:not(:disabled) {
    border: 2px solid var(--color-primary-lighter);
  }

  &:focus {
    // TODO: color-mix compatibility
    background-color: color-mix(in srgb, var(--color-white), var(--color-primary) 5%) !important;
    border: 2px solid var(--color-primary) !important;
  }

  &.danger {
    background-color: color-mix(in srgb, var(--color-white), $color-danger 5%) !important;
    border: 2px solid var(--color-danger) !important;
  }

  &:disabled {
    color: var(--color-trans-400);
  }
}
</style>