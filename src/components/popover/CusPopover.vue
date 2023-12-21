<script setup lang="ts">
/* Popover 悬浮显示组件 */
import { nextTick, ref } from "vue";

type PopoverProps = {
  alwaysShow?: boolean; // 调试时使用，让popover一直显示
  position?: 'top' | 'bottom' | 'left' | 'right';
  enabled?: boolean;
};
const props = withDefaults(defineProps<PopoverProps>(), {
  alwaysShow: false,
  text: '',
  position: 'right',
  enabled: true,
});

const refTrigger = ref<HTMLDivElement>();
const refContainer = ref<HTMLDivElement>();
const refPopover = ref<HTMLDivElement>();

const showPopover = ref(false);

function show() {
  if (!props.enabled) return;
  // 先切换show再设置位置，否则由于popover元素不存在，导致位置计算错误
  showPopover.value = true;
  nextTick(() => {
    const trigger = refTrigger.value;
    const popover = refPopover.value;
    if (!trigger || !popover) return;
    console.debug(refTrigger.value?.offsetLeft, refTrigger.value?.offsetWidth);
    let positionLeft = 0;
    let positionTop = 0;
    switch (props.position) {
      case 'top':
        positionLeft = trigger.offsetWidth / 2 - popover.offsetWidth / 2;
        positionTop = trigger.offsetTop - popover.offsetHeight - 2;
        break;
      case 'left':
        positionLeft = - popover.offsetWidth - 2;
        positionTop = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2;
        break;
      case 'right':
        positionLeft = trigger.offsetWidth + 2;
        positionTop = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2;
        break;
      case 'bottom':
        positionLeft = trigger.offsetWidth / 2 - popover.offsetWidth / 2;
        positionTop = trigger.offsetTop + trigger.offsetHeight + 2;
        break;
    }
    refPopover.value.style.top = positionTop + 'px';
    refPopover.value.style.left = positionLeft + 'px';
  })
}

function hide(e: MouseEvent) {
  console.debug('mouse offset:', e.offsetX, e.offsetY);
  if (e.offsetX < 0 || e.offsetX > refContainer.value?.offsetWidth || e.offsetY < 0 || e.offsetY > refContainer.value?.offsetHeight) {
    showPopover.value = false;
  }
}
</script>

<template>
  <div class="popover" @mouseenter="show" @mouseleave="(e) => hide(e)" ref="refContainer">
    <span class="popover-wrapper" ref="refTrigger">
      <slot name="body" />
    </span>
    <Transition>
      <div v-show="showPopover || props.alwaysShow" class="popover-slot" ref="refPopover" role="tooltip">
        <slot name="popover" />
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.popover {
  position: relative;
  &-slot {
    position: absolute;
    padding: .25rem .5rem;
    border-radius: .5rem;
    background-color: transparent;
    z-index: 999;
    opacity: 0.9;
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