<script setup lang="ts">

import UserItemCard from '@/pages/admin/manage/user/components/UserItemCard.vue';
import DiliButton from '@/components/button/DiliButton.vue';

import { Left, Minus, Plus, Right } from '@icon-park/vue-next';
import { onMounted, reactive, ref } from 'vue';
import api from '@/api';
import ToastManager from '@/components/toast/ToastManager.ts';
import CusInput from '@/components/input/CusInput.vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import type { CommonDialogExpose } from '@/components/dialog/types.ts';
import { DialogManager } from '@/components/dialog';

onMounted(() => {
  console.log('hello');
  Promise.all([
    getUsers(),
  ]);
});

const form = reactive({
  pageSize: 100,
  pageNum: 1,
});

const users = ref<API.UserQueryResult[]>([]);

async function getUsers(): Promise<API.UserQueryResult[]> {
  const res = await api.manage.getUsers(form.pageNum, form.pageSize);
  if (res.data.users) {
    if (res.data.users.length > 0) {
      users.value = res.data.users;
      return users.value;
    } else {
      return [];
    }
  }
  return [];
}

async function handlePageChange(delta: number) {
  if (form.pageNum + delta < 1) return;
  form.pageNum += delta;
  const res = await getUsers();
  if (!res.length) {
    ToastManager.danger('没有更多了');
    form.pageNum -= delta;
  }
}

/* Edit相关 */
const dialogRef = ref<CommonDialogExpose>();

const editUsername = ref('');
const editForm = reactive({
  username: '',
  password: '',
  permission: 0,
});

function handleAdd() {
  dialogRef.value?.show();
  editUsername.value = '';
  editForm.permission = 1;
  editForm.username = '';
  editForm.password = '';
}

async function handleAddConfirm(close: CommonDialogExpose['close']) {
  console.log(editForm);
  if (!editForm.username || !editForm.password) {
    ToastManager.info('请输入信息');
    return;
  }
  try {
    const res = await api.manage.addUsers({
      username: editForm.username,
      password: editForm.password,
      permission: editForm.permission,
    });
    if (res.data.status == 200) {
      ToastManager.normal('新增成功!');
      getUsers();
    } else {
      ToastManager.danger('新增失败!');
    }
  } catch (e) {
    ToastManager.danger('新增失败!');
  } finally {
    close();
  }
}

function handleEdit(user: API.UserVO) {
  console.log(user);
  dialogRef.value?.show();
  editUsername.value = user.username!;
  editForm.username = user.username ?? '';
  editForm.password = user.password ?? '';
  editForm.permission = user.permission ?? 0;
}

async function handleEditConfirm(close: CommonDialogExpose['close']) {
  try {
    const res = await api.manage.updateUser(editUsername.value, {
      username: editForm.username,
      password: editForm.password,
      permission: editForm.permission,
    });
    if (res.data.status == 200) {
      ToastManager.normal('修改成功!');
      getUsers();
    } else {
      ToastManager.danger('修改失败!');
    }
  } catch (e) {
    ToastManager.danger('修改失败!');
  } finally {
    close();
  }
}

async function handleDelete(user: API.UserVO) {
  const dialogRes = await DialogManager.commonDialog({
    title: '删除用户',
    content: `确定要删除用户 ${user.username} 吗？`,
  });
  if (!dialogRes) return;
  try {
    const res = await api.manage.deleteUser(user.id!);
    if (res.data.status == 200) {
      ToastManager.info('删除成功!');
      getUsers();
    } else {
      ToastManager.danger('删除失败!');
    }
  } catch (e) {
    ToastManager.danger('删除失败!');
  }
}

function handlePermissionChange(delta: number) {
  if ([0, 1, 2].indexOf(editForm.permission + delta) != -1) {
    editForm.permission = editForm.permission + delta;
  } else {
    ToastManager.warning(`权限不能再${delta > 0 ? '大' : '小'}啦~`);
  }
}

function getPermissionName(permissionId: number) {
  switch (permissionId) {
    case 0:
      return '访客';
    case 1:
      return '用户';
    case 2:
      return '管理员';
  }
}
</script>

<template>
  <div class="page">
    <section class="page-title">
      用户 | User
      <div class="page-control">
        <DiliButton text="New" type="primary" @click="handleAdd"></DiliButton>
        <DiliButton @click="handlePageChange(-1)">
          <Left size="1rem"/>
        </DiliButton>
        <span>{{ (form.pageNum - 1) * 10 + 1 }}-{{ (form.pageNum - 1) * 10 + users.length }}</span>
        <DiliButton @click="handlePageChange(1)">
          <Right/>
        </DiliButton>
      </div>
    </section>
    <section class="user-list">
      <UserItemCard
          v-for="user in users" :id="user[0]" :key="user[0]"
          class="user-list-item" :username="user[1]" :password="user[2]" :permission="user[3]"
          @edit="(u) => handleEdit(u)" @delete="(u) => handleDelete(u)"/>
    </section>
    <CommonDialog
        ref="dialogRef" title="修改用户" :modal-style="{'width': '25rem'}"
        :on-confirm="(c) => editUsername ? handleEditConfirm(c) : handleAddConfirm(c)">
      <div class="input-container">
        <div class="input-item">
          <span class="input-item__label">用户名</span>
          <CusInput v-model="editForm.username" class="input-item__input" placeholder="请输入用户名"/>
        </div>
        <div class="input-item">
          <span class="input-item__label">新密码</span>
          <CusInput v-model="editForm.password" class="input-item__input" placeholder="请输入新密码"/>
        </div>
        <div class="input-item">
          <span class="input-item__label">权限</span>
          <div class="input-item__input">
            <dili-button @click="handlePermissionChange(-1)">
              <minus/>
            </dili-button>
            <span>{{ editForm.permission }} ({{ getPermissionName(editForm.permission) }})</span>
            <dili-button @click="handlePermissionChange(1)">
              <plus/>
            </dili-button>
          </div>
        </div>
      </div>
    </CommonDialog>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/extension' as *;

.page {
  height: 100%;
  padding: .5rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;

  &-title {
    @include page-title;
    display: flex;
    align-items: center;
  }

  &-control {
    font-size: 1rem;
    margin-left: auto;
    display: flex;
    gap: .5rem;
    align-items: center;
  }

  .user-list {
    flex: 1;
    display: flex;
    gap: .5rem;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    overflow: auto;

    &-item {
      @media screen and (min-width: 768px) {
        width: calc(33% - .5rem);
      }
      @media screen and (max-width: 768px) {
        width: 100%;
      }
    }
  }
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.input-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__label {
    flex: 2;
  }

  &__input {
    flex: 7;
    display: flex;
    gap: .5rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
  }
}
</style>