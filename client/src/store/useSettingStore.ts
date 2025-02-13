import useGlobal from '@/commands/useGlobal';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { computed, onMounted } from 'vue';

export type ChatSetting = {
  host?: string;
  localCache?: boolean; // 本地对话数据缓存
  fastSendKey?: 'enter' | 'none'; // 快速发送按键
  roleEnabled?: boolean; // 是否启用角色功能，不启用则默认直接开始
  roleRemember?: boolean; // 是否使用默认角色
  roleDefaultId?: string; // 默认角色
  timeDisplayInDialogList?: string;
  timeDisplayInMessageList?: string;
  defaultProvider?: string; // 默认 API 提供商
  defaultModel?: [string, string]; // 默认模型，形如 ['OpenAI', 'gpt-4o']

  /* 语音输入相关 */
  enableVoiceToText?: boolean; // 是否启用语音输入
  enableTextToVoice?: boolean; // 是否启用结果转语音
  voiceCloudAppId?: string; // 云服务AppID
  voiceCloudSecretId?: string; // 云服务SecretId
  voiceCloudSecretKey?: string; // 云服务SecretKey

  // 添加索引签名，允许使用字符串索引
  [key: string]: any;
};

const defaultSetting: ChatSetting = {
  host: '/api',
  localCache: true,
  fastSendKey: useGlobal().isLargeScreen ? 'enter' : 'none', // 宽屏默认回车发送
  roleEnabled: false,
  roleRemember: false,
  roleDefaultId: '1',
  enableVoiceToText: false,
  enableTextToVoice: false,
  timeDisplayInDialogList: 'yyyy-MM-dd hh:mm:ss',
  timeDisplayInMessageList: 'yyyy-MM-dd hh:mm:ss',
  defaultProvider: 'OpenAI',
  defaultModel: ['OpenAI', 'gpt-4o'],

  voiceCloudAppId: import.meta.env.VITE_CLOUD_VOICE_APPID,
  voiceCloudSecretId: import.meta.env.VITE_CLOUD_VOICE_SECRET_ID,
  voiceCloudSecretKey: import.meta.env.VITE_CLOUD_VOICE_SECRET_KEY,
};

/* 设置相关 */
export const useSettingStore = defineStore('setting', () => {
  const settingStorage = useLocalStorage('setting', defaultSetting);
  const settings = computed(() => settingStorage.value);

  onMounted(() => {
    // 扫描已有配置，若配置中缺少默认设置中有的选项，则将默认配置作为当前配置
    Object.entries(defaultSetting).forEach(([key, value]) => {
      if (settings.value[key] === undefined) {
        settingStorage.value[key] = value;
      }
    });
  });

  /**
   * 保存设置
   * @param key
   * @param value
   */
  function saveSetting<K extends keyof ChatSetting>(key: K, value: ChatSetting[K]) {
    settingStorage.value[key] = value;
  }

  function saveSettings(newSettings: ChatSetting) {
    settingStorage.value = { ...defaultSetting, ...settingStorage.value, ...newSettings }; // 第一个放defaultSetting是便于程序更新设置也能更新默认值
    console.log(newSettings);
    return Object.keys(newSettings).length;
  }

  /**
   * 重置设置
   * @param key (可选)要重置的设置
   */
  function resetSetting<K extends keyof ChatSetting>(key?: K) {
    if (key) {
      settingStorage.value[key] = defaultSetting[key];
    } else {
      settingStorage.value = { ...defaultSetting }; // 直接赋值会导致defaultSetting被引用从而被修改，因此需要解构
      console.log('reset', settingStorage.value, defaultSetting);
    }
  }

  return {
    settings,
    saveSetting,
    saveSettings,
    resetSetting,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
}
