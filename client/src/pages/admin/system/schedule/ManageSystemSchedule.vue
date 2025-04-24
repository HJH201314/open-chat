<template>
  <div>
    <TableTitleArea title="定时任务" subtitle="操作系统中正在运行的定时任务">
      <template #actions>
        <t-button variant="outline" shape="circle" @click="getSchedules()">
          <template #icon>
            <refresh-icon />
          </template>
        </t-button>
      </template>
    </TableTitleArea>
    <TableWrapper v-slot="{ maxHeight }">
      <t-table
        ref="table"
        row-key="id"
        size="small"
        table-layout="auto"
        :max-height="maxHeight"
        :allow-resize-column-width="false"
        :data="data"
        :loading="loading"
        :columns="columns"
        :bordered="true"
        :hover="true"
        :pagination="pagination"
        :footer-affixed-bottom="true"
        style="width: 100%; background-color: transparent"
        cell-empty-content="-"
        lazy-load
      >
        <template #status="{ row }">
          <div style="cursor: pointer" @click="handleChangeStatus(row)">
            <t-tag v-if="row.status === ApiSchemaScheduleStatus.EnumScheduleStatusRunning" theme="success"
              >运行中</t-tag
            >
            <t-tag v-else-if="row.status === ApiSchemaScheduleStatus.EnumScheduleStatusStopped" theme="danger"
              >已停止</t-tag
            >
          </div>
        </template>
        <template #operation="{ row }">
          <ActionSet>
            <t-tooltip :delay="10" content="立即执行">
              <t-link theme="primary" hover="color" @click="handleRun(row)">
                <rocket-icon />
              </t-link>
            </t-tooltip>
            <t-tooltip :delay="10" content="编辑">
              <t-link theme="primary" hover="color" @click="handleEdit(row)">
                <edit-icon />
              </t-link>
            </t-tooltip>
          </ActionSet>
        </template>
      </t-table>
    </TableWrapper>
  </div>
</template>

<script setup lang="tsx">
import { h, onMounted, reactive, ref, watchEffect } from 'vue';
import { type ApiSchemaSchedule, ApiSchemaScheduleStatus } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import type { PrimaryTableCol } from 'tdesign-vue-next/es/table/type';
import { DialogManager } from '@/components/dialog';
import TableTitleArea from '@/pages/admin/component/TableTitleArea.vue';
import { EditIcon, RefreshIcon, RocketIcon } from 'tdesign-icons-vue-next';
import TableWrapper from '@/pages/admin/component/TableWrapper.vue';
import ActionSet from '@/pages/admin/component/ActionSet.vue';
import DialogCreateSchedule from '@/pages/admin/system/schedule/DialogCreateSchedule.vue';
import ToastManager from '@/components/toast/ToastManager.ts';

const data = ref<ApiSchemaSchedule[]>([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(15);
const pagination = reactive({
  pageSizeOptions: [5, 10, 15, 20],
  defaultCurrent: pageNum,
  defaultPageSize: pageSize,
  onChange(param: { current: number; previous: number; pageSize: number }) {
    pageNum.value = param.current;
    pageSize.value = param.pageSize;
  },
  total,
});

onMounted(() => {
  watchEffect(() => {
    getSchedules(pageNum.value, pageSize.value);
  });
});

const loading = ref(false);

async function getSchedule(name: string) {
  try {
    const res = await genApi.Manage.scheduleGet(name);
    if (res.status == 200 && res.data.data) {
      data.value.forEach((item, index) => {
        if (item.name == name) {
          data.value[index] = {
            ...item,
            ...res.data.data,
          };
        }
      });
    }
  } catch (error) {
    console.debug(error);
  } finally {
  }
}

async function getSchedules(page?: number, size?: number) {
  const finalPageNum = page || pageNum.value || 1;
  const finalPageSize = size || pageSize.value || 10;
  try {
    loading.value = true;
    const res = await genApi.Manage.scheduleListGet({
      page_num: finalPageNum,
      page_size: finalPageSize,
      sort_expr: 'created_at ASC',
    });
    if (res.status == 200 && res.data.data) {
      total.value = res.data.data.total || 0;
      data.value = res.data.data.list || [];
    }
  } catch (error) {
    console.debug(error);
  } finally {
    loading.value = false;
  }
}

const columns = ref<PrimaryTableCol<ApiSchemaSchedule>[]>([
  { colKey: 'serial-number', title: 'NO', width: '2rem', align: 'center' },
  { colKey: 'name', title: '定时任务' },
  { colKey: 'description', title: '描述' },
  { colKey: 'duration', title: '执行间隔 (s)' },
  {
    colKey: 'last_run_time',
    title: '上次执行',
    cell: (_, { row }) => (row.last_run_time ? new Date(row.last_run_time).toLocaleTimeString() : '-'),
  },
  { colKey: 'status', title: '状态' },
  { colKey: 'operation', title: '操作', width: '7rem', fixed: 'right' },
]);

const dialogMode = ref<'create' | 'edit'>('edit');
const dialogData = ref<ApiSchemaSchedule>({});

async function handleChangeStatus(row: ApiSchemaSchedule) {
  const res = await DialogManager.commonDialog({
    title: `${row.status == ApiSchemaScheduleStatus.EnumScheduleStatusRunning ? '停止' : '启动'}任务`,
    content: `确定要${row.status == ApiSchemaScheduleStatus.EnumScheduleStatusRunning ? '停止' : '启动'}任务吗？`,
  });
  if (res) {
    try {
      if (!row.id) return;
      await genApi.Manage.scheduleUpdatePost(row.name!, {
        data: {
          status:
            row.status == ApiSchemaScheduleStatus.EnumScheduleStatusRunning
              ? ApiSchemaScheduleStatus.EnumScheduleStatusStopped
              : ApiSchemaScheduleStatus.EnumScheduleStatusRunning,
        },
        updates: ['status'],
      });
    } catch (error) {
      ToastManager.danger('操作失败');
      console.debug(error);
    } finally {
      getSchedule(row.name!);
    }
  }
}

async function handleRun(row: ApiSchemaSchedule) {
  const res = await DialogManager.commonDialog({
    title: `立即执行任务`,
    content: `确定要立即执行任务吗？`,
  });
  if (res) {
    try {
      if (!row.id) return;
      await genApi.Manage.scheduleRunPost(row.name!);
    } catch (error) {
      ToastManager.danger('操作失败');
      console.debug(error);
    }
  }
}

function handleEdit(row: ApiSchemaSchedule) {
  dialogMode.value = Object.keys(row).length == 0 ? 'create' : 'edit';
  dialogData.value = row;
  DialogManager.renderDialog(
    h(DialogCreateSchedule, {
      mode: dialogMode.value,
      data: dialogData.value,
      onConfirm() {
        getSchedules();
      },
    })
  );
}
</script>

<style scoped lang="scss"></style>
