<template>
  <div>
    <TableTitleArea title="模型聚合" subtitle="聚合来自不同供应商的相同模型">
      <template #actions>
        <t-button variant="outline" shape="circle" @click="getModelCollections()">
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
        :max-height="maxHeight"
        table-layout="auto"
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
        <template #models="{ row }">
          <t-link theme="primary" content="查看" @click="ToastManager.danger('未完成')" />
        </template>
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
import type { ApiSchemaModelCollection, ApiSchemaRole } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import type { PrimaryTableCol } from 'tdesign-vue-next/es/table/type';
import { DialogManager } from '@/components/dialog';
import TableTitleArea from '@/pages/admin/component/TableTitleArea.vue';
import { AddIcon, DeleteIcon, EditIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import TableWrapper from '@/pages/admin/component/TableWrapper.vue';
import ActionSet from '@/pages/admin/component/ActionSet.vue';
import DialogCreateCollection from '@/pages/admin/system/collection/DialogCreateCollection.vue';
import ToastManager from '@/components/toast/ToastManager.ts';

const data = ref<ApiSchemaRole[]>([]);
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

const loading = ref(false);

async function getModelCollections(page?: number, size?: number) {
  const finalPageNum = page || pageNum.value || 1;
  const finalPageSize = size || pageSize.value || 10;
  try {
    loading.value = true;
    const res = await genApi.Manage.collectionListGet({
      page_num: finalPageNum,
      page_size: finalPageSize,
      sort_expr: 'id ASC',
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

onMounted(() => {
  setTimeout(() => {
    // 监听 page_num、page_size 变化
    watchEffect(() => {
      getModelCollections(pageNum.value, pageSize.value);
    });
  }, 0);
});

const columns: PrimaryTableCol<ApiSchemaModelCollection>[] = [
  { colKey: 'serial-number', title: 'NO', width: '2rem', align: 'center' },
  { colKey: 'name', title: '标识名' },
  { colKey: 'display_name', title: '展示名', minWidth: '8rem' },
  { colKey: 'description', title: '描述', minWidth: '8rem' },
  { colKey: 'models', title: '模型集合' },
  { colKey: 'operation', title: '操作', width: '4rem', fixed: 'right' },
];

const dialogMode = ref<'create' | 'edit'>('edit');
const dialogData = ref<ApiSchemaModelCollection>({});

function handleEdit(row: ApiSchemaModelCollection) {
  dialogMode.value = Object.keys(row).length == 0 ? 'create' : 'edit';
  dialogData.value = row;
  DialogManager.renderDialog(
    h(DialogCreateCollection, {
      mode: dialogMode.value,
      data: dialogData.value,
      onConfirm() {
        getModelCollections();
      },
    })
  );
}

function handleDelete(row: ApiSchemaModelCollection) {
  DialogManager.commonDialog({
    title: '删除模型集合',
    content: `确定要删除模型集合 ${row.name} 吗？`,
    presetType: 'danger',
  }).then(async (res) => {
    if (res) {
      try {
        if (!row.id) return;
        const res = await genApi.Manage.collectionDeletePost(row.id);
        if (res.status == 200) {
          getModelCollections();
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}
</script>

<style scoped lang="scss"></style>