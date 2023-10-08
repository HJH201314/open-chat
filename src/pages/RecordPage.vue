<script setup lang="ts">

import RecordList from "@/components/RecordList.vue";
import DialogDetail from "@/components/DialogDetail.vue";
import { computed, ref } from "vue";
import { useMediaQuery } from "@vueuse/core";

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

</script>

<template>
  <div class="record-page">
    <RecordList v-if="showListView" class="flex-[3]" @choose="(v) => currentRecord.id = v" />
    <div v-if="showListView && showDialogView" class="w-0.5 bg-gray-100 h-auto"></div>
    <DialogDetail v-if="showDialogView" class="flex-[7]"
                  @back="() => currentRecord.id = -1"
    />
  </div>
</template>

<style scoped>
.record-page {
  height: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border-radius: .5rem;
  gap: 8px;
  overflow: hidden;
}
</style>