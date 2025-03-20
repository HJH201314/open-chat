import api from '@/api';
import useMarkdownIt from '@/commands/useMarkdownIt';
import showToast from '@/components/toast/toast.ts';
import { useSettingStore } from '@/store/useSettingStore.ts';
import type { MessageInfo, SessionInfo } from '@/types/data.ts';
import { CommandParser, useCommandParser } from '@/utils/command-parser';
import { useToggle, watchArray, watchThrottled } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { h, reactive, ref, shallowRef, watch } from 'vue';
import ToastManager from '@/components/toast/ToastManager.ts';
import { toObserver, useSubscription } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '@/store/data/database.ts';
import genApi from '@/api/gen-api.ts';
import { useChatConfigStore } from '@/store/useChatConfigStore.ts';
import type { ApiSchemaUserSession } from '@/api/gen/data-contracts.ts';
import { useUserStore } from '@/store/useUserStore.ts';
import { Correct } from '@icon-park/vue-next';

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

/* 数据相关 TODO: 迁移与单个 session 相关的操作到 useSession */
export const useDataStore = defineStore('data', () => {
  const userStore = useUserStore();

  // 由于 sessions 是异步加载的，所以直接判断 session 的长度来判断 sessions 是否为空不准确，此处通过 isSessionsEmpty 来判断
  const [isSessionsEmpty, changeSessionsEmpty] = useToggle(false);
  const sessions = ref<SessionInfo[]>([]);

  // userId 切换时，订阅新的 query
  watch(
    () => userStore.userId,
    (newUserId) => {
      // 订阅 session
      useSubscription(
        liveQuery(async () => {
          const res =
            (await db.sessions.where({ userId: newUserId }).reverse().sortBy('createAt')) || ([] as SessionInfo[]);
          changeSessionsEmpty(res.length == 0);
          return res;
        }).subscribe(toObserver(sessions))
      );
    },
    { immediate: true }
  );

  const chatConfigStore = useChatConfigStore();
  const settingStore = useSettingStore();

  async function getSessionInfo(sessionId: string) {
    return db.sessions.where({ id: sessionId }).last();
  }

  /**
   * 创建一个对话，成功返回 sessionId，失败返回 ''
   * @param botRoleId bot 角色 ID
   */
  async function addSession(botRoleId?: number) {
    try {
      // 获取session_id
      const { status, data } = await genApi.Chat.sessionNewPost();
      const sessionId = data.data;
      console.log(data);
      if (status === 200 && data.data) {
        await db.sessions.add({
          id: sessionId,
          userId: userStore.userId,
          title: '',
          avatar: '',
          botRole: botRoleId ? chatConfigStore.botsIdNameMap[botRoleId] : '通用',
          botId: botRoleId,
          createAt: Date.now(),
          withContext: true,
          provider: settingStore.settings.defaultProvider || chatConfigStore.defaultModel?.providerName,
          model: settingStore.settings.defaultModel || chatConfigStore.defaultModel?.modelName,
          flags: {},
        });
      }
      return sessionId;
    } catch (_) {
      showToast({ text: '请求失败，请稍候重试 TAT', type: 'danger', position: 'top-left' });
    }
    return '';
  }

  async function editSessionTitle(sessionId: string, newTitle: string) {
    // 本地修改
    await db.sessions.where({ id: sessionId }).modify((session) => {
      session.title = newTitle;
    });
    // 远程修改
    try {
      await genApi.Chat.sessionUpdatePost(sessionId, { name: newTitle });
    } catch (_) {
      ToastManager.danger('未能成功修改服务器数据');
    }
  }

  async function editSessionSystemPrompt(sessionId: string, newSystemPrompt: string) {
    // 远程修改
    try {
      const res = await genApi.Chat.sessionUpdatePost(sessionId, { system_prompt: newSystemPrompt });
      return !!res.data.data;
    } catch (_) {
      ToastManager.danger('修改失败，请稍后再试~');
      return false;
    }
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

  function changeSessionBot(sessionId: string, botId: number) {
    db.sessions.where({ id: sessionId }).modify((session) => {
      if (botId) {
        session.botId = botId;
        session.botRole = chatConfigStore.botsIdNameMap[botId];
      } else {
        session.botId = undefined;
        session.botRole = '通用';
      }
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

  const [isFetchingSessions, changeFetchingStatus] = useToggle(false);

  /**
   * 从服务器拉取会话
   */
  async function fetchSessions(abortController?: AbortController) {
    const controller = abortController || new AbortController();
    const remoteSessions: ApiSchemaUserSession[] = [];
    changeFetchingStatus(true);
    // 获取所有远程数据
    let nextPage = 1;
    while (nextPage) {
      try {
        const res = await genApi.Chat.sessionListGet(
          {
            page_num: nextPage,
            page_size: 20,
          },
          {
            signal: controller.signal,
          }
        );
        remoteSessions.push(...(res.data.data?.list || []));
        if (res.data.data?.next_page) nextPage = res.data.data?.next_page;
        else break;
      } catch (_) {
        ToastManager.danger('刷新数据异常，请稍后重试~');
        changeFetchingStatus(false);
        return false;
      }
    }
    try {
      // 组装所有需要缓存的数据
      const newSessions = await remoteSessions.reduce(
        async (sessionInfos, remoteUserSession) => {
          const remoteSession = remoteUserSession.session;
          const session = await db.sessions.where({ id: remoteSession?.id }).last();
          if (!session && remoteSession) {
            (await sessionInfos).push({
              id: remoteSession.id!,
              // 若有，标题使用远程的名称，否则使用第一条消息的内容
              title: remoteSession.name || remoteSession.messages?.[0]?.content || '',
              avatar: '',
              botRole: '未知',
              createAt: new Date(remoteSession.created_at!).getTime(),
              withContext: !!remoteSession.enable_context,
              userId: remoteUserSession.user_id,
              provider: settingStore.settings.defaultProvider || chatConfigStore.defaultModel?.providerName,
              model: settingStore.settings.defaultModel || chatConfigStore.defaultModel?.modelName,
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
      ToastManager.danger('刷新数据异常，请稍后重试~');
      changeFetchingStatus(false);
      return false;
    }
    changeFetchingStatus(false);
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
    botMsgIndex = await saveMessage(sessionId, '', 'bot', 'text', '', '', undefined);
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
    watchThrottled(
      () => renderedMsg.value,
      (v, ov) => {
        if (v == ov) return;
        callback?.onMessage?.(v, rawData.msg); // 消息接收回调
      },
      { throttle: 150 }
    );
    // 观测思考的变化
    watchThrottled(
      () => rawData.think,
      (v, ov) => {
        if (v == ov) return;
        callback?.onThinkMessage?.(JSON.parse(`"${v}"`)); // 消息接收回调
      },
      { throttle: 150 }
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

    const saveBotMessage = async () => {
      console.log('[saveBotMessage]', rawData.msg, renderedMsg.value)
      botMsgIndex &&
        (await updateMessage(sessionId, botMsgIndex, {
          content: rawData.msg,
          reasoningContent: JSON.parse(`"${rawData.think}"`),
          htmlContent: renderedMsg.value,
        }));
    };

    return api.chat.completionStream(
      {
        provider_name: session.provider,
        model_name: session.model,
        bot_id: session.botId,
        session_id: sessionId,
        question: message,
        enable_context: session.withContext,
      },
      ctrl.signal,
      async (event) => {
        if (event.event === 'done') {
          // 当接收到服务器端的结束标记时，数据库保存消息
          saveBotMessage().finally(() => {
            callback?.onFinish?.(renderedMsg.value); // 消息接收完毕回调
          });
        } else if (event.event === 'msg') {
          const data = JSON.parse(event.data)?.content;
          console.log('[msg]', event.data, `'${data}'`);
          rawData.msg += data; // 记录已接收的消息
        } else if (event.event === 'think') {
          const data = JSON.parse(event.data)?.content;
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
      abortController.signal.addEventListener('abort', () => {
        innerCleanEffects();
      });
      clearMessage();
      return sendMessageText(
        sessionId,
        message,
        {
          ...(customReceiver || {}),
          onPreSaveMsg(userMsgId, botMsgId) {
            msgId.value = botMsgId;
            customReceiver?.onPreSaveMsg?.(userMsgId, botMsgId);
          },
          onMessage(msg, originMsg) {
            answerMessage.value = msg;
            customReceiver?.onMessage?.(msg, originMsg);
            startTimeout(originMsg);
          },
          onThinkMessage(msg) {
            thinkMessage.value = msg;
            customReceiver?.onThinkMessage?.(msg);
            startTimeout(msg);
          },
          onFinish(msg) {
            ToastManager.normal('回答完成', { position: 'top-right', icon: h(Correct) });
            customReceiver?.onFinish?.(msg);
            innerCleanEffects();
          },
        },
        abortController
      ).finally(() => {
        innerCleanEffects();
      });
    };

    const innerCleanEffects = () => {
      isStreaming.value = false;
      clearTimeout(timeout);
    };

    const startTimeout = (msg: string = '') => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!abortController.signal.aborted) {
          abortController.abort('no data for too long');
          console.debug('[timeout]', 'no data for too long', msg);
          ToastManager.danger('服务端超时');
        }
      }, 10000);
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
      stop: () => abortController.abort('user stop'),
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
    isSessionsEmpty,
    isFetchingSessions,
    fetchSessions,
    updateSessionFlags,
    changeSessionBot,
    addDialog: addSession,
    editDialogTitle: editSessionTitle,
    editDialogSystemPrompt: editSessionSystemPrompt,
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
