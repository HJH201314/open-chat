<script setup lang="ts">
import type { ApiSchemaModel, ApiSchemaProvider } from '@/api/gen/data-contracts.ts';
import { computed, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import CommonDialog from '@/components/dialog/CommonDialog.vue';
import genApi from '@/api/gen-api.ts';
import type { CommonDialogProps } from '@/components/dialog/types.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import type { FormInstanceFunctions } from 'tdesign-vue-next/es/form/type';
import { checkFormValidateResult } from '@/utils/tdesign.ts';

type T = ApiSchemaModel;

const props = defineProps<{
  forceProviderId?: number;
  data?: T;
  mode: 'create' | 'edit';
}>();

const title = computed(() => `${props.mode == 'create' ? '创建' : '编辑'}模型`);
const formRef = useTemplateRef<FormInstanceFunctions<T>>('form');

const formData: T & {
  [key: string]: any;
} = reactive({
  id: 0,
  provider_id: undefined,
  name: '',
  display_name: '',
  description: '',
});
const configData: T['config'] & {
  [key: string]: any;
} = reactive({});
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      formData.id = newData.id || 0;
      if (props.forceProviderId) {
        formData.provider_id = props.forceProviderId;
      } else {
        formData.provider_id = newData.provider_id /* no default */;
      }
      formData.name = newData.name || '';
      formData.display_name = newData.display_name || '';
      formData.description = newData.description || '';
      Object.assign(configData, newData.config || {});
    }
  },
  { immediate: true }
);

const loadingProvider = ref(false);
const providers = ref<ApiSchemaProvider[]>([]);
const getProviders = async () => {
  try {
    loadingProvider.value = true;
    const res = await genApi.Manage.providerListGet({
      page_num: 1,
      page_size: 1000, // TODO
    });
    if (res.status == 200 && res.data.data) {
      providers.value = res.data.data.list || [];
    }
  } catch (_) {
    // TODO：获取异常
  } finally {
    loadingProvider.value = false;
  }
};

onMounted(() => {
  getProviders();
});

const handleConfirm: CommonDialogProps['confirmHandler'] = async (_, prevent) => {
  const res = (await formRef.value?.validate()) || {};
  if (!checkFormValidateResult(res)) {
    ToastManager.danger('请正确填写数据');
    prevent();
    return;
  }
  if (props.mode == 'create') {
    await genApi.Manage.modelCreatePost({
      provider_id: formData.provider_id,
      name: formData.name,
      display_name: formData.display_name,
      description: formData.description,
      config: configData,
    });
  } else {
    if (!props.data?.id) return;
    const updateData: Partial<T> = {};
    // 判断更新的字段
    for (const key in formData) {
      if (formData[key] != props.data[key as keyof T]) {
        updateData[key as keyof T] = formData[key];
      }
    }
    // 判断更新的配置
    if (JSON.stringify(configData) != JSON.stringify(props.data?.config)) {
      updateData.config = configData;
    } else {
      updateData.config = undefined;
    }
    updateData.id = props.data.id;
    await genApi.Manage.modelUpdatePost(updateData);
  }
};
</script>

<template>
  <CommonDialog :title="title" subtitle="一个模型是某个供应商下属的模型" :confirm-handler="handleConfirm">
    <template #default>
      <t-form ref="form" :data="formData" style="margin: 1rem 0">
        <t-form-item label="接入点" name="name" :rules="[{ required: true }]">
          <t-select v-model="formData.provider_id" :loading="loadingProvider" :disabled="mode == 'edit' || !!forceProviderId" loading-text="加载中请稍后..." placeholder="请选择">
            <t-option v-for="provider in providers" :key="provider.id" :label="`${provider.display_name} | ${provider.name}`" :value="provider.id" />
          </t-select>
        </t-form-item>
        <t-form-item label="标识名" name="name" :rules="[{ required: true }]">
          <t-input v-model="formData.name" placeholder="标识名，建议为英文简称"></t-input>
        </t-form-item>
        <t-form-item label="展示名" name="display_name" :rules="[{ required: true }]">
          <t-input v-model="formData.display_name" placeholder="用户看到的名称"></t-input>
        </t-form-item>
        <t-form-item label="描述" name="description">
          <t-input v-model="formData.description" placeholder="给自己看的描述"></t-input>
        </t-form-item>
<!--        <t-form-item label="配置" name="config">-->
<!--          <t-input v-model="formData.base_url" placeholder="接口地址，必须以/结尾"></t-input>-->
<!--        </t-form-item>-->
      </t-form>
      <t-collapse>
        <t-collapse-panel header="模型配置">
          <t-form ref="config-form" :data="configData" label-align="top">
            <t-form-item label="允许用户更改系统提示词" name="allow_system_prompt">
              <t-switch v-model="configData.allow_system_prompt" placeholder="允许用户输入提示词"></t-switch>
            </t-form-item>
            <t-form-item label="默认系统提示词" name="system_prompt">
              <t-input v-model="configData.system_prompt" placeholder="默认系统提示词"></t-input>
            </t-form-item>
            <t-form-item label="默认Temperature" name="default_temperature">
              <t-input-number v-model="configData.default_temperature" theme="normal" :decimal-places="1" :max="2" :min="0"></t-input-number>
            </t-form-item>
            <t-form-item label="MaxToken" name="max_token">
              <t-input-number v-model="configData.max_tokens" theme="normal" :max="99999" :min="0"></t-input-number>
            </t-form-item>
          </t-form>
        </t-collapse-panel>
      </t-collapse>
    </template>
  </CommonDialog>
</template>

<style scoped lang="scss"></style>
