import { defineStore } from "pinia";
import { computed, onMounted, reactive, ref } from "vue";
import api from '@/api';
import { useLocalStorage, useStorage } from "@vueuse/core";
import type { DialogData, DialogInfo, MsgData } from "@/types/data";
import showToast from "@/components/toast/toast";
import { recordToMap } from "@/utils/typeUtils";
import { SERVER_API_URL } from "@/constants";
import type { RemovableRef } from "@vueuse/core";
import type { Ref } from "vue";

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

  const roles = ref<API.RoleListResult>();

  onMounted(() => {
    getAllRoles();
  });

  async function getAllRoles() {
    try {
      const res = await api.gpt.getAllRoles();
      if (res.status === 200) {
          roles.value = res.data;
      }
    } catch (e) {
      console.error(e);
    }
  }

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
          botRole: roles.value?.find((r) => r[0] === role)?.[1] || '未知',
          storageKey: `dialog-${sessionId}`,
          createAt: new Date().toLocaleString(),
        };
      }
      return res.headers['session_id'];
    } catch (e) {
      showToast({ text: '请求失败，请先登录~' });
    } finally {
    }
    return '';
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

  const messageStorage = ref<Record<string, RemovableRef<MsgData>>>({});

  function loadMessagesFromStorage(sessionId: string) {
    const storageKey = `dialog-${sessionId}`;
    messageStorage.value[storageKey] = useLocalStorage<MsgData>(storageKey, {
      messages: [],
      version: 1,
    });
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
    let url = `${SERVER_API_URL}/gpt/${sessionId}?question=${message}`
    let source = new EventSource(url);
    let fullMessage = '';
    source.onmessage = function (event) {
      if (event.data === "[DONE]") {
        source.close();
        saveMessage(sessionId, fullMessage, 'bot', 'text');
        receiver.onFinish(fullMessage);
      } else {
        console.log('[data]', event.data)
        fullMessage += event.data;
        receiver.onMessage(event.data);
      }
    }
  }

  function saveMessage(sessionId: string, message: string, sender: 'user' | 'bot', type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'other') {
    try {
      const storageKey = `dialog-${sessionId}`;
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
    roles,
    getDialogInfo,
    addDialog,
    delDialog,
    getMessageList,
    sendMessageText,
  }
});