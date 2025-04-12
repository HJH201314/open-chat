<script setup lang="ts">
import type { CusButtonEmits, CusButtonProps } from '@/components/button/DiliButton';
import { computed, type CSSProperties, ref } from 'vue';
import { getAutoDeltaColor, getColorHex } from '@/utils/color';
import { useTheme } from '@/components/theme/useTheme.ts';
import tinycolor from 'tinycolor2';

const props = withDefaults(defineProps<CusButtonProps>(), {
  text: '',
  type: 'normal',
  shadow: false,
});

const emit = defineEmits<CusButtonEmits>();

const { theme } = useTheme();

const buttonRef = ref<HTMLButtonElement>();

const buttonStyle = computed(() => {
  const calcStyle: CSSProperties = {
    padding: props.text ? '0.375em 1em' : '.375em',
    boxShadow: typeof props.shadow != 'boolean' ? props.shadow : undefined,
    ...props.buttonStyle,
  };
  return calcStyle;
});

const backgroundColor = computed(() => {
  if (props.backgroundColor) return getColorHex(props.backgroundColor);
  if (props.type == 'primary') {
    return getColorHex(props.color) || theme.colorPrimary;
  } else if (props.type == 'secondary') {
    return tinycolor.mix(getColorHex(props.color) || theme.colorPrimary, theme.colorWhite, 80).toHexString();
  } else {
    return theme.colorWhite;
  }
});
const hoverBackgroundColor = computed(() => {
  return getAutoDeltaColor(backgroundColor.value, 0.05);
});
const activeBackgroundColor = computed(() => {
  return getAutoDeltaColor(backgroundColor.value, 0.1);
});

const fontColor = computed(() => {
  if (props.fontColor) return getColorHex(props.fontColor);
  switch (props.type) {
    case 'primary':
      return '#FFFFFF';
    case 'secondary':
    case 'tertiary':
      return getColorHex(props.color) || theme.colorPrimary;
    case 'text':
      return getColorHex(props.color) || theme.colorPrimary;
    default:
      return theme.colorBlack;
  }
});
const hoverFontColor = computed(() => {
  return getAutoDeltaColor(fontColor.value, 0.05);
});
const activeFontColor = computed(() => {
  return getAutoDeltaColor(fontColor.value, 0.1);
});

function handleClick() {
  if (props.disabled) return; // 如果禁用了，直接拦截click事件
  emit('click');
}
</script>

<template>
  <div class="dili-button" @click="handleClick">
    <button ref="buttonRef" :style="buttonStyle" :class="{ disabled: props.disabled, shadowed: props.shadow === true }">
      <slot></slot>
      <span v-if="props.text" class="button-text">{{ props.text }}</span>
    </button>
    <div class="mask" :class="{ disabled: props.disabled }"></div>
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
    border-radius: 0.5rem;
    transition: all 0.2s $ease-out-circ;
    background-color: v-bind(backgroundColor);
    border: 1px solid v-bind(backgroundColor);
    color: v-bind(fontColor);
    overflow: hidden;
    white-space: pre;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;

    &.disabled {
      //background-color: $color-grey-200;
      //color: $color-grey-500;
      filter: grayscale(0.5) opacity(0.5);
      cursor: not-allowed;
    }

    &.shadowed {
      box-shadow: $box-shadow;
    }

    &:not(&.disabled):hover {
      background-color: v-bind(hoverBackgroundColor);
      color: v-bind(hoverFontColor);
      border: 1px solid v-bind(hoverBackgroundColor);
    }

    &:not(&.disabled):active {
      transform: scale(0.99);
      background-color: v-bind(activeBackgroundColor);
      color: v-bind(activeFontColor);
      border: 1px solid v-bind(activeBackgroundColor);
    }

    > .button-text {
      font-size: 1em;
      line-height: 1;
    }
  }
}
</style>
