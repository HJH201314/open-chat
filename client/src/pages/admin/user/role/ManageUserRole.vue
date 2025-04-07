<template>
  <div>
    <TableTitleArea title="角色" subtitle="角色将一系列权限聚合并统一分配给用户">
      <template #actions>
        <t-button variant="outline" shape="circle" @click="getRoles()">
          <template #icon>
            <refresh-icon />
          </template>
        </t-button>
        <t-button theme="primary" @click="handleEdit({})">
          <template #icon>
            <add-icon />
          </template>
          新建
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
        <template #active="{ row }">
          <t-switch :value="row.active" @change="(v) => handleActiveChange(row, v)" />
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
import type { ApiSchemaRole } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import type { PrimaryTableCol } from 'tdesign-vue-next/es/table/type';
import { DialogManager } from '@/components/dialog';
import TableTitleArea from '@/pages/admin/component/TableTitleArea.vue';
import { AddIcon, DeleteIcon, EditIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import DialogCreateRole from '@/pages/admin/user/role/DialogCreateRole.vue';
import TableWrapper from '@/pages/admin/component/TableWrapper.vue';
import ActionSet from '@/pages/admin/component/ActionSet.vue';

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

async function getRoles(page?: number, size?: number) {
  const finalPageNum = page || pageNum.value || 1;
  const finalPageSize = size || pageSize.value || 10;
  try {
    loading.value = true;
    const res = await genApi.Manage.roleListGet({
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

onMounted(() => {
  setTimeout(() => {
    // 监听 page_num、page_size 变化
    watchEffect(() => {
      getRoles(pageNum.value, pageSize.value);
    });
  }, 0);
});

const columns: PrimaryTableCol<ApiSchemaRole>[] = [
  { colKey: 'serial-number', title: 'NO', width: '2rem', align: 'center' },
  { colKey: 'name', title: '标识名' },
  { colKey: 'display_name', title: '展示名', minWidth: '8rem' },
  { colKey: 'description', title: '描述', minWidth: '8rem' },
  { colKey: 'active', title: '是否启用' },
  { colKey: 'operation', title: '操作', width: '4rem', fixed: 'right' },
];

const dialogMode = ref<'create' | 'edit'>('edit');
const dialogData = ref<ApiSchemaRole>({});

async function handleActiveChange(row: ApiSchemaRole, v: boolean) {
  try {
    if (!row.id) return;
    const res = await genApi.Manage.roleUpdatePost(row.id, {
      data: {
        active: v,
      },
      updates: ['active'],
    });
    if (res.status == 200) {
      row.active = v;
    }
  } catch (error) {
    console.debug(error);
  }
}

function handleEdit(row: ApiSchemaRole) {
  dialogMode.value = Object.keys(row).length == 0 ? 'create' : 'edit';
  dialogData.value = row;
  DialogManager.renderDialog(
    h(DialogCreateRole, {
      mode: dialogMode.value,
      data: dialogData.value,
      onConfirm() {
        getRoles();
      },
    })
  );
}

function handleDelete(row: ApiSchemaRole) {
  DialogManager.commonDialog({
    title: '删除模型',
    content: `确定要删除模型 ${row.name} 吗？`,
    presetType: 'danger',
  }).then(async (res) => {
    if (res) {
      try {
        if (!row.id) return;
        const res = await genApi.Manage.roleDeletePost(row.id);
        if (res.status == 200) {
          getRoles();
        }
      } catch (error) {
        console.debug(error);
      }
    }
  });
}
</script>

<style scoped lang="scss"></style>