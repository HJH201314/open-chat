<script setup lang="ts">

import { ref, watch } from "vue";
import type { CusInputProps } from "@/components/input/CusInput";

const props = withDefaults(defineProps<CusInputProps>(), {
  inputAttrs: () => {
    return {
      autocomplete: 'off',
    }
  },
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'change', value: string): void;
}>();

const v = ref(props.modelValue || props.value);

watch(() => props.modelValue, (newValue, oldValue) => {
  if (newValue != undefined && newValue !== oldValue) {
    v.value = newValue;
  }
});

function handleInput(e: any) {
  emit('update:modelValue', e.target.value as string);
  emit('change', e.target.value as string);
}
</script>

<template>
  <input class="cus-input" :value="v" :placeholder="props.placeholder" :disabled="props.disabled" v-bind="props.inputAttrs" @input="handleInput" />
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;
.cus-input {
  outline: none;
  resize: none;
  border: 2px solid $color-grey-100;
  width: 100%;
  height: 2rem;
  box-sizing: border-box;
  border-radius: .5rem;
  padding: .25rem .5rem;
  transition: background-color .2s $ease-out-circ, border .2s $ease-out-circ;
  background-color: $color-grey-100;

  &:hover:not(:disabled) {
    border: 2px solid var(--color-primary-lighter);
  }

  &:focus {
    background-color: $color-white;
    border: 2px solid var(--color-primary);
  }

  &:disabled {
    color: $color-grey-400;
  }
}
</style>