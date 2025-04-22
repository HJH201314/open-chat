<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    isActive: boolean;
  }>(),
  {
    isActive: false,
  }
);

const toggleClasses = computed(() => {
  const classes = [];
  if (props.isActive) {
    classes.push('on');
  } else {
    classes.push('off');
  }
  return classes;
});
</script>

<template>
  <div class="toggle-container" :class="toggleClasses">
    <div class="toggle-front" :class="toggleClasses" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.toggle {
  &-container {
    position: relative;
    border-radius: 0.5em;
    cursor: pointer;
    width: 2.5em;
    height: 1.5em;
    background-color: var(--color-trans-100);
    transition: background-color 0.2s $ease-out-circ;
    display: flex;
    align-items: center;

    &.off {
      justify-content: flex-start;
    }
    &.on {
      justify-content: flex-end;
      background-color: var(--color-primary);
    }
  }

  &-front {
    margin-inline: 0.25em;
    height: 1em;
    width: 1em;
    border-radius: 0.25em;
    background-color: var(--color-white);
    transition: all 0.2s $ease-out-circ;

    &.off {
      .toggle-container:active & {
        width: 1.25em;
      }
    }

    &.on {
      background-color: var(--color-primary-lighter);

      .toggle-container:active & {
        width: 1.25em;
      }
    }
  }
}
</style>