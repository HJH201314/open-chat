<script setup lang="ts">
import { computed, type CSSProperties, ref, watch } from 'vue';
import CusToggleSwitch from '@/components/toggle/CusToggleSwitch.vue';

type ToggleProps = {
  modelValue?: boolean; // 双向绑定
  toggleType?: 'switch' | 'checkbox'; // 组件展示形式
  disabled?: boolean;
  highlight?: boolean; // 选中时是否高亮文字
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  labelStyles?: CSSProperties;
};

const props = withDefaults(defineProps<ToggleProps>(), {
  toggleType: 'switch',
  label: '',
  labelPosition: 'right',
  labelStyles: () => ({}),
});

const emit = defineEmits<{
  (event: 'update:modelValue', active: boolean): void;
  (event: 'change', active: boolean): void;
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
  },
);

function toggle() {
  active.value = !active.value;
  emit('update:modelValue', active.value);
  emit('change', active.value);
}
</script>

<template>
  <div class="toggle">
    <input v-show="false" type="checkbox" :value="active"/>
    <slot name="before"></slot>
    <CusToggleSwitch v-if="toggleType == 'switch'" :is-active="active" @click="toggle"/>
    <label v-if="label" class="toggle-label" :class="labelClasses" :style="labelStyles" @click="toggle">{{ label }}</label>
    <slot name="after"></slot>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.toggle {
  height: 1.5em;
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5em;
  align-items: center;

  &-label {
    line-height: 1.5em;
    &--highlight {
      transition: color 0.2s $ease-out-circ;
      color: var(--color-primary);
    }
  }
}
</style>