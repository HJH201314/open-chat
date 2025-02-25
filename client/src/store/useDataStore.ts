import api from '@/api';
import useMarkdownIt from '@/commands/useMarkdownIt';
import showToast from '@/components/toast/toast';
import useRoleStore from '@/store/useRoleStore';
import { useSettingStore } from '@/store/useSettingStore';
import type { DialogData, MsgData, MsgInfo } from '@/types/data';
import { useCommandParser } from '@/utils/command-parser';
import { recordToMap } from '@/utils/typeUtils';
import { useLocalStorage, useStorage, watchArray } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, reactive, ref, shallowRef, type UnwrapNestedRefs, watch } from 'vue';

interface MessageCallback {
  // 用户输入保存后的回调
  onSaveUserMsg?: () => void;
  /**
   * 收到数据回调
   * @param renderedMsg 编译后的 html 完整数据
   */
  onMessage?: (renderedMsg: string) => void;
  /**
   * 收到思考数据回调
   * @param thinkMsg 当前完整思考数据
   */
  onThinkMessage?: (thinkMsg: string) => void;
  onFinish?: (renderedMsg: string) => void;
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
    localStorage,
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
   * 创建一个对话，成功返回 sessionId，失败返回 ''
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
          title: '',
          avatarPath: '',
          digest: '',
          botRole: roleStore.roles?.find((r) => r[0] === role)?.[1] || '未知',
          storageKey: `dialog-${sessionId}`,
          createAt: new Date().toLocaleString(),
          withContext: true,
          provider: settingStore.settings.defaultModel?.[0] ?? 'OpenAI',
          model: settingStore.settings.defaultModel?.[1] ?? 'gpt-4o',
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

  function changeDialogModel(dialogId: string, modelProvider: string, modelName: string) {
    dialogData.value.dialogs![dialogId].provider = modelProvider;
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
      }),
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

  /**
   * 发送文本信息
   * @param sessionId 会话 ID
   * @param message 发送的文本消息
   * @param  callback 回调
   * @param abort AbortController
   */
  const sendMessageText = async (sessionId: string, message: string, callback?: MessageCallback, abort?: AbortController) => {
    if (message == '') return;
    const userMsgIndex = saveMessage(sessionId, message, 'user', 'text');
    callback?.onSaveUserMsg?.();
    const ctrl = abort || new AbortController();
    const rawData = reactive({
      msg: '',
      think: '',
    });
    const { commands, commandMap } = useCommandParser(() => rawData.msg);
    const { result: renderedMsg } = useMarkdownIt(() => rawData.msg);
    const { withContext, provider, model: modelName } = getDialogInfo(sessionId);
    let msgIds: [string | undefined, string | undefined] = [undefined, undefined];

    // 观测回答数据中的指令
    watchArray(commands, () => {
      const titleCmd = commandMap.value['title'];
      if (titleCmd) {
        editDialogTitle(sessionId, titleCmd.values[0]);
        // console.log('findTitle', titleCmd, rawMsg.value);
        rawData.msg = rawData.msg.replace(titleCmd.raw, '');
      }
      const idCmd = commandMap.value['ID'];
      if (idCmd) {
        msgIds = [idCmd.values[0], idCmd.values[1]];
        rawData.msg = rawData.msg.replace(idCmd.raw, '');
      }
    });
    // 观测回答的变化
    watch(() => renderedMsg.value, (v, ov) => {
      if (v == ov) return;
      callback?.onMessage?.(v); // 消息接收回调
    });
    // 观测思考的变化
    watch(() => rawData.think, (v, ov) => {
      if (v == ov) return;
      callback?.onThinkMessage?.(v); // 消息接收回调
    });
    return await api.chat.completionStream(
      {
        provider: provider,
        modelName: modelName,
        sessionId: sessionId,
        msg: message,
        withContext: withContext,
      },
      ctrl.signal,
      (event) => {
        if (event.event === 'done') {
          // 当接收到服务器端的结束标记时，保存消息
          saveMessage(sessionId, rawData.msg, 'bot', 'text', renderedMsg.value, rawData.think, msgIds[1]); // 保存消息
          updateMessage(sessionId, userMsgIndex, { id: msgIds[0] });
          callback?.onFinish?.(renderedMsg.value); // 消息接收完毕回调
        } else if (event.event === 'msg') {
          let data = JSON.parse(event.data)?.content;
          data = data.replaceAll('\\n', '\n');
          console.log('[msg]', event.data, `'${data}'`);
          rawData.msg += data; // 记录已接收的消息
        } else if (event.event === 'think') {
          let data = JSON.parse(event.data)?.content;
          data = data.replaceAll('\\n', '\n');
          console.log('[think]', event.data, `'${data}'`);
          rawData.think += data;
        }
      },
    );
  };

  const useSendMessageText = () => {
    const thinkMessage = shallowRef('');
    const answerMessage = shallowRef('');
    const isStreaming = shallowRef(false);
    let abortController = new AbortController();

    const startStreaming = (sessionId: string, message: string, customReceiver?: MessageCallback) => {
      isStreaming.value = true;
      abortController = new AbortController();
      sendMessageText(sessionId, message, {
        ...customReceiver || {},
        onMessage(msg) {
          answerMessage.value = msg;
          console.log('onMsg');
          customReceiver?.onMessage?.(msg);
        },
        onThinkMessage(msg) {
          thinkMessage.value = msg;
          console.log('onThink');
          customReceiver?.onThinkMessage?.(msg);
        },
      }, abortController).finally(() => {
        isStreaming.value = false;
        clearMessage();
      });
    };

    const clearMessage = () => {
      answerMessage.value = '';
      thinkMessage.value = '';
    }

    return {
      isStreaming,
      think: thinkMessage,
      answer: answerMessage,
      start: startStreaming,
      stop: () => abortController.abort(),
      clear: clearMessage,
    };
  };

  /**
   * 保存消息数据到本地，返回消息在本地的编号
   */
  function saveMessage(
    sessionId: string,
    message: string,
    sender: 'user' | 'bot',
    type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'other',
    htmlMessage?: string,
    thinking?: string,
    remoteId?: string,
  ): number {
    try {
      const storageKey = `dialog-${sessionId}`;
      console.log(messageStorage.value[storageKey]);
      messageStorage.value[storageKey].messages?.push({
        time: new Date().toLocaleString(),
        sender,
        type,
        content: message,
        reasoningContent: thinking,
        htmlContent: htmlMessage,
        id: remoteId,
      });
      localStorage.setItem(storageKey, JSON.stringify(messageStorage.value[storageKey]));
      return (messageStorage.value[storageKey].messages?.length || 0) - 1;
    } catch (err) {
      console.error(err);
      return -1;
    }
  }

  /**
   * 更新本地消息数据
   */
  function updateMessage(sessionId: string, index: number, updateObj: Partial<MsgInfo>): boolean {
    try {
      const storageKey = `dialog-${sessionId}`;
      const msg = messageStorage.value[storageKey].messages?.[index];
      if (msg) {
        Object.entries(updateObj).forEach(([key, value]) => {
          msg[key] = value;
        });
        localStorage.setItem(storageKey, JSON.stringify(messageStorage.value[storageKey]));
      }
      return true;
    } catch (e) {
      return false;
    }
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
    useSendMessageText,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}
