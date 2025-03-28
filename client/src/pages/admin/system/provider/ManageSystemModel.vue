<template>
  <t-space direction="vertical">
    <TableTitleArea title="模型" subtitle="每个模型定义在接入点中的名称和默认参数">
      <template #actions>
        <t-button variant="outline" shape="circle" @click="getModels()">
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
    <div :style="{ 'overflow-x': 'auto', width: `${tableWidth}px` }">
      <t-table
        ref="table"
        row-key="id"
        size="small"
        max-height="100%"
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
        <template #operation="{ row }">
          <t-space size="medium">
            <t-link theme="primary" hover="color" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" hover="color" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
        <template #provider-title>
          <t-space size="small">
            接入点
            <t-link v-if="providerId" theme="primary" @click="() => handleUnselectProvider()">取消筛选</t-link>
          </t-space>
        </template>
        <template #provider="{ row }">
          <t-link theme="primary" @click="handleClickProvider(row)">{{ row.provider?.name || '-' }}</t-link>
        </template>
        <template #config="{ row }">
          <t-popup :content="getConfigContent(row)" :overlay-inner-style="{ 'white-space': 'pre' }">
            <t-link theme="primary"> 查看 </t-link>
          </t-popup>
        </template>
      </t-table>
    </div>
  </t-space>
</template>

<script setup lang="tsx">
import { computed, h, inject, onMounted, reactive, ref, useTemplateRef, watchEffect } from 'vue';
import type { ApiSchemaModel } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import { AdminLayoutContentSizeKey } from '@/pages/admin/types.ts';
import type { PrimaryTableCol } from 'tdesign-vue-next/es/table/type';
import { DialogManager } from '@/components/dialog';
import DialogCreateProvider from '@/pages/admin/system/provider/DialogCreateProvider.vue';
import TableTitleArea from '@/pages/admin/component/TableTitleArea.vue';
import { AddIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import router from '@/plugins/router.ts';
import { useRouteQuery } from '@vueuse/router';
import DialogCreateModel from '@/pages/admin/system/provider/DialogCreateModel.vue';

const contentSize = inject(AdminLayoutContentSizeKey);
const tableWidth = computed(() => contentSize?.width?.value || 1200);

const data = ref<ApiSchemaModel[]>([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
const providerId = useRouteQuery<number, number>('provider_id', 0);
const pagination = reactive({
  pageSizeOptions: [5, 10, 15, 20],
  defaultCurrent: pageNum,
  defaultPageSize: pageSize,
  onChange(param: { current: number, previous: numebr, pageSize: number }) {
    pageNum.value = param.current;
    pageSize.value = param.pageSize;
  },
  total,
});

const loading = ref(false);

async function getModels(page?: number, size?: number, provider?: number) {
  const finalProvider = provider || providerId.value;
  const finalPageNum = page || pageNum.value || 1;
  const finalPageSize = size || pageSize.value || 10;
  try {
    loading.value = true;
    const requester = (p: number | undefined, conf: Parameters<typeof genApi.Manage.modelProviderGet>[1]) =>
      p ? genApi.Manage.modelProviderGet(p, conf) : genApi.Manage.modelListGet(conf);
    const res = await requester(finalProvider, {
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

onMounted(() => {
  // 监听 page_num、page_size、provider_id 变化
  watchEffect(() => {
    getModels(pageNum.value, pageSize.value, providerId.value);
  });
});

const columns: PrimaryTableCol<ApiSchemaModel>[] = [
  { colKey: 'serial-number', title: 'NO', width: '2rem', align: 'center' },
  { colKey: 'provider', title: 'provider-title' },
  { colKey: 'name', title: '标识名', width: '15rem' },
  { colKey: 'display_name', title: '展示名' },
  { colKey: 'description', title: '描述' },
  { colKey: 'config', title: '默认配置' },
  { colKey: 'operation', title: '操作', fixed: 'right' },
];

function getConfigContent(row: ApiSchemaModel) {
  const config = row.config || {};
  if (Object.keys(config).length == 0) {
    return '-';
  } else {
    return Object.entries(config).map(([key, value]) => `${key}: ${value}`).join('\n');
  }
}

const dialogMode = ref<'create' | 'edit'>('edit');
const dialogData = ref<ApiSchemaModel>({});

function handleEdit(row: ApiSchemaModel) {
  dialogMode.value = Object.keys(row).length == 0 ? 'create' : 'edit';
  dialogData.value = row;
  DialogManager.renderDialog(
    h(DialogCreateModel, {
      mode: dialogMode.value,
      data: dialogData.value,
      forceProviderId: providerId.value ? Number(providerId.value) : undefined,
      onConfirm() {
        getModels();
      },
    })
  );
}

function handleDelete(row: ApiSchemaModel) {
  DialogManager.commonDialog({
    title: '删除模型',
    content: `确定要删除模型 ${row.name} 吗？`,
    presetType: 'danger',
  }).then(async (res) => {
    if (res) {
      try {
        if (!row.id) return;
        const res = await genApi.Manage.modelDeletePost(row.id);
        if (res.status == 200) {
          getModels();
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}

function handleUnselectProvider() {
  router.replace({
    name: 'ManageSystemModel',
    query: {},
  });
}

function handleClickProvider(row: ApiSchemaModel) {
  if (row.provider_id) {
    router.replace({
      name: 'ManageSystemModel',
      query: {
        provider_id: row.provider_id,
      },
    });
  }
}
</script>

<style scoped lang="scss"></style>