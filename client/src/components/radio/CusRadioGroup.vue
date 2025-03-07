<script setup lang="ts">
import { type CusRadioGroupProps, RadioGroupInjectionKey } from '@/components/radio/types.ts';
import { getRandomString } from '@/utils/string.ts';
import { type CSSProperties, provide, reactive, ref, toRefs, unref, watchEffect } from 'vue';

const props = withDefaults(defineProps<CusRadioGroupProps>(), {
  modelValue: '',
  name: getRandomString(5),
});
const emits = defineEmits<{
  (event: 'change', value: string): void;
  (event: 'update:modelValue', value: string): void;
}>();
defineSlots<{
  default(): any;
}>();

const selectedValue = ref(props.modelValue);
const selectedElement = ref<HTMLElement | undefined>(undefined);

function setSelectedValue(v?: string) {
  selectedValue.value = v || '';
}

function setSelectedElement(e?: HTMLElement) {
  selectedElement.value = e;
}

watchEffect(() => {
  emits('change', selectedValue.value);
  emits('update:modelValue', selectedValue.value);
});

const { name } = toRefs(props);
provide(
  RadioGroupInjectionKey,
  reactive({
    name,
    value: selectedValue,
    setValue: setSelectedValue,
    setElement: setSelectedElement,
  })
);

// 选中框样式
const barStyle = ref<CSSProperties>({
  left: '0',
  top: '0',
  width: '0',
  height: '0',
});
watchEffect(() => {
  if (selectedElement.value) {
    const { offsetHeight, offsetTop, offsetWidth, offsetLeft } = selectedElement.value;

    barStyle.value = {
      left: `${offsetLeft}px`,
      top: `${offsetTop}px`,
      width: `${offsetWidth}px`,
      height: `${offsetHeight}px`,
    };
  } else {
    // 无选中元素时的样式，初始化位置和高度以便动画过渡正常
    barStyle.value = {
      visibility: 'hidden',
      left: '0',
      top: '0.25em',
      width: '1em',
      height: 'calc(100% - 0.5em)',
    };
    console.log(JSON.stringify(barStyle.value));
  }
});
</script>

<template>
  <fieldset class="cus-radio-group">
    <div class="cus-radio-group-bar" :style="barStyle"></div>
    <slot></slot>
  </fieldset>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.cus-radio-group {
  position: relative;
  width: fit-content;
  border-radius: 0.6em;
  background-color: $color-grey-200;
  display: flex;
  padding: 0.25em;

  &-bar {
    position: absolute;
    z-index: 0;
    background-color: $color-primary;
    border-radius: 0.5rem;
    transition:
      left 0.2s $ease-out-circ,
      top 0.2s $ease-out-circ,
      width 0.2s $ease-out-circ,
      height 0.2s $ease-out-circ;
  }
}
</style>