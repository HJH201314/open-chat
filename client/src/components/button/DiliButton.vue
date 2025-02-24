<script setup lang="ts">
import type { CusButtonEmits, CusButtonProps } from "@/components/button/DiliButton";
import variables from '@/assets/variables.module.scss';
import type { CSSProperties } from "vue";
import { computed, ref } from "vue";
import { getDarkerColor } from "@/utils/color";

const props = withDefaults(defineProps<CusButtonProps>(), {
  text: "",
  type: "normal",
  shadow: false,
});

const emit = defineEmits<CusButtonEmits>();

const buttonRef = ref<HTMLButtonElement>();

const buttonStyle = computed(() => {
  const calcStyle: CSSProperties = {
    'box-shadow': props.shadow ? variables.boxShadow : 'none',
    'padding': props.text ? '.25rem 1rem' : '.25rem',
    ...props.buttonStyle
  };
  return calcStyle;
});

const backgroundColor = computed(() => {
  if (props.type == 'primary') {
    return props.backgroundColor || variables.colorPrimary;
  } else {
    return '#FFFFFF';
  }
});
const hoverBackgroundColor = computed(() => {
  return getDarkerColor(backgroundColor.value, 0.1);
});
const activeBackgroundColor = computed(() => {
  return getDarkerColor(backgroundColor.value, 0.2);
});

const fontColor = computed(() => {
  if (props.fontColor) return props.fontColor;
  if (props.type == 'primary') {
    return '#FFFFFF';
  } else {
    return variables.colorBlack;
  }
});
const hoverFontColor = computed(() => {
  return getDarkerColor(fontColor.value, 0.1);
});
const activeFontColor = computed(() => {
  return getDarkerColor(fontColor.value, 0.2);
});

function handleClick() {
  if (props.disabled) return; // 如果禁用了，直接拦截click事件
  emit('click');
}

</script>

<template>
  <div class="dili-button" @click="handleClick">
    <button ref="buttonRef" :style="buttonStyle" :class="{'disabled': props.disabled}">
      <slot></slot>
      <span v-if="props.text" class="button-text">{{ props.text }}</span>
    </button>
    <div class="mask" :class="{'disabled': props.disabled}">

    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;
.dili-button {
  position: relative;
  > .mask {
    position: absolute;

  }
  > button {
    outline: none;
    border-radius: .5rem;
    transition: background-color .2s $ease-out-circ, color .2s $ease-out-circ;
    background-color: v-bind(backgroundColor);
    border: 1px solid v-bind(backgroundColor);
    color: v-bind(fontColor);
    overflow: hidden;
    white-space: pre;
    display: flex;
    gap: .5rem;
    align-items: center;
    justify-content: center;

    &.disabled {
      //background-color: $color-grey-200;
      //color: $color-grey-500;
      filter: grayscale(0.5) opacity(0.5);
      cursor: not-allowed;
    }

    &:not(&.disabled):hover {
      background-color: v-bind(hoverBackgroundColor);
      color: v-bind(hoverFontColor);
      border: 1px solid v-bind(hoverBackgroundColor);
    }

    &:not(&.disabled):active {
      background-color: v-bind(activeBackgroundColor);
      color: v-bind(activeFontColor);
      border: 1px solid v-bind(activeBackgroundColor);
    }
  }

}
</style>