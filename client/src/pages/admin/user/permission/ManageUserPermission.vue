<template>
  <div>
    <TableTitleArea title="权限" subtitle="以接口为粒度的权限控制">
      <template #actions>
        <span style="color: var(--text-secondary)">权限由系统生成，不可修改</span>
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
        <template #active="{ row }">
          <t-switch :value="row.active" @change="(v) => handleActiveChange(row, v)" />
        </template>
      </t-table>
    </TableWrapper>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref, watchEffect } from 'vue';
import type { ApiSchemaPermission } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import type { PrimaryTableCol } from 'tdesign-vue-next/es/table/type';
import TableTitleArea from '@/pages/admin/component/TableTitleArea.vue';
import TableWrapper from '@/pages/admin/component/TableWrapper.vue';

const data = ref<ApiSchemaPermission[]>([]);
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

async function getPermissions(page?: number, size?: number) {
  const finalPageNum = page || pageNum.value || 1;
  const finalPageSize = size || pageSize.value || 10;
  try {
    loading.value = true;
    const res = await genApi.Manage.permissionListGet({
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
      getPermissions(pageNum.value, pageSize.value);
    });
  }, 0);
});

const columns: PrimaryTableCol<ApiSchemaPermission>[] = [
  { colKey: 'serial-number', title: 'NO', width: '2rem', align: 'center' },
  { colKey: 'name', title: '标识名' },
  { colKey: 'path', title: '路径' },
  { colKey: 'description', title: '描述', minWidth: '12rem' },
  { colKey: 'module', title: '模块' },
  { colKey: 'active', title: '启用' },
];

async function handleActiveChange(row: ApiSchemaPermission, v: boolean) {
  try {
    if (!row.id) return;
    const res = await genApi.Manage.permissionUpdatePost(row.id, {
      active: v,
    });
    if (res.status == 200) {
      row.active = v;
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped lang="scss"></style>
