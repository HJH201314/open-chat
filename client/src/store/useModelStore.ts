import { acceptHMRUpdate, defineStore } from 'pinia';
import { useArrayMap, useLocalStorage } from '@vueuse/core';
import { onMounted } from 'vue';
import genApi from '@/api/gen-api.ts';
import type { ApiModelsModelCache } from '@/api/gen/data-contracts.ts';
import type { DropdownOption } from '@/components/dropdown/types.ts';

type ProviderModel = {
  internalName: string;
  displayName: string;
  models: {
    internalName: string;
    displayName: string;
  }[];
}

export const useModelStore = defineStore('model', () => {
  // 供应商及模型数据
  const providerModels = useLocalStorage<ProviderModel[]>('provider-model', []);
  // 转换为下拉菜单结果fix
  const providerDropdown = useArrayMap(providerModels, convertProviderToDropdown);

  const getModelsOnServer = async () => {
    // 获取模型数据
    const models = await genApi.Chat.configModelsList();
    if (models.data.data) {
      // 将扁平的模型数据分组
      const groupedModels = models.data.data.reduce((acc, curr) => {
        const providerName = curr.provider_name || '';
        (acc[providerName] = acc[providerName] || []).push(curr);
        return acc;
      }, {} as Record<string, ApiModelsModelCache[]>);
      // 将分组数据转换为标准形式
      providerModels.value = [];
      Object.entries(groupedModels).forEach((group) => {
        providerModels.value.push({
          internalName: group[0],
          displayName: group[1][0]?.provider_display_name || '',
          models: group[1].map((m) => {
            return {
              internalName: m.name || '',
              displayName: m.display_name || m.name || '',
            };
          }),
        });
      });
    }
  };

  onMounted(() => {
    getModelsOnServer();
  });

  return {
    providerModels,
    providerDropdown,
  };
});

const convertProviderToDropdown = (provider: ProviderModel) => {
  // 基础映射：displayName -> label，internalName -> value
  const dropdownOption: DropdownOption = {
    label: provider.displayName,
    value: provider.internalName,
  };

  // 处理嵌套的 models 转换为 children
  if (provider.models.length > 0) {
    dropdownOption.children = provider.models.map((model) => ({
      label: model.displayName,
      value: model.internalName,
      // 如果子 model 也有嵌套结构，可在此递归处理（根据实际情况）
    }));
  }

  return dropdownOption;
};

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useModelStore, import.meta.hot));
}