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
}
</script>
<template>
  <div class="record">
    <div class="record-entries">
      <div class="record-entries-entry">
        新的聊天
      </div>
      <div class="record-entries-entry">
        巴拉巴拉
      </div>
    </div>
    <div class="record-list">
      <div v-for="(record, i) in records" :key="record.id" class="record-list-item">
        <div class="record-list-item-title">
          {{ record.title }}
        </div>
        <div class="record-list-item-bottom">
          <div class="record-list-item-bottom-left">
            {{ record.dialogNum }} 条对话
          </div>
          <div class="record-list-item-bottom-right">

          </div>
        </div>
      </div>
    </div>
    <div class="record-toolbar">

    </div>
  </div>
</template>
<style scoped lang="scss">
.record {

  &-entries {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    &-entry {
      flex: 1;
      border-radius: 16px;
      padding: 16px;
    }
  }
  &-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &-item {
      border-radius: 16px;
      background-color: aqua;
      height: fit-content;
      padding: 12px;

      &-title {
        font-weight: 500;
        font-size: 16px;
      }

      &-bottom {
        display: flex;
        flex-direction: row;
      }
    }
  }
}
</style>