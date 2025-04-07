<template>
  <div>
    <TableTitleArea title="用户" subtitle="管理用户及其角色">
      <template #actions>
        <t-button variant="outline" shape="circle" @click="getUsers()">
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
        <template #roles="{ row }">
          <t-space size="small">
            <t-tag v-for="role in row.roles || []" :key="role" theme="primary" variant="light">
              <t-link theme="primary">{{ role.display_name }}</t-link>
            </t-tag>
          </t-space>
        </template>
        <template #operation="{ row }">
          <ActionSet>
            <t-tooltip :delay="10" content="编辑">
              <t-link theme="primary" hover="color" @click="handleEdit(row)">
                <edit-icon />
              </t-link>
            </t-tooltip>
            <t-tooltip :delay="10" content="登出">
              <t-link theme="danger" hover="color" @click="handleLogout(row)">
                <logout-icon />
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
import type { ApiSchemaUser } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import type { PrimaryTableCol } from 'tdesign-vue-next/es/table/type';
import { DialogManager } from '@/components/dialog';
import TableTitleArea from '@/pages/admin/component/TableTitleArea.vue';
import { AddIcon, DeleteIcon, EditIcon, LogoutIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import DialogCreateUser from '@/pages/admin/user/user/DialogCreateUser.vue';
import ToastManager from '@/components/toast/ToastManager.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import TableWrapper from '@/pages/admin/component/TableWrapper.vue';
import ActionSet from '@/pages/admin/component/ActionSet.vue';

const data = ref<ApiSchemaUser[]>([]);
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
    getUsers(pageNum.value, pageSize.value);
  });
});

const loading = ref(false);

async function getUsers(page?: number, size?: number) {
  const finalPageNum = page || pageNum.value || 1;
  const finalPageSize = size || pageSize.value || 10;
  try {
    loading.value = true;
    const res = await genApi.Manage.userListGet({
      page_num: finalPageNum,
      page_size: finalPageSize,
      sort_expr: 'id DESC',
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

const columns = ref<PrimaryTableCol<ApiSchemaUser>[]>([
  { colKey: 'serial-number', title: 'NO', width: '2rem', align: 'center' },
  { colKey: 'username', title: '用户名' },
  { colKey: 'roles', title: '角色' },
  { colKey: 'operation', title: '操作', width: '7rem', fixed: 'right' },
]);

const dialogMode = ref<'create' | 'edit'>('edit');
const dialogData = ref<ApiSchemaUser>({});

function handleEdit(row: ApiSchemaUser) {
  dialogMode.value = Object.keys(row).length == 0 ? 'create' : 'edit';
  dialogData.value = row;
  DialogManager.renderDialog(
    h(DialogCreateUser, {
      mode: dialogMode.value,
      data: dialogData.value,
      onConfirm() {
        getUsers();
      },
    })
  );
}

const userStore = useUserStore();

function handleLogout(row: ApiSchemaUser) {
  const logoutSelf = row.id == userStore.userId;
  DialogManager.commonDialog({
    title: '登出用户',
    content: logoutSelf ? '确定要登出自己吗？' : `确定要登出用户 ${row.username} 吗？`,
    presetType: 'danger',
  }).then(async (res) => {
    if (res) {
      try {
        if (!row.id) return;
        const res = await genApi.Manage.userLogoutPost(row.id);
        if (res.status == 200 && res.data.data) {
          ToastManager.normal('强制登出成功');
        }
      } catch (_) {
        ToastManager.danger('操作失败');
      }
    }
  });
}

function handleDelete(row: ApiSchemaUser) {
  DialogManager.commonDialog({
    title: '删除用户',
    content: `确定要删除用户 ${row.username} 吗？`,
    presetType: 'danger',
  }).then(async (res) => {
    if (res) {
      try {
        if (!row.id) return;
        const res = await genApi.Manage.userDeletePost(row.id);
        if (res.status == 200) {
          getUsers();
        }
      } catch (error) {
        console.debug(error);
      }
    }
  });
}
</script>

<style scoped lang="scss"></style>