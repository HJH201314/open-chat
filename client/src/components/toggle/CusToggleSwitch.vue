<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  isActive: boolean;
}>(), {
  isActive: false,
})

const toggleClasses = computed(() => {
  const classes = [];
  if (props.isActive) {
    classes.push('active');
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
    border-radius: 0.5em;
    cursor: pointer;
    width: 2.5em;
    height: 1.5em;
    background-color: $color-grey-400;
    position: relative;
    transition: background-color 0.2s $ease-out-circ;
    display: flex;
    align-items: center;

    &.active {
      background-color: $color-primary;
    }
  }

  &-front {
    margin-inline: 0.25em;
    width: 1em;
    height: 1em;
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
}
</style>