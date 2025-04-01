<template>
  <div>
    <TableTitleArea title="储存桶" subtitle="兼容 AWS S3 协议的储存桶">
      <template #actions>
        <t-button variant="outline" shape="circle" @click="getBuckets()">
          <template #icon>
            <refresh-icon />
          </template>
        </t-button>
        <t-button theme="primary" @click="handleEdit({})">
          <template #icon>
            <add-icon />
          </template>
          创建
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
        <template #operation="{ row }">
          <ActionSet>
            <t-tooltip :delay="10" content="编辑">
              <t-link theme="primary" hover="color" @click="handleEdit(row)">
                <edit-icon />
              </t-link>
            </t-tooltip>
            <t-tooltip :delay="10" content="删除">
              <t-link theme="danger" hover="color" @click="handleDelete(row)">
                <delete-icon />
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
import type { ApiSchemaBucket } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import type { PrimaryTableCol } from 'tdesign-vue-next/es/table/type';
import { DialogManager } from '@/components/dialog';
import TableTitleArea from '@/pages/admin/component/TableTitleArea.vue';
import { AddIcon, DeleteIcon, EditIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { useRouter } from 'vue-router';
import { RobotOne } from '@icon-park/vue-next';
import TableWrapper from '@/pages/admin/component/TableWrapper.vue';
import ActionSet from '@/pages/admin/component/ActionSet.vue';
import DialogCreateBucket from '@/pages/admin/system/bucket/DialogCreateBucket.vue';

const data = ref<ApiSchemaBucket[]>([]);
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
    getBuckets(pageNum.value, pageSize.value);
  });
});

const loading = ref(false);

async function getBuckets(page?: number, size?: number) {
  const finalPageNum = page || pageNum.value || 1;
  const finalPageSize = size || pageSize.value || 10;
  try {
    loading.value = true;
    const res = await genApi.Manage.bucketListGet({
      page_num: finalPageNum,
      page_size: finalPageSize,
      sort_expr: 'created_at DESC',
    });
    if (res.status == 200 && res.data.data) {
      total.value = res.data.data.total || 0;
      data.value = res.data.data.list || [];
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

const columns = ref<PrimaryTableCol<ApiSchemaBucket>[]>([
  { colKey: 'serial-number', title: 'NO', width: '2rem', align: 'center' },
  { colKey: 'display_name', title: '展示名' },
  { colKey: 'bucket_name', title: '储存桶名' },
  { colKey: 'endpoint_url', title: '地址', minWidth: '15rem' },
  { colKey: 'region', title: '区域' },
  { colKey: 'operation', title: '操作', width: '7rem', fixed: 'right' },
]);

const dialogMode = ref<'create' | 'edit'>('edit');
const dialogData = ref<ApiSchemaBucket>({});

function handleEdit(row: ApiSchemaBucket) {
  dialogMode.value = Object.keys(row).length == 0 ? 'create' : 'edit';
  dialogData.value = row;
  DialogManager.renderDialog(
    h(DialogCreateBucket, {
      mode: dialogMode.value,
      data: dialogData.value,
      onConfirm() {
        getBuckets();
      },
    })
  );
}

function handleConfigKey(row: ApiSchemaBucket) {
  //
}

const router = useRouter();

function handleDelete(row: ApiSchemaBucket) {
  DialogManager.commonDialog({
    title: '删除储存桶',
    content: `确定要删除储存桶 ${row.bucket_name} 吗？`,
    presetType: 'danger',
  }).then(async (res) => {
    if (res) {
      try {
        if (!row.id) return;
        const res = await genApi.Manage.bucketDeletePost(row.id);
        if (res.status == 200) {
          getBuckets();
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}
</script>

<style scoped lang="scss"></style>
