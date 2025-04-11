import { acceptHMRUpdate, defineStore } from 'pinia';
import { useArrayMap, useLocalStorage } from '@vueuse/core';
import { computed, h, watch } from 'vue';
import genApi from '@/api/gen-api.ts';
import type { ApiEntityConfigChatModel, ApiSchemaPreset } from '@/api/gen/data-contracts.ts';
import type { DropdownOption } from '@/components/dropdown/types.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import { useSettingStore } from '@/store/useSettingStore.ts';
import LogoDeepSeek from '@/components/logo/LogoDeepSeek.vue';

export const useChatConfigStore = defineStore('chat-config', () => {
  // 供应商及模型数据
  const chatModels = useLocalStorage<ApiEntityConfigChatModel[]>('chat-models', []);
  // 转换为下拉菜单结果fix
  const modelDropdown = useArrayMap(chatModels, convertModelConfigDropdown);
  // 计算出一个默认的模型
  const defaultModel = computed<ApiEntityConfigChatModel | undefined>(
    () =>
      chatModels.value.find((v) => v.is_default) || chatModels.value.sort((a, b) => (a.order || 0) - (b.order || 0))[0]
  );

  const getModelsOnServer = async () => {
    try {
      // 获取模型数据
      const models = await genApi.Chat.configModelsGet();
      if (models.data.data) {
        chatModels.value = models.data.data;
        // 检查设置中的默认模型是否存在，如果不存在则使用第一个模型作为默认模型
        if (
          !settingStore.settings.defaultModel ||
          (!chatModels.value.find((p) => p.name === settingStore.settings.defaultModel) && chatModels.value.length)
        ) {
          const defaultModelByConfig =
            chatModels.value.find((v) => v.is_default) ||
            chatModels.value.sort((a, b) => (a.order || 0) - (b.order || 0))[0];
          settingStore.saveSettings({
            defaultModel: defaultModelByConfig.name,
          });
        }
      }
    } catch (_) {
      console.error('获取模型数据失败');
    }
  };

  const bots = useLocalStorage<ApiSchemaPreset[]>('bots-raw', []);
  const botsIdNameMap = computed(() => {
    const map = {} as Record<number, string>;
    bots.value.forEach((value) => {
      map[value.id!] = value.name!;
    });
    return map;
  });
  const botsNameIdMap = computed(() => {
    const map = {} as Record<string, number>;
    bots.value.forEach((value) => {
      map[value.name!] = value.id!;
    });
    return map;
  });
  const botsDropdown = computed<DropdownOption[]>(() => [
    {
      label: '通用 (默认)',
      value: '0',
    },
    ...bots.value.map((bot) => {
      return {
        label: bot.name!,
        value: String(bot.id!),
      };
    }),
  ]);
  const getBotsOnServer = async () => {
    try {
      const res = await genApi.Chat.configBotsGet();
      if (res.data.data) {
        bots.value = res.data.data;
      }
    } catch (_) {
      console.error('获取 bot 角色数据失败');
    }
  };

  // 登录后获取模型数据
  const userStore = useUserStore();
  watch(
    () => userStore.isLogin,
    (isLogin) => {
      if (isLogin) {
        getModelsOnServer();
        getBotsOnServer();
      }
    },
    { immediate: true }
  );

  // 监听默认模型的变化，若设置中的默认模型为空，则将设置中默认模型设置为本 store 中的默认模型
  const settingStore = useSettingStore();
  watch(
    () => defaultModel.value,
    async (newDefaultModel) => {
      if (!settingStore.settings.defaultModel && newDefaultModel) {
        settingStore.saveSettings({
          defaultModel: newDefaultModel.name,
        });
      }
    }
  );

  return {
    chatModels,
    modelDropdown,
    defaultModel,

    bots,
    botsNameIdMap,
    botsIdNameMap,
    botsDropdown,
  };
});

const convertModelConfigDropdown = (model: ApiEntityConfigChatModel) => {
  const modelLogo = model.icon == 'deepseek' ? h(LogoDeepSeek, { showBackground: false }) : model.icon;
  // 基础映射：display_name -> label，name -> value
  const dropdownOption: DropdownOption = {
    value: model.name || '',
    label: model.display_name || '',
    icon: modelLogo,
  };

  return dropdownOption;
};

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatConfigStore, import.meta.hot));
}
