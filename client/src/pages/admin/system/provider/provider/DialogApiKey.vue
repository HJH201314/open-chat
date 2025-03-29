<script setup lang="ts">
import type { ApiSchemaAPIKey, ApiSchemaProvider } from '@/api/gen/data-contracts.ts';
import { ref, watch } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import genApi from '@/api/gen-api.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import type { PrimaryTableCol } from 'tdesign-vue-next/es/table/type';
import { AddIcon, CopyIcon, DeleteIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { DialogManager } from '@/components/dialog';
import DiliButton from '@/components/button/DiliButton.vue';
import ActionSet from '@/pages/admin/component/ActionSet.vue';

type T = ApiSchemaProvider;

const props = defineProps<{
  data?: T;
}>();

const columns: PrimaryTableCol<ApiSchemaProvider>[] = [
  {
    title: 'NO',
    colKey: 'serial-number',
    width: '4rem',
    align: 'center',
  },
  {
    title: 'API_KEY',
    colKey: 'key',
  },
  {
    title: '操作',
    colKey: 'operation',
    width: '7rem',
    fixed: 'right',
  },
];

const apiKeys = ref<ApiSchemaAPIKey[]>([]);
const loading = ref(false);
const loadApiKeys = async () => {
  if (!props.data?.id) return;
  loading.value = true;
  const res = await genApi.Manage.keyListProviderGet(props.data?.id, { page_num: 1, page_size: 100 });
  if (res.status == 200 && res.data.data) {
    apiKeys.value = res.data.data.list || [];
  }
  loading.value = false;
};
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      loadApiKeys();
    }
  },
  { immediate: true }
);

const getDisplayKey = (key?: string) => key ? `${key.slice(0, 4)}**********${key.slice(-4)}` : '';

function handleCopy(row: ApiSchemaAPIKey) {
  navigator.clipboard.writeText(row.key || '');
  ToastManager.normal('复制成功');
}

async function handleAdd() {
  const res = await DialogManager.inputDialog({
    title: '添加 API_KEY',
    placeholder: '请输入 API_KEY',
    confirmText: '添加',
    cancelText: '取消',
  });
  if (res.status && res.value) {
    try {
      const resp = await genApi.Manage.keyCreatePost({
        provider_id: props.data?.id || 0,
        key: res.value,
      });
      if (resp.status == 200 && resp.data.data) {
        apiKeys.value.push(resp.data.data);
        MessagePlugin.success('添加成功');
      }
    } catch (_) {
      MessagePlugin.error('添加失败');
    }
  }
}

async function handleDelete(row: ApiSchemaAPIKey) {
  try {
    if (!row.id) return;
    await genApi.Manage.keyDeletePost(row.id);
    apiKeys.value = apiKeys.value.filter((item) => item.id != row.id);
    MessagePlugin.success('删除成功');
  } catch (_) {
    MessagePlugin.error('删除失败');
  }
}
</script>

<template>
  <CommonDialog title="编辑 API_KEY" show-close :show-confirm="false" :cancel-button-props="{ text: '关闭' }">
    <template v-if="!loading" #action>
      <DiliButton type="secondary" text="新增 Key" style="width: fit-content" @click="handleAdd"><add-icon /></DiliButton>
    </template>
    <template #default>
      <div style="overflow-x: auto">
        <t-table
          ref="table"
          row-key="id"
          max-height="100%"
          :data="apiKeys"
          :columns="columns"
          :allow-resize-column-width="false"
          :hover="true"
          :bordered="true"
          :footer-affixed-bottom="true"
          :loading="loading"
          :loading-props="{
            text: '奋力加载中...',
          }"
          lazy-load
          table-layout="auto"
        >
          <template #key="{ row }">
            <span style="line-break: anywhere">{{ getDisplayKey(row.key) }}</span>
          </template>
          <template #operation="{ row }">
            <ActionSet>
              <t-link theme="primary" hover="color" @click="handleCopy(row)"><copy-icon /></t-link>
              <t-link theme="danger" hover="color" @click="handleDelete(row)"><delete-icon /></t-link>
            </ActionSet>
          </template>
        </t-table>
      </div>
    </template>
  </CommonDialog>
</template>

<style scoped lang="scss"></style>
