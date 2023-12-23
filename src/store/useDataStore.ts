import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, reactive, ref, type UnwrapNestedRefs } from "vue";
import api from '@/api';
import { useLocalStorage, useStorage } from "@vueuse/core";
import type { DialogData, MsgData } from "@/types/data";
import showToast from "@/components/toast/toast";
import { recordToMap } from "@/utils/typeUtils";
import { SERVER_ORIGIN_API_URL } from "@/constants";
import useRoleStore from "@/store/useRoleStore";

interface MessageReceiver {
  onMessage: (message: string) => void;
  onFinish: (fullMessage: string) => void;
}

/* 数据相关 */
export const useDataStore  = defineStore('data', () => {
  const DIALOG_DATA_VERSION = 1;

  // 不能直接返回其它use获取的数据dialogData，需要将其转换为dialogList
  const dialogData = useStorage<DialogData>('dialog-data', {
    dialogs: {},
    version: DIALOG_DATA_VERSION,
  }, localStorage);

  const dialogList = computed(() => {
    console.log(dialogData.value)
    return Array.from(recordToMap(dialogData.value.dialogs!).values()).reverse();
  });

  const roleStore = useRoleStore();

  function getDialogInfo(sessionId: string) {
    return dialogData.value.dialogs![sessionId] ?? {};
  }

  async function addDialog(role: number) {
    try {
      // 获取session_id
      const res = await api.gpt.getSessionId();
      console.log(res.headers)
      if (res.headers['session_id']) {
        const sessionId = res.headers['session_id'];
        console.log(sessionId);
        dialogData.value.dialogs![sessionId] = {
          id: sessionId,
          title: '新会话',
          avatarPath: '',
          digest: '',
          botRole: roleStore.roles?.find((r) => r[0] === role)?.[1] || '未知',
          storageKey: `dialog-${sessionId}`,
          createAt: new Date().toLocaleString(),
        };
      }
      return res.headers['session_id'];
    } catch (e) {
      showToast({ text: '请求失败，请先登录~', type: 'danger', position: 'top-left' });
    } finally {
    }
    return '';
  }

  function editDialogTitle(dialogId: string, newTitle: string) {
    dialogData.value.dialogs![dialogId].title = newTitle;
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
      // TODO: 远程删除
    });
  }

  const messageStorage = ref<Record<string, UnwrapNestedRefs<MsgData>>>({});

  function loadMessagesFromStorage(sessionId: string) {
    const storageKey = `dialog-${sessionId}`;
    messageStorage.value[storageKey] = reactive(useLocalStorage<MsgData>(storageKey, {
      messages: [],
      version: 1,
    })) as UnwrapNestedRefs<MsgData>;
  }

  function getMessageList(sessionId: string) {
    console.log(messageStorage.value)
    const storageKey = `dialog-${sessionId}`;
    if (!messageStorage.value[storageKey]) {
      loadMessagesFromStorage(sessionId);
    }
    return messageStorage.value[storageKey].messages || [];
  }

  function sendMessageText(sessionId: string, message: string, receiver: MessageReceiver) {
    saveMessage(sessionId, message, 'user', 'text');
    let url = `${SERVER_ORIGIN_API_URL}/gpt/${sessionId}?question=${message}`
    let source = new EventSource(url);
    let fullMessage = '';
    // EventSource接收消息
    source.onmessage = function (event) {
      if (event.data === "[DONE]") { // 当接收到服务器端的结束标记时
        source.close(); // 关闭EventSource
        saveMessage(sessionId, fullMessage, 'bot', 'text'); // 保存消息
        receiver.onFinish(fullMessage); // 消息接收完毕回调
      } else {
        console.log('[data]', event.data);
        fullMessage += event.data; // 记录已接收的消息
        receiver.onMessage(event.data); // 消息接收回调
      }
    }
  }

  function saveMessage(sessionId: string, message: string, sender: 'user' | 'bot', type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'other') {
    try {
      const storageKey = `dialog-${sessionId}`;
      console.log(messageStorage.value[storageKey])
      messageStorage.value[storageKey].messages?.push({
        time: new Date().toLocaleString(),
        sender,
        type,
        content: message,
      });
      localStorage.setItem(storageKey, JSON.stringify(messageStorage.value[storageKey]));
    } catch (ignore) {

    }
  }

  return {
    dialogList,
    messageStorage,
    getDialogInfo,
    addDialog,
    editDialogTitle,
    delDialog,
    getMessageList,
    sendMessageText,
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}