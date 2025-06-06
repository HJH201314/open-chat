<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue';
import { CheckedClassName, type CusRadioButtonProps, RadioGroupInjectionKey } from '@/components/radio/types.ts';

const props = withDefaults(defineProps<CusRadioButtonProps>(), {});

const innerChecked = ref(false);

const groupInject = inject(RadioGroupInjectionKey);

const radioName = computed(() => groupInject?.name?.value || props.name);
const radioValue = computed(() => props.value);
const radioChecked = computed(() => {
  return groupInject ? groupInject?.value?.value === radioValue.value : innerChecked.value;
});

const radioButtonRef = ref<HTMLElement | undefined>(undefined);
const typeClassName = computed(() => `type-${groupInject?.type?.value || 'highlight'}`);
const directionClassName = computed(() => `direction-${groupInject?.direction?.value || 'row'}`);
const displayStyle = computed(() => groupInject?.displayStyle?.value || 'background');

function handleClick() {
  console.debug('setSelectedValue by click', radioValue.value || '');
  groupInject?.setValue(radioValue.value || '');
}

watchEffect(() => {
  if (radioChecked.value) {
    groupInject?.setElement(radioButtonRef.value);
  }
});

defineSlots<{
  default: (props: { selected: boolean }) => any;
}>();
</script>

<template>
  <div
    ref="radioButtonRef"
    class="cus-ratio-button"
    :class="{
      checked: radioChecked,
      [CheckedClassName]: radioChecked,
      [typeClassName]: !!typeClassName,
      [directionClassName]: !!directionClassName,
      [`display-${displayStyle}`]: true,
      'slot-only': !label,
    }"
    @click="handleClick"
  >
    <input :value="radioValue" :name="radioName" type="radio" />
    <div v-if="displayStyle === 'icon'" class="radio-icon">
      <div class="radio-icon-inner"></div>
    </div>
    <span v-if="label" class="radio-label">{{ label }}</span>
    <slot name="default" :selected="radioChecked"></slot>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.cus-ratio-button {
  color: var(--color-black);
  position: relative;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;

  &.slot-only {
    padding: 8px;
  }

  // 圆形 radio 图标样式
  .radio-icon {
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: 1px solid var(--color-trans-200);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.2s $ease-out-circ;
    background-color: var(--color-white);

    &-inner {
      width: 0.5em;
      height: 0.5em;
      border-radius: 50%;
      transform: scale(0);
      transition:
        transform 0.2s $ease-out-circ,
        background-color 0.2s $ease-out-circ;
    }
  }

  .radio-label {
    transition: color 0.1s $ease-out-circ;
  }

  &.display-background {
    &.type-normal {
      &.checked {
        color: var(--color-primary);
      }
    }

    &.type-highlight {
      &.checked {
        color: $color-white;
      }
    }
  }

  &.display-icon {
    &.type-normal {
      &.checked {
        .radio-icon {
          border-color: var(--color-primary);

          &-inner {
            background-color: var(--color-primary);
            transform: scale(1);
          }
        }
      }
    }

    &.type-highlight {
      &.checked {
        .radio-icon {
          border-color: var(--color-primary);

          &-inner {
            background-color: var(--color-primary);
            transform: scale(1);
          }
        }
        .radio-label {
          color: var(--color-primary);
        }
      }
    }
  }

  &.direction-row {
    // 横向排列时，行高为 1，与其它元素保持一致
    line-height: 1;
  }

  &:not(:last-child) {
    &:before {
      content: '';
      position: absolute;
      background-color: rgba(0, 0, 0, 0.05);
      transition: opacity 0.2s $ease-out-circ;
    }

    &.direction-row:before {
      top: 50%;
      right: -0.5px;
      transform: translateY(-50%);
      width: 1px;
      height: 30%;
      max-height: 1em;
    }

    &.direction-column:before {
      left: 50%;
      bottom: -0.5px;
      transform: translateX(-50%);
      height: 1px;
      width: 30%;
      max-width: 1em;
    }
  }

  > input[type='radio'] {
    display: none;
  }
}
</style>
