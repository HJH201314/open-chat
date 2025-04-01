<script setup lang="ts">
import type { ApiSchemaModel, ApiSchemaModelCollection } from '@/api/gen/data-contracts.ts';
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import genApi from '@/api/gen-api.ts';
import type { CommonDialogProps } from '@/components/dialog/types.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import type { FormInstanceFunctions } from 'tdesign-vue-next/es/form/type';
import { checkFormValidateResult } from '@/utils/tdesign.ts';
import type { TransferProps } from 'tdesign-vue-next';

type T = ApiSchemaModelCollection;

const props = defineProps<{
  data?: T;
  mode: 'create' | 'edit';
}>();

const title = computed(() => `${props.mode == 'create' ? '创建' : '编辑'}模型集合`);
const subtitle = computed(() => (props.mode == 'edit' && props.data?.id ? `(ID: ${props.data?.id})` : ''));
const formRef = useTemplateRef<FormInstanceFunctions<T>>('form');

const loadingModels = ref(false);
const getModels = async () => {
  try {
    loadingModels.value = true;
    const res = await genApi.Manage.modelListGet({
      page_num: 1,
      page_size: 99999, // TODO
    });
    if (res.status == 200 && res.data.data) {
      modelList.value = Object.entries(Object.groupBy(res.data.data.list || [], (item) => item.provider?.name || '')).map(([providerName, models]) => {
        return {
          label: providerName,
          value: providerName,
          children: models?.map((item) => ({
            label: item.name || '',
            value: item.id || 0,
          })) || [],
        };
      })
    }
  } finally {
    loadingModels.value = false;
  }
};

// 角色处理
const modelList = ref<TransferProps['data']>([]);
const modelIds = ref<number[]>([]);
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
  modelIds.value = newTargetValue as number[];
};

const formData: T & {
  [key: string]: any;
} = reactive({
  name: '',
  display_name: '',
  description: '',
});
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      formData.name = newData.name || '';
      formData.display_name = newData.display_name || '';
      formData.description = newData.description || '';
      modelIds.value = (newData.models || []).map((item) => item.id || 0);
    }
    getModels();
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
  console.log(modelIds.value);
  if (props.mode == 'create') {
    await genApi.Manage.collectionCreatePost({
      ...formData,
      models: modelIds.value.map((item) => ({ id: item }) as ApiSchemaModel),
    });
  } else {
    if (!props.data?.id) return;
    const updateData: Partial<T> = {};
    for (const key in formData) {
      if (formData[key] != props.data[key as keyof T]) {
        updateData[key as keyof T] = formData[key];
      }
    }
    if (JSON.stringify(modelIds.value.sort()) != JSON.stringify(props.data?.models?.map((item) => item.id).sort())) {
      updateData.models = modelIds.value.map((item) => ({ id: item }) as ApiSchemaModelCollection);
    }
    // do update
    if (Object.keys(updateData).length != 0) {
      await genApi.Manage.collectionUpdatePost(props.data?.id, {
        data: updateData,
        updates: Object.keys(updateData),
      });
    }
  }
};
</script>

<template>
  <CommonDialog :title="title" :subtitle="subtitle" :confirm-handler="handleConfirm" :dialog-style="{ 'width': '789px' }">
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
        <t-form-item label="模型" name="models" label-align="top">
          <t-transfer
            v-model="modelIds"
            :data="modelList"
            :search="true"
            :title="['模型列表', '已添加']"
            :disabled="loadingModels"
            style="width: 100%"
            @change="handleChange"
            @checked-change="handleCheckedChange"
          >
            <template #tree="slotProps">
              <t-tree v-bind="slotProps" checkable hover expand-all transition />
            </template>
          </t-transfer>
        </t-form-item>
      </t-form>
    </template>
  </CommonDialog>
</template>

<style scoped lang="scss"></style>
