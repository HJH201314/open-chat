<script setup lang="ts">
import type { ApiSchemaProvider } from '@/api/gen/data-contracts.ts';
import { computed, reactive, useTemplateRef, watch } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import genApi from '@/api/gen-api.ts';
import type { CommonDialogProps } from '@/components/dialog/types.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import type { FormInstanceFunctions } from 'tdesign-vue-next/es/form/type';
import { checkFormValidateResult } from '@/utils/tdesign.ts';

type T = ApiSchemaProvider;

const props = defineProps<{
  data?: T;
  mode: 'create' | 'edit';
}>();

const title = computed(() => `${props.mode == 'create' ? '创建' : '编辑'}接入点`);
const subtitle = computed(() => (props.mode == 'edit' && props.data?.id ? `(ID: ${props.data?.id})` : ''));
const formRef = useTemplateRef<FormInstanceFunctions<T>>('form');

const formData: T & {
  [key: string]: any;
} = reactive({
  name: '',
  display_name: '',
  description: '',
  base_url: '',
});
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      formData.name = newData.name || '';
      formData.display_name = newData.display_name || '';
      formData.description = newData.description || '';
      formData.base_url = newData.base_url || '';
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
    await genApi.Manage.providerCreatePost({
      name: formData.name,
      display_name: formData.display_name,
      description: formData.description,
      base_url: formData.base_url,
    });
  } else {
    if (!props.data?.id) return;
    const updateData: Partial<T> = {};
    for (const key in formData) {
      if (formData[key] != props.data[key as keyof T]) {
        updateData[key as keyof T] = formData[key];
      }
    }
    await genApi.Manage.providerUpdatePost(props.data?.id, updateData);
  }
};
</script>

<template>
  <CommonDialog :title="title" :subtitle="subtitle" :confirm-handler="handleConfirm">
    <template #default>
      <t-form ref="form" :data="formData" style="margin-bottom: 1rem">
        <t-form-item label="标识名" name="name" :rules="[{ required: true }]">
          <t-input v-model="formData.name" placeholder="标识名，建议为英文简称"></t-input>
        </t-form-item>
        <t-form-item label="展示名" name="display_name" :rules="[{ required: true }]">
          <t-input v-model="formData.display_name" placeholder="用户看到的名称"></t-input>
        </t-form-item>
        <t-form-item label="描述" name="description">
          <t-input v-model="formData.description" placeholder="给自己看的描述"></t-input>
        </t-form-item>
        <t-form-item label="BaseURL" name="base_url" :rules="[{ required: true }, { url: true }, { pattern: /.*\/$/ }]">
          <t-input v-model="formData.base_url" placeholder="接口地址，必须以/结尾"></t-input>
        </t-form-item>
      </t-form>
    </template>
  </CommonDialog>
</template>

<style scoped lang="scss"></style>
