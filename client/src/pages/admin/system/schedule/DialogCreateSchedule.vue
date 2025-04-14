<script setup lang="ts">
import { type ApiSchemaSchedule, ApiSchemaScheduleStatus } from '@/api/gen/data-contracts.ts';
import { computed, reactive, useTemplateRef, watch } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import genApi from '@/api/gen-api.ts';
import type { CommonDialogProps } from '@/components/dialog/types.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import type { FormInstanceFunctions } from 'tdesign-vue-next/es/form/type';
import { checkFormValidateResult } from '@/utils/tdesign.ts';

type T = ApiSchemaSchedule;

const props = defineProps<{
  data?: T;
  mode: 'create' | 'edit';
}>();

const title = computed(() => `${props.mode == 'create' ? '创建' : '编辑'}定时任务`);
const subtitle = computed(() => (props.mode == 'edit' && props.data?.id ? `(ID: ${props.data?.id})` : ''));
const formRef = useTemplateRef<FormInstanceFunctions<T>>('form');

const formData: T & {
  [key: string]: any;
} = reactive({
  name: '',
  description: '',
  duration: 600,
  status: ApiSchemaScheduleStatus.EnumScheduleStatusRunning,
});
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      formData.name = newData.name || '';
      formData.description = newData.description || '';
      formData.duration = newData.duration || 600;
      formData.status = newData.status || ApiSchemaScheduleStatus.EnumScheduleStatusRunning;
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
    // unsupported
  } else {
    if (!props.data?.id) return;
    const updateData: Partial<T> = {};
    for (const key in formData) {
      if (formData[key] != props.data[key as keyof T]) {
        updateData[key as keyof T] = formData[key];
      }
    }
    await genApi.Manage.scheduleUpdatePost(props.data.name!, {
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
        <t-form-item label="名称" name="name">
          <t-input v-model="formData.name" placeholder="名称" disabled></t-input>
        </t-form-item>
        <t-form-item label="描述" name="description">
          <t-input v-model="formData.description" placeholder="描述" disabled></t-input>
        </t-form-item>
        <t-form-item label="执行间隔 (s)" name="duration" :rules="[{ required: true }]">
          <t-input v-model="formData.duration" placeholder="执行间隔" type="number"></t-input>
        </t-form-item>
      </t-form>
    </template>
  </CommonDialog>
</template>

<style scoped lang="scss"></style>
