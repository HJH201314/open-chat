<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal.ts';
import RecordListView from '@/pages/user/chat/message/components/RecordListView.vue';
import { noPaddingKey } from '@/constants/eventBusKeys.ts';
import ChatDetailView from '@/pages/user/chat/message/components/ChatDetailView.vue';
import { useElementBounding, useEventBus, useLocalStorage } from '@vueuse/core';
import { computed, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { useUserStore } from '@/store/useUserStore.ts';
import { useRouter } from 'vue-router';
import { createDraggable, Draggable } from 'animejs';
import { nextFrame } from '@/utils/element.ts';

const props = withDefaults(
  defineProps<{
    // 默认通过路由传入的sessionId
    sessionId?: string;
  }>(),
  {
    sessionId: '',
  }
);

const { isLargeScreen } = useGlobal();
const showListView = computed(() => {
  return isLargeScreen.value || !props.sessionId;
});
const showDialogView = computed(() => {
  return isLargeScreen.value || props.sessionId;
});

// 移动端 padding 隐藏和展示
const noPaddingBus = useEventBus(noPaddingKey);
watchEffect(() => {
  // 大屏时展示边栏、关闭零内衬
  if (isLargeScreen.value) {
    noPaddingBus.emit(false);
  }
  // 进入对话时侧边栏收起，退出后展开
  else {
    noPaddingBus.emit(true);
    // noPaddingBus.emit(!!props.sessionId);
  }
});

// 通过Transition的事件控制 isRightSessionShowing，避免应用动画时刷新空空如也和消息列表挤压
const isRightSessionShowing = ref(false);

const userStore = useUserStore();
const router = useRouter();
watch(
  () => userStore.isLogin,
  (newIsLogin) => {
    if (!newIsLogin) {
      router.replace({
        name: 'ChatModule',
      });
    }
  }
);

// 拖拽控制，并且在页面宽度变化时重置 TODO：提升稳定性，降低延迟
let splitStartX = 0;
const deltaWidth = useLocalStorage('chat-page-split-delta-width', '0px');
const splitRef = useTemplateRef('split');
const pageRef = useTemplateRef('message-page');
const { width: pageWidth } = useElementBounding(pageRef);
let draggable: Draggable | undefined = undefined;
const resetDraggable = () => {
  draggable?.refresh();
  draggable?.reset();
  draggable?.revert();
  deltaWidth.value = '0px';
  nextFrame(() => {
    splitStartX = splitRef.value?.getBoundingClientRect()?.x || 0;
    draggable = createDraggable('.split', {
      y: false,
      snap: 5,
      x: {
        mapTo: 'none',
        modifier: (x) => {
          // 限制拖拽不能超过 record-list 的 clamp 限制的范围
          const splitX = splitRef.value?.getBoundingClientRect()?.x || 0;
          if (splitX - splitStartX + 1 < x) return splitX - splitStartX + 1;
          else if (splitX - splitStartX - 1 > x) return splitX - splitStartX - 1;
          else return x;
        },
      },
      cursor: { onHover: 'ew-resize', onGrab: 'ew-resize' },
      maxVelocity: 0, // 释放后无加速度
      onSnap: (e) => {
        deltaWidth.value = `${e.destX}px`;
      },
    });
  });
};
watch(
  () => pageWidth.value,
  (newValue, oldValue) => {
    Math.abs(newValue - (oldValue || 0)) > 5 && resetDraggable();
  },
  { immediate: true }
);
</script>

<template>
  <div ref="message-page" class="message-page">
    <Transition :name="showListView ? 'slide-fade' : 'slide-fade-rev'">
      <RecordListView
        v-show="showListView"
        :class="{ 'message-page-record-list-full': !isLargeScreen }"
        class="message-page-record-list"
      />
    </Transition>
    <div v-if="showListView && showDialogView" ref="split" class="split"></div>
    <section
      v-show="showDialogView || isRightSessionShowing"
      class="session-right"
      :class="{ 'session-right-full': !isLargeScreen }"
    >
      <Transition
        :name="isLargeScreen ? 'slide-fade-right' : 'slide-in-right-full'"
        :type="isLargeScreen ? 'transition' : 'animation'"
        @before-enter="isRightSessionShowing = true"
        @after-leave="isRightSessionShowing = false"
      >
        <ChatDetailView
          v-if="showDialogView && props.sessionId"
          id="dialog-detail-view"
          :dialog-id="props.sessionId"
          class="message-page-dialog-detail"
          @back="() => $router.replace('/chat')"
        />
      </Transition>
      <Transition name="ease-in">
        <div
          v-if="showDialogView && !props.sessionId && !isRightSessionShowing"
          id="dialog-detail-empty-tip"
          class="message-page-empty-tip"
        >
          ╮(￣▽￣)╭<br />这里空空如也<br />
        </div>
      </Transition>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;
@use '@/assets/animations';

.message-page {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  overflow: hidden;
  align-items: center;

  .split {
    flex-shrink: 0;
    width: 2px;
    height: 100%;
    background-color: var(--color-grey-100);
    opacity: 0.233;
  }

  &-record-list {
    height: 100%;

    &:not(&-full) {
      --deltaWidth: v-bind(deltaWidth);
      flex-grow: 0;
      width: clamp(12rem, calc(25% + var(--deltaWidth)), max(calc(100% - 55rem), 20rem));
    }

    // 在移动端使用absolute便于展示切换动画，否则会被挤压
    &-full {
      position: absolute;
      left: 0;
      right: 0;
    }
  }

  &-dialog-detail {
    z-index: 1;
    position: absolute;
    inset: 0;
    background: var(--color-white);
  }

  &-empty-tip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: var(--color-primary);
    font-size: 2rem;
  }
}

.session-right {
  position: relative;
  height: 100%;
  flex: 1;
  flex-shrink: 0;

  // 在移动端使用absolute便于展示切换动画，否则会被挤压
  &-full {
    position: absolute;
    left: 0;
    right: 0;
  }
}

.show-enter-active,
.show-leave-active {
  transition: opacity 0.2s $ease-out-circ;
}

.show-enter-from,
.show-leave-to {
  opacity: 0;
}
</style>

<style lang="scss">
@use '@/assets/variables' as *;

.slide-in-right-full {
  &-enter-active {
    animation: slide-in-right-full-anim 0.25s $ease-out-circ;
  }

  &-leave-active {
    animation: slide-in-right-full-anim 0.25s $ease-in-out-circ reverse;
  }

  @keyframes slide-in-right-full-anim {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }
}
</style>
