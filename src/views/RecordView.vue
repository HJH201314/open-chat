<script setup lang="ts">
import { onMounted, ref } from 'vue';

type RecordViewProps = {
  model: string;
};
const props  = withDefaults(
  defineProps<RecordViewProps>(),
  {
    model: 'normal'
  }
);

type Record = {
  id: number;
  title: string;
  dialogNum: number;
  createAt: string;
};
const records = ref<Record[]>([]);

onMounted(() => {
  // 从本地加载缓存的数据列表
  // 生成数据列表records
  for (let i = 0; i < 10; i++) {
    records.value.push({
      id: i,
      title: `title${i}`,
      dialogNum: 10,
      createAt: '2023-01-01'
    });
  }
  records.value = [...records.value];
});

function handleCreateDialog() {
  // 新建对话
  records.value.push({
    id: records.value.length,
    title: `title${records.value.length}`,
    dialogNum: 0,
    createAt: '2023-01-01'
  });
}
function handleRemoveRecord() {
  // 删除对话
}
function handleClearRecords() {
  records.value = [];
}
</script>
<template>
  <div className="container m-10">
    <div class="w-72 mx-auto box-border">
      <div className="flex flex-row flex-wrap gap-4">
        <div className="flex-1 h-auto rounded-lg cursor-pointer bg-indigo-600 px-3.5 py-2.5 text-center text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="handleClearRecords"
        >
          清除记录
        </div>
        <div className="flex-1 h-auto rounded-lg cursor-pointer bg-indigo-600 px-3.5 py-2.5 text-center text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="handleCreateDialog"
        >
          新的聊天
        </div>
      </div>
      <div className="h-4"></div>
      <TransitionGroup name="bounce" tag="div" className="flex flex-col gap-4 overflow-none">
        <div v-for="(record, i) in records" :key="record.id"
             className="relative rounded-lg h-auto p-4 border-2 border-b-emerald-500 hover:border-emerald-500 transition-all group/record"
        >
          <div className="font-bold text-xl">
            {{ record.title }}
          </div>
          <div @click="handleRemoveRecord" className="absolute cursor-pointer right-4 top-2 collapse group-hover/record:visible">
            ×
          </div>
          <div className="flex flex-row justify-between">
            <div className="text-left">
              {{ record.dialogNum }} 条对话
            </div>
            <div className="text-right">
              {{ record.createAt }}
            </div>
          </div>
        </div>
      </TransitionGroup>
      <div class="record-toolbar">

      </div>
    </div>
  </div>
</template>
<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.25s;
}
.bounce-leave-active {
  animation: bounce-in 0.25s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  35% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>