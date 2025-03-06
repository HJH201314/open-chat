<script setup lang="ts">
import { ref, type TextareaHTMLAttributes } from 'vue';
import { useTextareaAutosize } from '@vueuse/core';

const props = withDefaults(
  defineProps<{
    textareaAttr: TextareaHTMLAttributes;
  }>(),
  {}
);

const modelValue = defineModel<string>('modelValue', { default: '' });

// 自适应高度
const textareaRef = ref<HTMLTextAreaElement>();
useTextareaAutosize({
  element: textareaRef,
  input: modelValue,
});
</script>

<template>
  <div class="cus-textarea">
    <textarea ref="textareaRef" v-model="modelValue" v-bind="textareaAttr"></textarea>
  </div>
</template>

<style scoped lang="scss">
.cus-textarea {
  // 宽高布局由父级决定
  position: relative;
  overflow-y: auto;
  //scrollbar-gutter: stable;

  > textarea {
    padding: 0;
    background-color: transparent;
    width: 100%;
    min-height: 90%;
    box-sizing: border-box;
    outline: none;
    font-size: 16px;
    resize: none;

    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>