import api from '@/api';
import showToast from '@/components/toast/toast';
import useRoleStore from '@/store/useRoleStore';
import { useSettingStore } from '@/store/useSettingStore';
import { useUserStore } from '@/store/useUserStore';
import type { DialogData, MsgData } from '@/types/data';
import { recordToMap } from '@/utils/typeUtils';
import { useLocalStorage, useStorage } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, reactive, ref, type UnwrapNestedRefs } from 'vue';

interface MessageReceiver {
  // 用户输入保存后的回调
  onSaveUserMsg: () => void;
  onMessage: (message: string) => void;
  onFinish: (fullMessage: string) => void;
}

/* 数据相关 */
export const useDataStore = defineStore('data', () => {
  const DIALOG_DATA_VERSION = 1;

  // 不能直接返回其它use获取的数据dialogData，需要将其转换为dialogList
  const dialogData = useStorage<DialogData>(
    'dialog-data',
    {
      dialogs: {},
      version: DIALOG_DATA_VERSION,
    },
    localStorage
  );

  const dialogList = computed(() => {
    console.log(dialogData.value);
    return Array.from(recordToMap(dialogData.value.dialogs!).values()).reverse();
  });

  const roleStore = useRoleStore();
  const settingStore = useSettingStore();

  function getDialogInfo(sessionId: string) {
    return dialogData.value.dialogs![sessionId] ?? {};
  }

  /**
   * 创建一个对话
   * @param role 角色 ID
   */
  async function addDialog(role?: number) {
    try {
      // 获取session_id
      const { status, data } = await api.chat.createSession();
      const sessionId = data.data;
      console.log(data);
      if (status === 200 && data.data) {
        dialogData.value.dialogs![sessionId] = {
          id: sessionId,
          title: '新会话',
          avatarPath: '',
          digest: '',
          botRole: roleStore.roles?.find((r) => r[0] === role)?.[1] || '未知',
          storageKey: `dialog-${sessionId}`,
          createAt: new Date().toLocaleString(),
          withContext: true,
          model: settingStore.settings.defaultProvider ?? 'DeepSeek',
        };
      }
      return sessionId;
    } catch (e) {
      showToast({ text: '请求失败，请先登录~', type: 'danger', position: 'top-left' });
    }
    return '';
  }

  function editDialogTitle(dialogId: string, newTitle: string) {
    dialogData.value.dialogs![dialogId].title = newTitle;
  }

  function toggleDialogContext(dialogId: string, isOpen: boolean) {
    dialogData.value.dialogs![dialogId].withContext = isOpen;
  }

  function changeDialogModel(dialogId: string, modelName: string) {
    dialogData.value.dialogs![dialogId].model = modelName;
  }

  async function delDialog(sessionId: string) {
    return new Promise((resolve, reject) => {
      // 本地删除
      const storageKey = dialogData.value.dialogs![sessionId]?.storageKey;
      if (storageKey) {
        delete dialogData.value.dialogs![sessionId];
        localStorage.removeItem(storageKey);
        showToast({ text: '删除成功√' });
        resolve('删除成功');
      } else {
        showToast({ text: '删除失败' });
        reject('删除失败');
      }
      // 远程删除
      api.chat.deleteSession(sessionId);
    });
  }

  const messageStorage = ref<Record<string, UnwrapNestedRefs<MsgData>>>({});

  function loadMessagesFromStorage(sessionId: string) {
    const storageKey = `dialog-${sessionId}`;
    messageStorage.value[storageKey] = reactive(
      useLocalStorage<MsgData>(storageKey, {
        messages: [],
        version: 1,
      })
    ) as UnwrapNestedRefs<MsgData>;
  }

  function getMessageList(sessionId: string) {
    console.log(messageStorage.value);
    const storageKey = `dialog-${sessionId}`;
    if (!messageStorage.value[storageKey]) {
      loadMessagesFromStorage(sessionId);
    }
    return messageStorage.value[storageKey].messages ?? [];
  }

  async function sendMessageText(sessionId: string, message: string, receiver?: MessageReceiver) {
    if (message == '') return;
    saveMessage(sessionId, message, 'user', 'text');
    receiver?.onSaveUserMsg();
    const ctrl = new AbortController();
    let fullMessage = '';
    const { withContext, model: modelName } = getDialogInfo(sessionId);
    await api.chat.completionStream(
      {
        sessionId: sessionId,
        msg: message,
        withContext: withContext ?? true,
        modelName: modelName ?? 'DeepSeek',
      },
      ctrl.signal,
      (event) => {
        if (event.data === '[DONE]') {
          // 当接收到服务器端的结束标记时
          saveMessage(sessionId, fullMessage.replace(/^\[title:(.+?)]/, ''), 'bot', 'text'); // 保存消息
          // 修改标题
          const regex = /^\[title:(.+?)]/; // 匹配以```开头和结尾的内容
          const matches = fullMessage.match(regex);
          if (matches) {
            const title = matches[1];
            editDialogTitle(sessionId, title);
          }

          receiver?.onFinish(fullMessage); // 消息接收完毕回调
        } else {
          let data = event.data;
          data = data.replaceAll('\\n', '\n');
          console.log('[data]', event.data, `'${data}'`);
          fullMessage += data; // 记录已接收的消息
          receiver?.onMessage(data); // 消息接收回调
        }
      }
    );
  }

  function saveMessage(
    sessionId: string,
    message: string,
    sender: 'user' | 'bot',
    type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'other'
  ) {
    try {
      const storageKey = `dialog-${sessionId}`;
      console.log(messageStorage.value[storageKey]);
      messageStorage.value[storageKey].messages?.push({
        time: new Date().toLocaleString(),
        sender,
        type,
        content: message,
      });
      localStorage.setItem(storageKey, JSON.stringify(messageStorage.value[storageKey]));
    } catch (ignore) {}
  }

  function searchDialog(text: string) {
    return dialogList.value.filter((d) => {
      const info = localStorage.getItem(d.storageKey);
      return (
        info &&
        (d.storageKey.toLowerCase().indexOf(text.toLowerCase()) != -1 ||
          d.botRole.toLowerCase().indexOf(text.toLowerCase()) != -1 ||
          info.toLowerCase().indexOf(text.toLowerCase()) != -1)
      );
    });
  }

  return {
    dialogList,
    messageStorage,
    getDialogInfo,
    addDialog,
    editDialogTitle,
    toggleDialogContext,
    changeDialogModel,
    delDialog,
    getMessageList,
    sendMessageText,
    searchDialog,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}
