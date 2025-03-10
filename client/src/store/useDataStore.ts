import api from '@/api';
import useMarkdownIt from '@/commands/useMarkdownIt';
import showToast from '@/components/toast/toast';
import useRoleStore from '@/store/useRoleStore';
import { useSettingStore } from '@/store/useSettingStore';
import type { MessageInfo, SessionInfo } from '@/types/data';
import { CommandParser, useCommandParser } from '@/utils/command-parser';
import { watchArray } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { reactive, ref, shallowRef, watch } from 'vue';
import ToastManager from '@/components/toast/ToastManager.ts';
import { from, useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '@/store/data/database.ts';
import genApi from '@/api/gen-api.ts';
import { useModelStore } from '@/store/useModelStore.ts';
import type { ApiSchemaSession } from '@/api/gen/data-contracts.ts';

interface MessageCallback {
  // 预保存数据后的回调
  onPreSaveMsg?: (userMsgId: number, botMsgId: number) => void;
  /**
   * 收到数据回调
   * @param renderedMsg 编译后的 html 完整数据
   * @param originMsg 原始消息数据
   */
  onMessage?: (renderedMsg: string, originMsg: string) => void;
  /**
   * 收到思考数据回调
   * @param thinkMsg 当前完整思考数据
   */
  onThinkMessage?: (thinkMsg: string) => void;
  onFinish?: (renderedMsg: string) => void;
}

/* 数据相关 */
export const useDataStore = defineStore('data', () => {
  const sessions = useObservable(from(liveQuery(async () => db.sessions.orderBy('createAt').reverse().toArray())), {
    initialValue: [] as SessionInfo[],
  });

  const roleStore = useRoleStore();
  const modelStore = useModelStore();
  const settingStore = useSettingStore();

  async function getSessionInfo(sessionId: string) {
    return db.sessions.where({ id: sessionId }).last();
  }

  /**
   * 创建一个对话，成功返回 sessionId，失败返回 ''
   * @param role 角色 ID
   */
  async function addSession(role?: number) {
    try {
      // 获取session_id
      const { status, data } = await api.chat.createSession();
      const sessionId = data.data;
      console.log(data);
      if (status === 200 && data.data) {
        await db.sessions.add({
          id: sessionId,
          title: '',
          avatar: '',
          botRole: roleStore.roles?.find((r) => r[0] === role)?.[1] || '未知',
          createAt: Date.now(),
          withContext: true,
          provider: settingStore.settings.defaultProvider || modelStore.defaultModel?.providerName,
          model: settingStore.settings.defaultModel || modelStore.defaultModel?.modelName,
          flags: {},
        });
      }
      return sessionId;
    } catch (_) {
      showToast({ text: '请求失败，请稍候重试 TAT', type: 'danger', position: 'top-left' });
    }
    return '';
  }

  function editSessionTitle(sessionId: string, newTitle: string) {
    db.sessions.where({ id: sessionId }).modify((session) => {
      session.title = newTitle;
    });
  }

  function toggleSessionContext(sessionId: string, isOpen: boolean) {
    db.sessions.where({ id: sessionId }).modify((session) => {
      session.withContext = isOpen;
    });
  }

  function changeSessionModel(sessionId: string, providerName: string, modelName: string) {
    db.sessions.where({ id: sessionId }).modify((session) => {
      session.provider = providerName;
      session.model = modelName;
    });
  }

  function updateSessionFlags(sessionId: string, flags: SessionInfo['flags']) {
    db.sessions.where({ id: sessionId }).modify((session) => {
      session.flags = {
        ...(session.flags || {}),
        ...flags,
      };
    });
  }

  async function delSession(sessionId: string) {
    try {
      // 本地删除消息
      await db.messages.where({ sessionId }).delete();
      // 本地删除会话
      await db.sessions.where({ id: sessionId }).delete();
    } catch (_) {
      ToastManager.danger('删除本地数据异常，请稍后重试～');
      return;
    }
    try {
      // 远程删除
      await genApi.Chat.sessionDelPost(sessionId);
    } catch (_) {
      ToastManager.danger('未能删除服务器数据，可刷新重新拉取对话～');
      return;
    }
  }

  /**
   * 从服务器拉取会话
   */
  async function fetchSessions(abortController?: AbortController) {
    const controller = abortController || new AbortController();
    const remoteSessions: ApiSchemaSession[] = [];
    // 获取所有远程数据
    let nextPage = 1;
    while (nextPage) {
      try {
        const res = await genApi.Chat.sessionListGet(
          {
            page_num: nextPage,
            page_size: 20,
            sort_expr: 'id DESC',
          },
          {
            signal: controller.signal,
          }
        );
        remoteSessions.push(...(res.data.data?.list || []));
        if (res.data.data?.next_page) nextPage = res.data.data?.next_page;
        else break;
      } catch (_) {
        ToastManager.danger('获取数据异常，请稍后重试～');
        return false;
      }
    }
    try {
      // 组装所有需要缓存的数据
      const newSessions = await remoteSessions.reduce(
        async (sessionInfos, remoteSession) => {
          const session = await db.sessions.where({ id: remoteSession.id }).last();
          if (!session) {
            (await sessionInfos).push({
              id: remoteSession.id!,
              title: remoteSession.messages?.[0]?.content || '', // TODO: 目前以第一条消息为标题
              avatar: '',
              botRole: '未知',
              createAt: new Date(remoteSession.created_at!).getTime(),
              withContext: !!remoteSession.enable_context,
              provider: settingStore.settings.defaultProvider || modelStore.defaultModel?.providerName,
              model: settingStore.settings.defaultModel || modelStore.defaultModel?.modelName,
              flags: {
                needSync: true,
              },
            });
          }
          return sessionInfos;
        },
        Promise.resolve([] as SessionInfo[])
      );
      // 写入 db
      db.sessions.bulkAdd(newSessions);
    } catch (_) {
      ToastManager.danger('写入数据异常，请稍后重试～');
      return false;
    }
    return true;
  }

  /**
   * 发送文本信息
   * @param sessionId 会话 ID
   * @param message 发送的文本消息
   * @param  callback 回调
   * @param abort AbortController
   */
  const sendMessageText = async (
    sessionId: string,
    message: string,
    callback?: MessageCallback,
    abort?: AbortController
  ) => {
    if (message == '') return Promise.reject();
    const ctrl = abort || new AbortController();
    const rawData = reactive({
      msg: '',
      think: '',
    });
    const { commands, commandMap } = useCommandParser(() => rawData.msg, false);
    const { result: renderedMsg } = useMarkdownIt(() => rawData.msg);
    const session = await getSessionInfo(sessionId);
    if (!session) return;
    if (!session.provider || !session.model) return Promise.reject('请先选择模型');

    let userMsgIndex: number | undefined = undefined;
    let botMsgIndex: number | undefined = undefined;
    userMsgIndex = await saveMessage(sessionId, message, 'user', 'text', message, '', undefined);
    botMsgIndex = await saveMessage(sessionId, message, 'bot', 'text', '', '', undefined);
    callback?.onPreSaveMsg?.(userMsgIndex, botMsgIndex);
    // 观测回答数据中的指令
    watchArray(commands, () => {
      const titleCmd = commandMap.value['title'];
      if (titleCmd) {
        editSessionTitle(sessionId, titleCmd.values[0]);
        // console.log('findTitle', titleCmd, rawMsg.value);
        rawData.msg = rawData.msg.replace(titleCmd.raw, '');
      }
    });
    // 观测回答的变化
    watch(
      () => renderedMsg.value,
      (v, ov) => {
        if (v == ov) return;
        callback?.onMessage?.(v, rawData.msg); // 消息接收回调
      }
    );
    // 观测思考的变化
    watch(
      () => rawData.think,
      (v, ov) => {
        if (v == ov) return;
        callback?.onThinkMessage?.(v); // 消息接收回调
      }
    );

    // 处理指令
    const handleCommand = async (cp: CommandParser) => {
      const idCmd = cp.getCommandByName('ID');
      if (idCmd) {
        // 保存远程消息 ID
        const msgIds = [idCmd.data['q'], idCmd.data['a']];
        rawData.msg = rawData.msg.replace(idCmd.raw, '');
        await updateMessage(sessionId, userMsgIndex, { remoteId: msgIds[0] });
        await updateMessage(sessionId, botMsgIndex, { remoteId: msgIds[1] });
      }
    };

    // 中断时保存数据
    ctrl.signal.onabort = () => {
      botMsgIndex &&
        updateMessage(sessionId, botMsgIndex, {
          content: rawData.msg,
          reasoningContent: rawData.think,
          htmlContent: renderedMsg.value,
        });
      callback?.onFinish?.(renderedMsg.value);
    };

    return api.chat.completionStream(
      {
        provider: session.provider,
        modelName: session.model,
        sessionId: sessionId,
        msg: message,
        withContext: session.withContext,
      },
      ctrl.signal,
      async (event) => {
        if (event.event === 'done') {
          // 当接收到服务器端的结束标记时，数据库保存消息
          botMsgIndex &&
            await updateMessage(sessionId, botMsgIndex, {
              content: rawData.msg,
              reasoningContent: rawData.think,
              htmlContent: renderedMsg.value,
            });
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
        } else if (event.event === 'cmd') {
          await handleCommand(new CommandParser(event.data, true).parseJSON());
        }
      }
    );
  };

  const useSendMessageText = () => {
    const thinkMessage = shallowRef('');
    const answerMessage = shallowRef('');
    const isStreaming = shallowRef(false);
    const msgId = shallowRef<number>();
    let abortController = new AbortController();
    let timeout: number | undefined;

    const startStreaming = async (sessionId: string, message: string, customReceiver?: MessageCallback) => {
      isStreaming.value = true;
      abortController = new AbortController();
      return sendMessageText(
        sessionId,
        message,
        {
          ...(customReceiver || {}),
          onPreSaveMsg(userMsgId, botMsgId) {
            msgId.value = botMsgId
            customReceiver?.onPreSaveMsg?.(userMsgId, botMsgId);
          },
          onMessage(msg, originMsg) {
            answerMessage.value = msg;
            customReceiver?.onMessage?.(msg, originMsg);
            startTimeout();
          },
          onThinkMessage(msg) {
            thinkMessage.value = msg;
            customReceiver?.onThinkMessage?.(msg);
            startTimeout();
          },
        },
        abortController
      ).finally(() => {
        isStreaming.value = false;
        clearTimeout(timeout);
        clearMessage();
      });
    };

    const startTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        abortController.abort('no data for too long');
        ToastManager.danger('服务端超时');
      }, 60000);
    };

    const clearMessage = () => {
      answerMessage.value = '';
      thinkMessage.value = '';
      msgId.value = undefined;
    };

    return {
      isStreaming,
      msgId,
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
  async function saveMessage(
    sessionId: string,
    message: string,
    sender: 'user' | 'bot',
    type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'other',
    htmlMessage?: string,
    thinking?: string,
    remoteId?: string
  ): Promise<number> {
    try {
      return db.messages.add({
        sessionId,
        sender,
        type,
        remoteId,
        content: message,
        reasoningContent: thinking,
        htmlContent: htmlMessage,
        time: Date.now(),
      });
    } catch (err) {
      console.error(err);
      return -1;
    }
  }

  /**
   * 更新本地消息数据
   */
  async function updateMessage(sessionId: string, index: number, updateObj: Partial<MessageInfo>): Promise<boolean> {
    try {
      return (
        (await db.messages.where({ sessionId, id: index }).modify((obj) => {
          Object.entries(updateObj).forEach(([key, value]) => {
            obj[key] = value;
          });
        })) > 0
      );
    } catch (_) {
      return false;
    }
  }

  /**
   * 清除所有会话和消息缓存
   */
  async function clearAllData(): Promise<boolean> {
    try {
      await db.sessions.clear();
      await db.messages.clear();
      return true;
    } catch (_) {
      return false;
    }
  }

  async function searchDialog(text: string) {
    const res: SessionInfo[] = [];
    for (const session of sessions.value) {
      const messages = JSON.stringify(await db.messages.where({ sessionId: session.id }).toArray());
      if (
        messages &&
        (session.id.toLowerCase().indexOf(text.toLowerCase()) != -1 ||
          session.botRole.toLowerCase().indexOf(text.toLowerCase()) != -1 ||
          messages.toLowerCase().indexOf(text.toLowerCase()) != -1)
      ) {
        res.push(session);
      }
    }
    return res;
  }

  return {
    sessions,
    fetchSessions,
    updateSessionFlags,
    addDialog: addSession,
    editDialogTitle: editSessionTitle,
    toggleDialogContext: toggleSessionContext,
    changeDialogModel: changeSessionModel,
    delDialog: delSession,
    sendMessageText,
    clearAllData,
    searchDialog,
    useSendMessageText,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot));
}
