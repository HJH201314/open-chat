<template>
  <div>
    <TableTitleArea title="接入点" subtitle="每个接入点对应一个 API 服务">
      <template #actions>
        <t-button variant="outline" shape="circle" @click="getProviders()">
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
            <t-tooltip :delay="10" content="模型">
              <t-link theme="primary" hover="color" @click="handleModel(row)">
                <RobotOne size="16" />
              </t-link>
            </t-tooltip>
            <t-tooltip :delay="10" content="API">
              <t-link theme="primary" hover="color" @click="handleConfigKey(row)">
                <Api size="16" />
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
import type { ApiSchemaProvider } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import type { PrimaryTableCol } from 'tdesign-vue-next/es/table/type';
import { DialogManager } from '@/components/dialog';
import DialogCreateProvider from '@/pages/admin/system/provider/provider/DialogCreateProvider.vue';
import TableTitleArea from '@/pages/admin/component/TableTitleArea.vue';
import { AddIcon, DeleteIcon, EditIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import DialogApiKey from '@/pages/admin/system/provider/provider/DialogApiKey.vue';
import { useRouter } from 'vue-router';
import { Api, RobotOne } from '@icon-park/vue-next';
import TableWrapper from '@/pages/admin/component/TableWrapper.vue';
import ActionSet from '@/pages/admin/component/ActionSet.vue';

const data = ref<ApiSchemaProvider[]>([]);
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
    getProviders(pageNum.value, pageSize.value);
  });
});

const loading = ref(false);

async function getProviders(page?: number, size?: number) {
  const finalPageNum = page || pageNum.value || 1;
  const finalPageSize = size || pageSize.value || 10;
  try {
    loading.value = true;
    const res = await genApi.Manage.providerListGet({
      page_num: finalPageNum,
      page_size: finalPageSize,
      sort_expr: 'id ASC',
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

const columns = ref<PrimaryTableCol<ApiSchemaProvider>[]>([
  { colKey: 'serial-number', title: 'NO', width: '2rem', align: 'center' },
  { colKey: 'name', title: '标识名', width: '15rem' },
  { colKey: 'display_name', title: '展示名' },
  { colKey: 'description', title: '描述' },
  { colKey: 'base_url', title: '接口' },
  { colKey: 'operation', title: '操作', width: '7rem', fixed: 'right' },
]);

const dialogMode = ref<'create' | 'edit'>('edit');
const dialogData = ref<ApiSchemaProvider>({});

function handleEdit(row: ApiSchemaProvider) {
  dialogMode.value = Object.keys(row).length == 0 ? 'create' : 'edit';
  dialogData.value = row;
  DialogManager.renderDialog(
    h(DialogCreateProvider, {
      mode: dialogMode.value,
      data: dialogData.value,
      onConfirm() {
        getProviders();
      },
    })
  );
}

const router = useRouter();

function handleModel(row: ApiSchemaProvider) {
  console.debug('handleModel', row);
  if (row.id) {
    router.replace({
      name: 'ManageSystemModel',
      query: {
        provider_id: row.id,
      },
    });
  }
}

function handleConfigKey(row: ApiSchemaProvider) {
  DialogManager.renderDialog(
    h(DialogApiKey, {
      data: row,
    })
  );
}

function handleDelete(row: ApiSchemaProvider) {
  DialogManager.commonDialog({
    title: '删除接入点',
    content: `确定要删除接入点 ${row.name} 吗？`,
    presetType: 'danger',
  }).then(async (res) => {
    if (res) {
      try {
        if (!row.id) return;
        const res = await genApi.Manage.providerDeletePost(row.id);
        if (res.status == 200) {
          getProviders();
        }
      } catch (error) {
        console.debug(error);
      }
    }
  });
}
</script>

<style scoped lang="scss"></style>