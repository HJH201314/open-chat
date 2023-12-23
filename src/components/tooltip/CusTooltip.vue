<script setup lang="ts">
/* Tooltip 悬浮提示组件 */
import { nextTick, ref } from "vue";
import { useMouseInElement } from "@vueuse/core";

type TooltipProps = {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  enabled?: boolean;
};
const props = withDefaults(defineProps<TooltipProps>(), {
  text: '',
  position: 'right',
  enabled: true,
});

const refTrigger = ref<HTMLDivElement>();
const refTooltip = ref<HTMLDivElement>();
const refPopover = ref<HTMLSpanElement>();

const showTip = ref(false);

function show() {
  if (!props.enabled) return;
  // 先切换show再设置位置，否则由于tooltip元素大小不存在，导致位置计算错误
  showTip.value = true;
  nextTick(() => {
    const trigger = refTrigger.value;
    const popover = refPopover.value;
    if (!trigger || !popover) return;
    // console.debug(refTrigger.value?.offsetLeft, refTrigger.value?.offsetWidth);
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
    refPopover.value!.style.top = positionTop + 'px';
    refPopover.value!.style.left = positionLeft + 'px';
  });
  // 设置定时，如果超出时间，则尝试关闭tooltip
  clearInterval(closeInterval.value);
  closeInterval.value = setInterval(hide, 500);
}

const closeInterval = ref<number>();
const mouseInBase = useMouseInElement(refTooltip);
const mouseInPopover = useMouseInElement(refPopover);

function hide(e?: MouseEvent) {
  // console.debug({
  //   mouseX: mouseInBase.elementX.value,
  //   mouseY: mouseInBase.elementY.value,
  //   eventMouseX: e?.offsetX,
  //   eventMouseY: e?.offsetY,
  //   elementX: mouseInBase.elementWidth.value,
  //   elementY: mouseInBase.elementHeight.value,
  // });
  // useMouseInElement的结果有延迟，一个nextTick似乎避免不了
  // 因此如果有事件传进来，以事件中offsetX/offsetY的为准
  // 下方判断加等号是因为，事件传递过来的offset有可能等于宽度或高度
  const isOutsideByEvent = !e ? false :
    (e.offsetX <= 0 || e.offsetX >= mouseInBase.elementWidth.value || e.offsetY <= 0 || e.offsetY >= mouseInBase.elementHeight.value)
    && (e.offsetX <= 0 || e.offsetX >= mouseInPopover.elementWidth.value || e.offsetY <= 0 || e.offsetY >= mouseInPopover.elementHeight.value);
  if (isOutsideByEvent || mouseInBase.isOutside.value && mouseInPopover.isOutside.value) {
    showTip.value = false;
    clearInterval(closeInterval.value);
  }
}
</script>

<template>
  <div class="tooltip" @mouseenter="show" @mouseleave="hide" ref="refTooltip">
    <span class="tooltip-wrapper" ref="refTrigger">
      <slot />
    </span>
    <Transition>
      <div v-if="showTip" :class="{'tooltip-info': text, 'tooltip-slot': !text}" @mouseleave="hide" ref="refPopover" role="tooltip">
        <span v-if="text" class="tooltip-info-text">{{ props.text }}</span>
        <div v-else><slot name="tip" /></div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/variables.module";
.tooltip {
  position: relative;
  &-info {
    position: absolute;
    padding: .25rem .5rem;
    border-radius: .5rem;
    background-color: #303030;
    z-index: 999;
    opacity: 0.9;
    box-sizing: border-box;
    display: flex;

    &-text {
      font-size: 1rem;
      white-space: nowrap;
      color: $color-white;
    }
  }
  &-slot {
    position: absolute;
    padding: .25rem .5rem;
    border-radius: .5rem;
    background-color: white;
    box-shadow: $box-shadow;
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