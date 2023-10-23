<script setup lang="ts">

import RecordList from "@/components/RecordList.vue";
import DialogDetail from "@/pages/message/components/DialogDetail.vue";
import { computed, ref, watch } from "vue";
import { useEventBus, useMediaQuery } from "@vueuse/core";
import SideBar from "@/components/sidebar/SideBar.vue";
import { toggleSidebarKey } from "@/constants/eventBusKeys";
import CommonModal from "@/components/modal/CommonModal.vue";

const isLargeScreen = useMediaQuery("(min-width: 768px)");

const showListView = computed(() => {
  if (!isLargeScreen.value && currentRecord.value.id >= 0) return false;
  else return true;
});
const showDialogView = computed(() => {
  if (isLargeScreen.value || currentRecord.value.id >= 0) return true;
  else return false;
});

const currentRecord = ref({
  id: -1,
  title: "",
  dialogNum: 0,
  createAt: "",
});

// 移动端侧边栏隐藏和展示
const toggleSideBarBus = useEventBus(toggleSidebarKey);
watch(() => currentRecord.value.id, (v) => {
  if (isLargeScreen) return;
  // 进入对话时（id>-1）侧边栏收起
  toggleSideBarBus.emit(currentRecord.value.id < 0);
});
</script>

<template>
  <div class="record-page">
    <RecordList v-if="showListView" class="record-list" @choose="(v) => currentRecord.id = v" />
    <div v-if="showListView && showDialogView" class="split"></div>
    <DialogDetail v-if="showDialogView" class="dialog-detail"
                  @back="() => currentRecord.id = -1"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/variables";
.record-page {
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

  .record-list {
    flex: 3;
  }

  .dialog-detail {
    flex: 7;
  }
}
</style>