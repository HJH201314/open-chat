<script setup lang="ts">

import RecordList from "@/components/RecordList.vue";
import DialogDetail from "@/pages/message/components/DialogDetail.vue";
import { computed, reactive, ref, watch } from "vue";
import { useEventBus, useMediaQuery } from "@vueuse/core";
import { toggleSidebarKey } from "@/constants/eventBusKeys";

const isLargeScreen = useMediaQuery("(min-width: 768px)");

const showListView = computed(() => {
  if (!isLargeScreen.value && currentRecord.id) return false;
  else return true;
});
const showDialogView = computed(() => {
  if (isLargeScreen.value || currentRecord.id) return true;
  else return false;
});

const currentRecord = reactive({
  id: '',
  title: "",
  dialogNum: 0,
  createAt: "",
});

// 移动端侧边栏隐藏和展示
const toggleSideBarBus = useEventBus(toggleSidebarKey);
watch(() => currentRecord.id, (v) => {
  if (isLargeScreen) return;
  // 进入对话时（id>-1）侧边栏收起
  toggleSideBarBus.emit(!currentRecord.id);
});

function handleDialogChange(sessionId: string) {
  currentRecord.id = sessionId;
}

/* 通过Transition的事件控制showEmptyTip，避免应用动画时刷新空空如也和消息列表挤压 */
const showEmptyTip = ref(true);
</script>

<template>
  <div class="message-page">
    <Transition :name="showListView ? 'slide-fade' : 'slide-fade-rev'">
      <RecordList v-show="showListView" class="message-page-record-list transition-all-circ" :class="{'message-page-record-list-absolute': !showDialogView}" @change="handleDialogChange" />
    </Transition>
    <div v-if="showListView && showDialogView" class="split"></div>
    <Transition :name="showListView ? 'slide-fade' : 'slide-fade-rev'"
                @before-enter="showEmptyTip = false"
                @after-leave="showEmptyTip = true">
      <DialogDetail id="dialog-detail-view" v-if="showDialogView && currentRecord.id"
                    class="message-page-dialog-detail transition-all-circ"
                    :class="{'message-page-dialog-detail-absolute': !showListView}" :dialog-id="currentRecord.id"
                    @back="() => currentRecord.id = ''"
      />
    </Transition>
    <Transition name="ease-in">
      <div id="dialog-detail-empty-tip" v-if="showDialogView && !currentRecord.id && showEmptyTip"
           class="message-page-dialog-detail message-page-empty-tip">╮(￣▽￣)╭<br />这里空空如也<br /></div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/variables.module";
@import "@/assets/animations";
.message-page {
  height: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border-radius: .5rem;
  gap: 8px;
  overflow: hidden;
  padding: .5rem;

  .split {
    flex-shrink: 0;
    width: 2px;
    height: auto;
    background-color: $color-grey;
    opacity: 0.666;
  }

  &-record-list {
    &:not(&-absolute) {
      min-width: calc(30% - 8px); // 防止右侧消息列表关闭时被挤压
      max-width: calc(30% - 8px); // 防止右侧消息列表关闭时被挤压
    }
    // 在移动端使用absolute便于展示切换动画，否则会被挤压
    &-absolute {
      position: absolute;
      inset: .5rem;
    }
  }

  &-dialog-detail {
    flex-shrink: 0;
    &:not(&-absolute) {
      max-width: calc(70% - 8px);
      min-width: calc(70% - 8px);
    }
    // 在移动端使用absolute便于展示切换动画，否则会被挤压
    &-absolute {
      position: absolute;
      inset: .5rem;
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
</style>