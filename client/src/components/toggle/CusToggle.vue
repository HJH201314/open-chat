<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type ToggleProps = {
  modelValue?: boolean; // 双向绑定
  label?: string;
  disabled?: boolean;
  highlight?: boolean; // 选中时是否高亮文字
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
};

const props = withDefaults(defineProps<ToggleProps>(), {});

const emit = defineEmits<{
  (event: 'update:modelValue', active: boolean): void;
}>();

const active = ref(props.modelValue);
const labelClasses = computed(() => {
  const classes = [];
  if (props.highlight && active.value) {
    classes.push('toggle-label--highlight');
  }
  return classes;
});

watch(
  () => props.modelValue,
  (newVal) => {
    active.value = newVal;
  }
);

function toggle() {
  active.value = !active.value;
  emit('update:modelValue', active.value);
}
</script>

<template>
  <div class="toggle">
    <input v-show="false" type="checkbox" :value="active" />
    <slot name="before"></slot>
    <div class="toggle-container" :class="{ active: active }" @click="toggle">
      <div class="toggle-front" :class="{ active: active }" />
    </div>
    <label v-if="label" class="toggle-label" :class="labelClasses" @click="toggle">{{ label }}</label>
    <slot name="after"></slot>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.toggle {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5em;
  align-items: center;

  &-container {
    cursor: pointer;
    width: 2.5em;
    height: 1.5em;
    border-radius: 0.5em;
    background-color: $color-grey-400;
    position: relative;
    transition: background-color 0.2s $ease-out-circ;

    &.active {
      background-color: $color-primary;
    }
  }

  &-front {
    position: absolute;
    width: 1em;
    left: 0.25em;
    top: 0.25em;
    bottom: 0.25em;
    border-radius: 0.25em;
    background-color: $color-grey-200;
    transition:
      background-color 0.2s $ease-out-circ,
      transform 0.2s $ease-out-circ;

    &.active {
      transform: translateX(100%);
      background-color: $color-primary-lighter;
    }
  }

  &-label {
    &--highlight {
      transition: color 0.2s $ease-out-circ;
      color: $color-primary;
    }
  }
}
</style>