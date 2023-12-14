<script setup lang="ts">
import type { DiliButtonEmits, DiliButtonProps } from "@/components/button/DiliButton";
import variables from "@/assets/variables.module.scss";
import type { CSSProperties } from "vue";
import { computed, ref } from "vue";
import { getDarkerColor } from "@/utils/color";

const props = withDefaults(defineProps<DiliButtonProps>(), {
  text: "",
  type: "normal",
  shadow: true,
});

const emit = defineEmits<DiliButtonEmits>();

const buttonRef = ref<HTMLButtonElement>();

const buttonStyle = computed(() => {
  return {
    'box-shadow': props.shadow ? variables.boxShadow : 'none',
    ...props.buttonStyle
  } as CSSProperties;
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
  if (props.type == 'primary') {
    return '#FFFFFF';
  } else {
    return props.fontColor || variables.colorBlack;
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
      {{ props.text }}
    </button>
    <div class="mask">

    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.dili-button {
  position: relative;
  > .mask {
    position: absolute;

  }
  > button {
    outline: none;
    border-radius: .5rem;
    padding: .25rem 1rem;
    transition: background-color .2s $ease-out-circ, color .2s $ease-out-circ;
    background-color: v-bind(backgroundColor);
    color: v-bind(fontColor);
    overflow: hidden;
    white-space: pre;

    &.disabled {
      background-color: $color-grey-200;
      color: $color-grey-500;
      cursor: not-allowed;
    }

    &:not(&.disabled):hover {
      background-color: v-bind(hoverBackgroundColor);
      color: v-bind(hoverFontColor);
    }

    &:not(&.disabled):active {
      background-color: v-bind(activeBackgroundColor);
      color: v-bind(activeFontColor);
    }
  }

}
</style>