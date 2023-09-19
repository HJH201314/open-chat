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

const emit = defineEmits<{
  (e: 'choose', value: number): void;
}>();

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
function handleRemoveRecord(index: number) {
  // 删除对话
  records.value.splice(index, 1);
}
function handleClearRecords() {
  records.value = [];
}
</script>
<template>
  <div>
    <div class="box-border flex flex-col">
      <div class="flex flex-row flex-wrap gap-3">
        <div class="flex-1 h-auto rounded-lg cursor-pointer bg-indigo-600 px-3.5 py-2.5 text-center text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="handleClearRecords"
        >
          清除记录
        </div>
        <div class="flex-1 h-auto rounded-lg cursor-pointer bg-indigo-600 px-3.5 py-2.5 text-center text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="handleCreateDialog"
        >
          新的聊天
        </div>
      </div>
      <div class="h-4"></div>
      <TransitionGroup name="bounce" tag="div" class="flex1 flex flex-col gap-3 overflow-y-scroll hide-scrollbar">
        <div v-for="(record, i) in records" :key="record.id"
             @click="$emit('choose', record.id)"
             class="relative rounded-lg group/record border-2 hover:border-white"
        >
          <div class="absolute bg-emerald-500 bottom-0 left-0 w-full -z-10 h-0 group-hover/record:h-full transition-height ease-out-expo" />
          <div class="p-4 m-0.5 bg-white rounded-[0.25rem] box-border">
            <div class="font-bold text-xl">
              {{ record.title }}
            </div>
            <div @click="handleRemoveRecord(i)" class="absolute cursor-pointer right-4 top-2 collapse group-hover/record:visible">
              ×
            </div>
            <div class="flex flex-row justify-between">
              <div class="text-left">
                {{ record.dialogNum }} 条对话
              </div>
              <div class="text-right">
                {{ record.createAt }}
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
      <div class="record-toolbar">

      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
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