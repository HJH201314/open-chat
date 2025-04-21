<script setup lang="ts">
import { type CusRadioGroupProps, RadioGroupInjectionKey } from '@/components/radio/types.ts';
import { getRandomString } from '@/utils/string.ts';
import { computed, type CSSProperties, onMounted, onUnmounted, provide, ref, toRefs, useTemplateRef, watch } from 'vue';
import { watchOnce } from '@vueuse/core';

const props = withDefaults(defineProps<CusRadioGroupProps>(), {
  name: getRandomString(5),
  type: 'highlight',
  backgroundMode: 'transparent',
  direction: 'row',
  barAnimation: true,
  displayStyle: 'background',
});

const modelValue = defineModel<any>({ default: '' });
watchOnce(
  () => props.defaultValue,
  (newDefaultValue) => {
    modelValue.value = newDefaultValue;
  },
  { immediate: true }
);

const emits = defineEmits<{
  (event: 'change', value: any): void;
}>();
defineSlots<{
  default(): any;
}>();

const selectedValue = ref(modelValue.value); // 选中值，可以为 undefined
const selectedElement = ref<HTMLElement | undefined>(undefined);

// 观测 modelValue
watch(
  () => modelValue.value,
  (newModelValue) => {
    if (newModelValue !== selectedValue.value) {
      console.debug('setSelectedValue by model value', newModelValue);
      setSelectedValue(modelValue.value);
      // 若值为空，则重置选中元素
      if (!modelValue.value) setSelectedElement(undefined);
    }
  }
);

function setSelectedValue(v?: any) {
  selectedValue.value = v;
}

function setSelectedElement(e?: HTMLElement) {
  selectedElement.value = e;
  if (!e) {
    // 取消选中，重置 bar 状态
    barCalculated.value = false;
  }
}

watch(
  () => selectedValue.value,
  (newSelectedValue) => {
    emits('change', selectedValue.value);
    modelValue.value = newSelectedValue;
  }
);

const { name, type, direction, displayStyle } = toRefs(props);
provide(RadioGroupInjectionKey, {
  name,
  type,
  direction,
  displayStyle,
  value: selectedValue,
  setValue: setSelectedValue,
  setElement: setSelectedElement,
});

const typeClassName = computed(() => `type-${props.type}`);
const displayStyleClassName = computed(() => `display-${props.displayStyle}`);
const backgroundModeClassName = computed(() => `bg-mode-${props.backgroundMode}`);

// 选中框样式
const barStyle = ref<CSSProperties>({
  left: '0',
  top: '0',
  width: '0',
  height: '0',
});
const barCalculated = ref(false);

function positionBar() {
  if (selectedElement.value) {
    const { offsetHeight, offsetTop, offsetWidth, offsetLeft } = selectedElement.value;

    barStyle.value = {
      left: `${offsetLeft + 2}px`,
      top: `${offsetTop + 2}px`,
      width: `${offsetWidth - 4}px`,
      height: `${offsetHeight - 4}px`,
    };

    // 使用 setTimeout 任务在首次 bar 渲染完成后再启用动画
    setTimeout(() => {
      barCalculated.value = true;
    }, 0);
  } else {
    // 无选中元素时的样式，初始化位置和高度以便动画过渡正常
    barStyle.value = {
      visibility: 'hidden',
      left: '0',
      top: '3px',
      width: '1em',
      height: 'calc(100% - 6px)',
    };
  }
}

watch(
  () => selectedElement.value,
  () => {
    requestUpdateBarPosition();
  }
);

const radioGroupRef = useTemplateRef('radio-group');
let resizeObserver: ResizeObserver | null = null;
let rafId: number | null = null;

function requestUpdateBarPosition() {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  rafId = requestAnimationFrame(() => {
    positionBar();
    rafId = null;
  });
}

onMounted(() => {
  if (radioGroupRef.value) {
    resizeObserver = new ResizeObserver(() => {
      requestUpdateBarPosition();
    });
    resizeObserver.observe(radioGroupRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
});
</script>

<template>
  <fieldset ref="radio-group" class="cus-radio-group" :class="[displayStyleClassName, backgroundModeClassName]">
    <div
      v-if="displayStyle !== 'icon'"
      class="cus-radio-group-bar"
      :class="{ 'cus-radio-group-bar--transition': barAnimation && barCalculated, [typeClassName]: !!typeClassName }"
      :style="barStyle"
    ></div>
    <slot></slot>
  </fieldset>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.cus-radio-group {
  position: relative;
  width: fit-content;
  border-radius: 0.6em;
  display: flex;
  flex-direction: v-bind('props.direction');
  flex-wrap: wrap;

  &.bg-mode {
    &-color {
      background-color: var(--color-grey-100);
    }

    &-transparent {
      background-color: var(--color-trans-100);
    }
  }

  &-bar {
    position: absolute;
    z-index: 0;
    border-radius: 0.5rem;
    box-shadow: $next-box-shadow-small;

    &--transition {
      transition:
        left 0.2s $ease-out-circ,
        top 0.2s $ease-out-circ,
        width 0.2s $ease-out-circ,
        height 0.2s $ease-out-circ;
    }

    &.type-normal {
      background-color: var(--color-white);
    }

    &.type-highlight {
      background-color: var(--color-primary);
    }
  }
}
</style>