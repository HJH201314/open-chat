<script setup lang="ts">

import RecordList from "@/components/RecordList.vue";
import DialogDetail from "@/pages/message/components/DialogDetail.vue";
import { computed, reactive, ref, watch } from "vue";
import { useEventBus, useMediaQuery } from "@vueuse/core";
import SideBar from "@/components/sidebar/SideBar.vue";
import { toggleSidebarKey } from "@/constants/eventBusKeys";
import CommonModal from "@/components/modal/CommonModal.vue";

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
</script>

<template>
  <div class="message-page">
    <RecordList v-show="showListView" class="message-page-record-list" @change="handleDialogChange" />
    <div v-if="showListView && showDialogView" class="split"></div>
    <DialogDetail v-if="showDialogView && currentRecord.id" class="message-page-dialog-detail" :dialog-id="currentRecord.id"
                  @back="() => currentRecord.id = ''"
    />
    <div v-if="showDialogView && !currentRecord.id" class="message-page-dialog-detail message-page-empty-tip">这里空空如也<br /></div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/variables";
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
    width: 2px;
    height: auto;
    background-color: $color-gray;
    opacity: 0.666;
  }

  &-record-list {
    flex: 3;
  }

  &-dialog-detail {
    flex: 7;
  }

  &-empty-tip {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $color-primary;
    font-size: 24px;
    font-weight: bold;
  }
}
</style>