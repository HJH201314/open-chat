<script setup lang="ts">
import { ref, type TextareaHTMLAttributes, watch } from 'vue';
import { useTextareaAutosize } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    autoHeight?: boolean;
    textareaAttr?: TextareaHTMLAttributes;
    preset?: boolean;
  }>(),
  {
    autoHeight: true,
    textareaAttr: () => ({}),
    preset: true,
  }
);

const emit = defineEmits<{
  (e: 'change', value: string): void;
}>();

const modelValue = defineModel<string>('modelValue', { default: '' });

watch(
  () => modelValue.value,
  (newVal) => {
    if (newVal != undefined) {
      emit('change', newVal);
    }
  }
);

// 自适应高度
const textareaRef = ref<HTMLTextAreaElement>();
const textareaWrapperRef = ref<HTMLDivElement>();

useTextareaAutosize({
  element: textareaRef,
  input: modelValue,
});

function handleWrapperClick() {
  textareaRef.value?.focus();
}

defineExpose({
  focus: () => {
    textareaRef.value?.focus();
  },
  blur: () => {
    textareaRef.value?.blur();
  },
});
</script>

<template>
  <div ref="textareaWrapperRef" class="cus-textarea" :class="{ preset: preset }" @click="handleWrapperClick">
    <textarea ref="textareaRef" v-model="modelValue" v-bind="textareaAttr"></textarea>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.cus-textarea {
  cursor: text;
  // 宽高布局由父级决定
  position: relative;
  box-sizing: content-box;
  overflow-y: auto;
  color: var(--color-black);
  //scrollbar-gutter: stable;

  > textarea {
    padding: 0;
    background-color: transparent;
    width: 100%;
    box-sizing: border-box;
    outline: none;
    resize: none;

    -ms-overflow-style: none;
    scrollbar-width: none;

    .preset & {
      // margin 撑起上下边距，不影响 auto-resize 工作
      margin: 0.25rem 0;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &.preset {
    padding-inline: 0.25rem;
    border: 2px solid var(--color-grey-100);
    border-radius: 0.5rem;
    transition:
      background-color 0.2s $ease-out-circ,
      border 0.2s $ease-out-circ;
    background-color: var(--color-grey-100);

    &:focus-within {
      background-color: var(--color-white);
      border: 2px solid var(--color-primary);
    }

    &:disabled {
      color: var(--color-grey-400);
    }
  }
}
</style>