<script setup lang="ts">
/* Popover 悬浮提示组件 */
import { ref, useTemplateRef, type VNode } from 'vue';
import { nextFrame } from '@/utils/element.ts';
import { useEventListener } from '@vueuse/core';

type TooltipProps = {
  position?: 'top' | 'bottom' | 'left' | 'right';
  enabled?: boolean;
};
const props = withDefaults(defineProps<TooltipProps>(), {
  position: 'right',
  enabled: true,
});

const triggerRef = useTemplateRef<HTMLDivElement>('trigger');
const popoverRef = useTemplateRef<HTMLDivElement>('popover');

const showPopover = ref(false);

const gap = 2; // 提示框与触发元素之间的间距
const margin = 8; // 提示框与边界的最小距离

function show() {
  if (!props.enabled) return;
  // 先切换show再设置位置，否则由于tooltip元素大小不存在，导致位置计算错误
  showPopover.value = true;
  nextFrame(() => {
    const trigger = triggerRef.value;
    const popover = popoverRef.value;
    if (!trigger || !popover) return;
    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    let positionLeft = 0;
    let positionTop = 0;
    switch (props.position) {
      case 'top':
        positionLeft = triggerRect.left - (popoverRect.width / 2 - triggerRect.width / 2);
        positionTop = triggerRect.top - popoverRect.height - gap;
        break;
      case 'left':
        positionLeft = triggerRect.left - popoverRect.width - gap;
        positionTop = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        break;
      case 'right':
        positionLeft = triggerRect.left + triggerRect.width + gap;
        positionTop = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        break;
      case 'bottom':
        positionLeft = triggerRect.left - (popoverRect.width / 2 - triggerRect.width / 2);
        positionTop = triggerRect.top + triggerRect.height + gap;
        break;
    }
    // 溢出屏幕避让
    if (positionLeft < margin) {
      positionLeft = margin;
    } else if (positionLeft + popoverRect.width + margin > window.innerWidth) {
      positionLeft = window.innerWidth - popoverRect.width - margin;
    }
    if (positionTop < margin) {
      positionTop = margin;
    } else if (positionTop + popoverRect.height + margin > window.innerHeight) {
      positionTop = window.innerHeight - popoverRect.height - margin;
    }
    popover.style.top = `${positionTop}px`;
    popover.style.left = `${positionLeft}px`;
  });
}

useEventListener(document, 'mousemove', (e) => {
  if (e && showPopover.value) {
    clearInterval(closeInterval.value);
    closeInterval.value = window.setInterval(() => hide(e), 75);
  }
})

const closeInterval = ref<number>();

function hide(e?: MouseEvent) {
  if (!showPopover.value) return;

  const triggerRect = triggerRef.value?.getBoundingClientRect();
  const popoverRect = popoverRef.value?.getBoundingClientRect();
  // console.debug(JSON.stringify(triggerRect), JSON.stringify(popoverRect));
  if (!triggerRect || !popoverRect) return;
  const isOutsideByEvent = !e
    ? false
    : (e.x < triggerRect.x - gap ||
        e.x > triggerRect.x + triggerRect.width + gap ||
        e.y < triggerRect.y - gap ||
        e.y > triggerRect.y + triggerRect.height + gap) &&
      (e.x < popoverRect.x - gap ||
        e.x > popoverRect.x + popoverRect.width + gap ||
        e.y < popoverRect.y - gap ||
        e.y > popoverRect.y + popoverRect.height + gap);
  if (isOutsideByEvent) {
    showPopover.value = false;
    clearInterval(closeInterval.value);
  }
}

defineSlots<{
  default: () => VNode;
  popover: () => VNode;
}>();
</script>

<template>
  <div ref="trigger" v-bind="$attrs" @mouseenter="show">
    <slot />
    <Teleport to="body">
      <Transition>
        <div v-if="showPopover" ref="popover" class="popover-slot">
          <slot name="popover"></slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/variables' as *;

.popover {
  &-slot {
    position: fixed;
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: $box-shadow-deeper;
    z-index: 999;
    box-sizing: border-box;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s $ease-out-circ;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
