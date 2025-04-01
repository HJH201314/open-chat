<script setup lang="ts">
import type { ApiSchemaBucket } from '@/api/gen/data-contracts.ts';
import { computed, reactive, useTemplateRef, watch } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import genApi from '@/api/gen-api.ts';
import type { CommonDialogProps } from '@/components/dialog/types.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import type { FormInstanceFunctions } from 'tdesign-vue-next/es/form/type';
import { checkFormValidateResult } from '@/utils/tdesign.ts';

type T = ApiSchemaBucket;

const props = defineProps<{
  data?: T;
  mode: 'create' | 'edit';
}>();

const title = computed(() => `${props.mode == 'create' ? '创建' : '编辑'}储存桶`);
const subtitle = computed(() => (props.mode == 'edit' && props.data?.id ? `(ID: ${props.data?.id})` : ''));
const formRef = useTemplateRef<FormInstanceFunctions<T>>('form');

const formData: T & {
  [key: string]: any;
} = reactive({
  bucket_name: '',
  display_name: '',
  endpoint_url: '',
  region: '',
});
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      formData.bucket_name = newData.bucket_name || '';
      formData.display_name = newData.display_name || '';
      formData.endpoint_url = newData.endpoint_url || '';
      formData.region = newData.region || '';
      formData.access_key_id = newData.access_key_id || '';
      formData.secret_access_key = newData.secret_access_key || '';
    }
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
    await genApi.Manage.bucketCreatePost({
      bucket_name: formData.bucket_name,
      display_name: formData.display_name,
      endpoint_url: formData.endpoint_url,
      region: formData.region,
      access_key_id: formData.access_key_id,
      secret_access_key: formData.secret_access_key,
    });
  } else {
    if (!props.data?.id) return;
    const updateData: Partial<T> = {};
    for (const key in formData) {
      if (formData[key] != props.data[key as keyof T]) {
        updateData[key as keyof T] = formData[key];
      }
    }
    await genApi.Manage.bucketUpdatePost(props.data?.id, {
      data: updateData,
      updates: Object.keys(updateData),
    });
  }
};
</script>

<template>
  <CommonDialog :title="title" :subtitle="subtitle" :confirm-handler="handleConfirm">
    <template #default>
      <t-form ref="form" label-align="top" :data="formData" style="margin-bottom: 1rem">
        <t-form-item label="展示名" name="display_name" :rules="[{ required: true }]">
          <t-input v-model="formData.display_name" placeholder="展示名"></t-input>
        </t-form-item>
        <t-form-item label="Bucket Name" name="bucket_name" :rules="[{ required: true }]">
          <t-input v-model="formData.bucket_name" placeholder="储存桶名，从服务商处获得"></t-input>
        </t-form-item>
        <t-form-item label="Endpoint URL" name="endpoint_url" :rules="[{ required: true }]">
          <t-input v-model="formData.endpoint_url" placeholder="节点 URL"></t-input>
        </t-form-item>
        <t-form-item label="Region" name="region" :rules="[{ required: true }]">
          <t-input v-model="formData.region" placeholder="区域"></t-input>
        </t-form-item>
        <t-form-item label="AccessKeyID" name="access_key_id" :rules="[{ required: true }]">
          <t-input v-model="formData.access_key_id" type="password" placeholder="AccessKeyID"></t-input>
        </t-form-item>
        <t-form-item label="SecretAccessKey" name="secret_access_key" :rules="[{ required: true }]">
          <t-input v-model="formData.secret_access_key" type="password" placeholder="SecretAccessKey"></t-input>
        </t-form-item>
      </t-form>
    </template>
  </CommonDialog>
</template>

<style scoped lang="scss"></style>
