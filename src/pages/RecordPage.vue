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
  <div class="flex gap-4 flex-row box-border rounded-lg">
    <RecordList v-if="showListView" class="flex-[3]" @choose="(v) => currentRecord.id = v" />
    <div v-if="showListView && showDialogView" class="w-0.5 bg-gray-100 h-auto"></div>
    <DialogDetail v-if="showDialogView" class="flex-[7]"
                  @back="() => currentRecord.id = -1"
    />
  </div>
</template>

<style scoped>

</style>