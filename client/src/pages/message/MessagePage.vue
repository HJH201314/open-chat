<script lang="ts" setup>
import useGlobal from '@/commands/useGlobal';
import RecordList from '@/components/RecordList.vue';
import { noPaddingKey, toggleSidebarKey } from '@/constants/eventBusKeys';
import DialogDetail from '@/pages/message/components/DialogDetail.vue';
import { useEventBus } from '@vueuse/core';
import { useRouteParams } from '@vueuse/router';
import { computed, reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const currentRecord = reactive({
  id: '',
  title: '',
  dialogNum: 0,
  createAt: '',
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

// 通过Transition的事件控制showEmptyTip，避免应用动画时刷新空空如也和消息列表挤压
const showEmptyTip = ref(true);
</script>

<template>
  <div class="message-page">
    <Transition :name="showListView ? 'slide-fade' : 'slide-fade-rev'">
      <RecordList
        v-show="showListView"
        :class="{ 'message-page-record-list-absolute': !isLargeScreen }"
        class="message-page-record-list transition-all-circ"
      />
    </Transition>
    <div v-if="showListView && showDialogView" class="split"></div>
    <Transition
      :name="isLargeScreen ? 'slide-fade' : 'show'"
      @before-enter="showEmptyTip = false"
      @after-leave="showEmptyTip = true"
    >
      <DialogDetail
        v-if="showDialogView && currentRecord.id"
        id="dialog-detail-view"
        :class="{
          'message-page-dialog-detail-absolute': !isLargeScreen,
        }"
        :dialog-id="currentRecord.id"
        class="message-page-dialog-detail transition-all-circ"
        @back="() => router.back()"
      />
    </Transition>
    <Transition name="ease-in">
      <div
        v-if="showDialogView && !currentRecord.id && showEmptyTip"
        id="dialog-detail-empty-tip"
        class="message-page-dialog-detail message-page-empty-tip"
      >
        ╮(￣▽￣)╭<br />这里空空如也<br />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/variables' as *;
@use '@/assets/animations';

.message-page {
  height: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border-radius: 0.5rem;
  gap: 8px;
  overflow: hidden;
  padding: 0.5rem;
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
      min-width: calc(30% - 8px); // 防止右侧消息列表关闭时被挤压
      max-width: calc(30% - 8px); // 防止右侧消息列表关闭时被挤压
    }

    // 在移动端使用absolute便于展示切换动画，否则会被挤压
    &-absolute {
      position: absolute;
      inset: 0.5rem;
    }
  }

  &-dialog-detail {
    height: 100%;
    flex-shrink: 0;

    &:not(&-absolute) {
      max-width: calc(70% - 8px);
      min-width: calc(70% - 8px);
    }

    // 在移动端使用absolute便于展示切换动画，否则会被挤压
    &-absolute {
      position: absolute;
      inset: 0.5rem;
      background-color: white;
    }
  }

  &-empty-tip {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: $color-primary;
    font-size: 24px;
    font-weight: bold;
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
