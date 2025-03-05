import { acceptHMRUpdate, defineStore } from 'pinia';
import { useArrayMap, useLocalStorage } from '@vueuse/core';
import { computed, onMounted, watch } from 'vue';
import genApi from '@/api/gen-api.ts';
import type { ApiSchemaModelCache } from '@/api/gen/data-contracts.ts';
import type { DropdownOption } from '@/components/dropdown/types.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import { useSettingStore } from '@/store/useSettingStore.ts';

type ProviderModel = {
  internalName: string;
  displayName: string;
  order: number;
  models: {
    internalName: string;
    displayName: string;
    order: number;
  }[];
};

type ModelAccurateInfo = {
  providerName: string;
  modelName: string;
};

export const useModelStore = defineStore('model', () => {
  // 供应商及模型数据
  const rawModels = useLocalStorage<ApiSchemaModelCache[]>('models-raw', []);
  const providerModels = useLocalStorage<ProviderModel[]>('provider-model', []);
  // 转换为下拉菜单结果fix
  const providerDropdown = useArrayMap(providerModels, convertProviderToDropdown);
  // 计算出一个默认的模型
  const defaultModel = computed<ModelAccurateInfo | undefined>(() =>
    rawModels.value.length
      ? {
          providerName: rawModels.value[0].provider_name || '',
          modelName: rawModels.value[0].name || '',
        }
      : undefined
  );

  const getModelsOnServer = async () => {
    // 获取模型数据
    const models = await genApi.Chat.configModelsGet();
    if (models.data.data) {
      rawModels.value = models.data.data;
      // 将扁平的模型数据分组
      const groupedModels = models.data.data.reduce(
        (acc, curr) => {
          const providerName = curr.provider_name || '';
          (acc[providerName] = acc[providerName] || []).push(curr);
          return acc;
        },
        {} as Record<string, ApiSchemaModelCache[]>
      );
      // 将分组数据转换为标准形式
      providerModels.value = [];
      Object.entries(groupedModels).forEach((group) => {
        providerModels.value.push({
          internalName: group[0],
          displayName: group[1][0]?.provider_display_name || '',
          order: 1,
          models: group[1].map((m) => {
            return {
              internalName: m.name || '',
              displayName: m.display_name || m.name || '',
              order: 1,
            };
          }),
        });
      });
    }
  };

  onMounted(() => {
    getModelsOnServer();
  });

  // 登录后获取模型数据
  const userStore = useUserStore();
  watch(
    () => userStore.isLogin,
    (isLogin) => {
      if (isLogin) {
        getModelsOnServer();
      }
    }
  );

  // 监听默认模型的变化，若设置中的默认模型为空，则将设置中默认模型设置为本仓库中的默认模型
  const settingStore = useSettingStore();
  watch(
    () => defaultModel.value,
    async (provider) => {
      if (
        (!settingStore.settings.defaultProvider || !settingStore.settings.defaultModel) &&
        provider?.providerName &&
        provider?.modelName
      ) {
        settingStore.saveSettings({
          defaultProvider: provider.providerName,
          defaultModel: provider.modelName,
        });
      }
    },
  );

  return {
    providerModels,
    providerDropdown,
    defaultModel,
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
