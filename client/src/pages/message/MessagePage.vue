<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal';
import RecordListView from '@/pages/message/components/RecordListView.vue';
import { noPaddingKey, toggleSidebarKey } from '@/constants/eventBusKeys';
import ChatDetailView from '@/pages/message/components/ChatDetailView.vue';
import { useEventBus } from '@vueuse/core';
import { useRouteParams } from '@vueuse/router';
import { computed, reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const currentRecord = reactive({
  id: '',
});

// 路由处理，根据 sessionId 退出或进入详情
const router = useRouter();
const sessionId = useRouteParams('sessionId');
watchEffect(() => {
  if (sessionId.value) {
    currentRecord.id = String(sessionId.value);
  } else {
    currentRecord.id = '';
  }
})

const { isLargeScreen } = useGlobal();
const showListView = computed(() => {
  return isLargeScreen.value || !sessionId.value;
});
const showDialogView = computed(() => {
  return isLargeScreen.value || sessionId.value;
});

// 移动端侧边栏隐藏和展示
const toggleSideBarBus = useEventBus(toggleSidebarKey);
const noPaddingBus = useEventBus(noPaddingKey);
watchEffect(() => {
  // 大屏时展示边栏、关闭零内衬
  if (isLargeScreen.value) {
    toggleSideBarBus.emit(true);
    noPaddingBus.emit(false);
  }
  // 进入对话时侧边栏收起，退出后展开
  else {
    toggleSideBarBus.emit(!currentRecord.id);
    noPaddingBus.emit(!!currentRecord.id);
  }
});

// 通过Transition的事件控制 isEmptyTipAvailable，避免应用动画时刷新空空如也和消息列表挤压
const isEmptyTipAvailable = ref(true);
</script>

<template>
  <div class="message-page">
    <Transition :name="showListView ? 'slide-fade' : 'slide-fade-rev'">
      <RecordListView
        v-show="showListView"
        :class="{ 'message-page-record-list-absolute': !isLargeScreen }"
        class="message-page-record-list transition-all-circ"
      />
    </Transition>
    <div v-if="showListView && showDialogView" class="split"></div>
    <section v-show="showDialogView" class="session-right" :class="{'session-right-absolute': !isLargeScreen}">
      <Transition
        :name="isLargeScreen ? 'slide-fade-right' : 'slide-fade-right'"
        @before-enter="isEmptyTipAvailable = false"
        @after-leave="isEmptyTipAvailable = true"
      >
        <ChatDetailView
          v-if="showDialogView && currentRecord.id"
          id="dialog-detail-view"
          :dialog-id="currentRecord.id"
          class="message-page-dialog-detail transition-all-circ"
          @back="() => router.back()"
        />
      </Transition>
      <Transition name="ease-in">
        <div
          v-if="showDialogView && !currentRecord.id && isEmptyTipAvailable"
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
  border-radius: 0.5rem;
  overflow: hidden;
  align-items: center;

  .split {
    flex-shrink: 0;
    width: 2px;
    height: 100%;
    background-color: $color-grey;
    opacity: 0.233;
  }

  &-record-list {
    height: 100%;

    &:not(&-absolute) {
      flex-grow: 0;
      width: clamp(13.375rem, 30%, 20rem);
    }

    // 在移动端使用absolute便于展示切换动画，否则会被挤压
    &-absolute {
      position: absolute;
      left: 0;
      right: 0;
    }
  }

  &-dialog-detail {
    position: absolute;
    inset: 0;
  }

  &-empty-tip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: $color-primary;
    font-size: 2rem;
  }
}

.session-right {
  position: relative;
  height: 100%;
  flex: 1;
  flex-shrink: 0;

  // 在移动端使用absolute便于展示切换动画，否则会被挤压
  &-absolute {
    position: absolute;
    left: 0;
    right: 0;
    background-color: white;
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
