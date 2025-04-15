<script setup lang="ts">
import type { ApiSchemaRole } from '@/api/gen/data-contracts.ts';
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import genApi from '@/api/gen-api.ts';
import type { CommonDialogProps } from '@/components/dialog/types.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import type { FormInstanceFunctions } from 'tdesign-vue-next/es/form/type';
import { checkFormValidateResult } from '@/utils/tdesign.ts';
import type { TransferProps } from 'tdesign-vue-next';

type T = ApiSchemaRole;

const props = defineProps<{
  data?: T;
  mode: 'create' | 'edit';
}>();

const title = computed(() => `${props.mode == 'create' ? '创建' : '编辑'}角色`);
const subtitle = computed(() => (props.mode == 'edit' && props.data?.id ? `(ID: ${props.data?.id})` : ''));
const formRef = useTemplateRef<FormInstanceFunctions<T>>('form');

const loadingPermissions = ref(false);
const getPermissions = async () => {
  try {
    loadingPermissions.value = true;
    const res = await genApi.Manage.permissionListGet({
      page_num: 1,
      page_size: 99999, // TODO
    });
    if (res.status == 200 && res.data.data) {
      permissionList.value = (res.data.data.list || []).map((item) => ({
        label: `${item.name} (${item.path})`,
        value: item.name || 0,
      }));
    }
  } finally {
    loadingPermissions.value = false;
  }
};

// 角色处理
const permissionList = ref<TransferProps['data']>([]);
const permissionNames = ref<string[]>([]);
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
  permissionNames.value = newTargetValue as string[];
};

const formData: T & {
  [key: string]: any;
} = reactive({
  name: '',
  display_name: '',
  description: '',
  active: true,
});
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      formData.name = newData.name || '';
      formData.display_name = newData.display_name || '';
      formData.description = newData.description || '';
      formData.active = newData.active || true;
      permissionNames.value = (newData.permissions || []).map((item) => item.name || '');
    }
    getPermissions();
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
  console.debug(permissionNames.value);
  if (props.mode == 'create') {
    await genApi.Manage.roleCreatePost({
      ...formData,
      permissions: permissionNames.value.map((item) => ({ name: item }) as ApiSchemaRole),
    });
  } else {
    if (!props.data?.id) return;
    const updateData: Partial<T> = {};
    for (const key in formData) {
      if (formData[key] != props.data[key as keyof T]) {
        updateData[key as keyof T] = formData[key];
      }
    }
    if (
      JSON.stringify(permissionNames.value.sort()) !=
      JSON.stringify(props.data?.permissions?.map((item) => item.name).sort())
    ) {
      updateData.permissions = permissionNames.value.map((item) => ({ name: item }) as ApiSchemaRole);
    }
    // do update
    if (Object.keys(updateData).length != 0) {
      await genApi.Manage.roleUpdatePost(props.data?.id, {
        data: updateData,
        updates: Object.keys(updateData),
      });
    }
  }
};
</script>

<template>
  <CommonDialog :title="title" :subtitle="subtitle" :confirm-handler="handleConfirm" :dialog-style="{ width: '789px' }">
    <template #default>
      <t-form ref="form" :data="formData" style="margin-bottom: 1rem">
        <t-form-item label="标识名" name="name" :rules="[{ required: mode == 'create' }]">
          <t-input v-model="formData.name" placeholder="标识名" :disabled="mode == 'edit'"></t-input>
        </t-form-item>
        <t-form-item label="展示名" name="display_name" :rules="[{ required: true }]">
          <t-input v-model="formData.display_name" placeholder="展示名"></t-input>
        </t-form-item>
        <t-form-item label="描述" name="description">
          <t-input v-model="formData.description" placeholder="描述"></t-input>
        </t-form-item>
        <t-form-item label="权限" name="permissions" label-align="top">
          <t-transfer
            v-model="permissionNames"
            :data="permissionList"
            :search="true"
            :title="['可选权限', '已选权限']"
            :disabled="formData.name == 'SUPER_ADMIN' || loadingPermissions"
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
