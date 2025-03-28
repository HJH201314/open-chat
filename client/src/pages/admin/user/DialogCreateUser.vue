<script setup lang="ts">
import type { ApiSchemaRole, ApiSchemaUser } from '@/api/gen/data-contracts.ts';
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import genApi from '@/api/gen-api.ts';
import type { CommonDialogProps } from '@/components/dialog/types.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import type { FormInstanceFunctions } from 'tdesign-vue-next/es/form/type';
import { checkFormValidateResult } from '@/utils/tdesign.ts';
import type { TransferValue } from 'tdesign-vue-next/es/transfer/type';
import type { TransferProps } from 'tdesign-vue-next';

type T = ApiSchemaUser;

const props = defineProps<{
  data?: T;
  mode: 'create' | 'edit';
}>();

const title = computed(() => `${props.mode == 'create' ? '创建' : '编辑'}用户`);
const formRef = useTemplateRef<FormInstanceFunctions<T>>('form');

const getRoles = async () => {
  const res = await genApi.Manage.roleListGet({
    page_num: 1,
    page_size: 99999, // TODO
  });
  if (res.status == 200 && res.data.data) {
    roleList.value = (res.data.data.list || []).map((item) => ({
      label: item.name || '',
      value: item.id || 0,
    }));
  }
}

// 角色处理
const roleList = ref<TransferProps['data']>([])
const roleIds = ref<number[]>([])
const checked = ref<TransferProps['checked']>([]);
const handleCheckedChange: TransferProps['onCheckedChange'] = ({
                                                                 checked: checkedVal,
                                                                 sourceChecked,
                                                                 targetChecked,
                                                                 type,
                                                               }) => {
  console.log('handleCheckedChange', {
    checkedVal,
    sourceChecked,
    targetChecked,
    type,
  });
  checked.value = checkedVal;
};
const handleChange: TransferProps['onChange'] = (newTargetValue) => {
  console.log('newTargetValue', newTargetValue);
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


const handleConfirm: CommonDialogProps['confirmHandler'] = async (_, prevent) => {
  const res = (await formRef.value?.validate()) || {};
  if (!checkFormValidateResult(res)) {
    ToastManager.danger('请正确填写数据');
    prevent();
    return;
  }
  if (props.mode == 'create') {
    await genApi.Manage.userCreatePost({
      username: formData.username,
      password: formData.password,
      roles: roleIds.value.map((item) => ({ id: item } as ApiSchemaRole)),
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
      updateData.roles = roleIds.value.map((item) => ({ id: item } as ApiSchemaRole));
    }
    await genApi.Manage.userUpdatePost(props.data?.id, updateData);
  }
};
</script>

<template>
  <CommonDialog :title="title" :confirm-handler="handleConfirm">
    <template #default>
      <t-form ref="form" :data="formData" label-align="top" style="margin: 1rem 0">
        <t-form-item label="用户名" name="username" :rules="[{ required: true }]">
          <t-input v-model="formData.username" placeholder="用户名"></t-input>
        </t-form-item>
        <t-form-item label="密码" name="password" :rules="[{ required: mode == 'create' }]">
          <t-input v-model="formData.password" placeholder="密码，不修改则留空"></t-input>
        </t-form-item>
        <t-form-item label="角色" name="roles">
          <t-transfer
            v-model="roleIds"
            :data="roleList"
            :operation="['移除', '添加']"
            @change="handleChange"
            @checked-change="handleCheckedChange"
          >
            <template #title="props">
              <div>{{ props.type === 'target' ? '可选' : '已选' }}</div>
            </template>
            <template #footer="props">
              <div style="padding: 12px; border-top: 1px solid #e7e7e7">
                <span v-if="props.type === 'source'">可选角色</span>
                <span v-else>已选角色</span>
              </div>
            </template>
          </t-transfer>
        </t-form-item>
      </t-form>
    </template>
  </CommonDialog>
</template>

<style scoped lang="scss"></style>
