<script setup lang="ts">

import { ref, watch } from "vue";

type ToggleProps = {
  modelValue?: boolean;
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<ToggleProps>(), {
});

const emit = defineEmits<{
  (event: 'update:modelValue', active: boolean): void;
}>();

const active = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  active.value = newVal;
});

function toggle() {
  active.value = !active.value;
  emit('update:modelValue', active.value);
}

</script>

<template>
  <div class="toggle">
    <input v-show="false" type="checkbox" :value="active" />
    <slot name="before"></slot>
    <div class="toggle-container" :class="{'active': active}" @click="toggle">
      <div class="toggle-front" :class="{'active': active}" />
    </div>
    <label class="toggle-label" v-if="label">{{ label }}</label>
    <slot name="after"></slot>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.toggle {
  display: flex;
  flex-wrap: nowrap;
  gap: .5rem;
  align-items: center;

  &-container {
    cursor: pointer;
    width: 40px;
    height: 24px;
    border-radius: 8px;
    background-color: $color-grey-400;
    position: relative;
    transition: background-color .2s $ease-out-circ;
    &.active {
      background-color: $color-primary;
    }
  }
  &-front {
    position: absolute;
    width: 16px;
    left: 4px;
    top: 4px;
    bottom: 4px;
    border-radius: 4px;
    background-color: $color-grey-200;
    transition: background-color .2s $ease-out-circ, transform .2s $ease-out-circ;
    &.active {
      transform: translateX(100%);
      background-color: $color-primary-lighter;
    }
  }
  &-label {}
}
</style>