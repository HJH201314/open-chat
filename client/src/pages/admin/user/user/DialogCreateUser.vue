<script setup lang="ts">
import type { ApiSchemaRole, ApiSchemaUser } from '@/api/gen/data-contracts.ts';
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import genApi from '@/api/gen-api.ts';
import type { CommonDialogProps } from '@/components/dialog/types.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import type { FormInstanceFunctions } from 'tdesign-vue-next/es/form/type';
import { checkFormValidateResult } from '@/utils/tdesign.ts';
import type { TransferProps } from 'tdesign-vue-next';
import { useUserStore } from '@/store/useUserStore.ts';
import { DialogManager } from '@/components/dialog';

type T = ApiSchemaUser;

const props = defineProps<{
  data?: T;
  mode: 'create' | 'edit';
}>();

const title = computed(() => `${props.mode == 'create' ? '创建' : '编辑'}用户`);
const subtitle = computed(() => (props.mode == 'edit' && props.data?.id ? `(UID: ${props.data?.id})` : ''));
const formRef = useTemplateRef<FormInstanceFunctions<T>>('form');

const getRoles = async () => {
  const res = await genApi.Manage.roleListGet({
    page_num: 1,
    page_size: 99999, // TODO
  });
  if (res.status == 200 && res.data.data) {
    roleList.value = (res.data.data.list || []).map((item) => ({
      label: item.display_name || '',
      value: item.id || 0,
    }));
  }
};

// 角色处理
const roleList = ref<TransferProps['data']>([]);
const roleIds = ref<number[]>([]);
const checked = ref<TransferProps['checked']>([]);
const handleCheckedChange: TransferProps['onCheckedChange'] = ({
  checked: checkedVal,
  sourceChecked,
  targetChecked,
  type,
}) => {
  console.debug('handleCheckedChange', {
    checkedVal,
    sourceChecked,
    targetChecked,
    type,
  });
  checked.value = checkedVal;
};
const handleChange: TransferProps['onChange'] = (newTargetValue) => {
  roleIds.value = newTargetValue as number[];
};

const formData: T & {
  [key: string]: any;
} = reactive({});
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      formData.username = newData.username || '';
      roleIds.value = (newData.roles || []).map((item) => item.id || 0);
    }
    getRoles();
  },
  { immediate: true }
);

const userStore = useUserStore();

const handleConfirm: CommonDialogProps['confirmHandler'] = async (_, prevent) => {
  const res = (await formRef.value?.validate()) || {};
  if (!checkFormValidateResult(res)) {
    ToastManager.danger('请正确填写数据');
    prevent();
    return;
  }
  console.debug(roleIds.value);
  // return;
  if (props.mode == 'create') {
    await genApi.Manage.userCreatePost({
      username: formData.username,
      password: formData.password,
      roles: roleIds.value.map((item) => ({ id: item }) as ApiSchemaRole),
    });
  } else {
    if (!props.data?.id) return;
    const updateData: Partial<T> = {};
    for (const key in formData) {
      if (formData[key] != props.data[key as keyof T]) {
        updateData[key as keyof T] = formData[key];
      }
    }
    if (JSON.stringify(roleIds.value.sort()) != JSON.stringify(props.data?.roles?.map((item) => item.id).sort())) {
      if (userStore.userId == props.data?.id) {
        const res = await DialogManager.commonDialog({
          title: '修改？',
          content: '你正在修改自己的权限，请再三确认！',
          presetType: 'danger',
        });
        if (!res) return;
      }
      updateData.roles = roleIds.value.map((item) => ({ id: item }) as ApiSchemaRole);
    }
    // do update
    if (Object.keys(updateData).length != 0) {
      await genApi.Manage.userUpdatePost(props.data?.id, updateData);
    }
  }
};
</script>

<template>
  <CommonDialog :title="title" :subtitle="subtitle" :confirm-handler="handleConfirm" :dialog-style="{ width: '789px' }">
    <template #default>
      <t-form ref="form" :data="formData" label-align="top" style="margin-bottom: 1rem">
        <t-form-item label="用户名" name="username" :rules="[{ required: true }]">
          <t-input v-model="formData.username" placeholder="用户名" autocomplete="new-password"></t-input>
        </t-form-item>
        <t-form-item label="密码" name="password" :rules="[{ required: mode == 'create' }]">
          <t-input
            v-model="formData.password"
            type="password"
            placeholder="密码，不修改则留空"
            autocomplete="new-password"
          ></t-input>
        </t-form-item>
        <t-form-item label="角色" name="roles">
          <t-transfer
            v-model="roleIds"
            :data="roleList"
            :title="['可选角色', '已选角色']"
            :operation="['移除', '添加']"
            style="width: 100%"
            @change="handleChange"
            @checked-change="handleCheckedChange"
          ></t-transfer>
        </t-form-item>
      </t-form>
    </template>
  </CommonDialog>
</template>

<style scoped lang="scss"></style>
