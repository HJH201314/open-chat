import api from '@/api';
import useMarkdownIt from '@/commands/useMarkdownIt';
import showToast from '@/components/toast/toast.ts';
import { useSettingStore } from '@/store/useSettingStore.ts';
import type { MessageInfo, SessionInfo } from '@/types/data.ts';
import { CommandParser, useCommandParser } from '@/utils/command-parser';
import { useLocalStorage, useTimeoutFn, useToggle, watchArray, watchThrottled } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { h, reactive, ref, shallowRef, watch } from 'vue';
import ToastManager from '@/components/toast/ToastManager.ts';
import { toObserver, useSubscription } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db, resetDatabase } from '@/store/data/database.ts';
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
  onError?: () => void;
}

/* 数据相关 TODO: 迁移与单个 session 相关的操作到 useSession */
export const useDataStore = defineStore('data', () => {
  const userStore = useUserStore();

  // 由于 sessions 是异步加载的，所以直接判断 session 的长度来判断 sessions 是否为空不准确，此处通过 isSessionsEmpty 来判断
  const [isSessionsEmpty, changeSessionsEmpty] = useToggle(false);
  const sessions = ref<SessionInfo[]>([]);
  const sessionsFirstLoaded = ref(false);

  // userId 切换时，订阅新的 query
  watch(
    () => userStore.userId,
    (newUserId) => {
      // 用户变更后，重置 sessionsFirstLoaded
      sessionsFirstLoaded.value = false;
      // 订阅 session
      useSubscription(
        liveQuery(async () => {
          const res =
            (await db.sessions.where({ userId: newUserId }).reverse().sortBy('createAt')) || ([] as SessionInfo[]);
          changeSessionsEmpty(res.length == 0);
          sessionsFirstLoaded.value = true;
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

  async function updateSessionFlags(sessionId: string, flags: SessionInfo['flags']) {
    try {
      await db.sessions.where({ id: sessionId }).modify((session) => {
        session.flags = {
          ...(session.flags || {}),
          ...flags,
        };
      });
      if (flags?.isStared != undefined) {
        await genApi.Chat.sessionFlagPost(sessionId, {
          star: flags.isStared,
        })
      }
      return true;
    } catch (_) {
      return false;
    }
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

  const lastSyncTime = useLocalStorage('last-sync-time', 0);
  const [isFetchingSessions, changeFetchingStatus] = useToggle(false);

  /**
   * 从服务器拉取会话
   */
  async function syncSessions(abortController?: AbortController) {
    const controller = abortController || new AbortController();
    const updatedSessions: ApiSchemaUserSession[] = [];
    const deletedSessions: ApiSchemaUserSession[] = [];
    // 本地数据为空时，重置 lastSyncTime
    if (isSessionsEmpty.value) lastSyncTime.value = 0;
    changeFetchingStatus(true);
    // 获取所有远程数据
    let nextPage = 1;
    let serverTime = 0;
    while (nextPage) {
      try {
        const res = await genApi.Chat.sessionSyncGet(
          {
            page_num: nextPage,
            page_size: 20,
            last_sync_time: lastSyncTime.value || 0,
          },
          {
            signal: controller.signal,
          }
        );
        serverTime = new Date(res.headers['date']).getTime();
        updatedSessions.push(...(res.data.data?.updated || []));
        deletedSessions.push(...(res.data.data?.deleted || []));
        if (res.data.data?.next_page) nextPage = res.data.data?.next_page;
        else break;
      } catch (_) {
        changeFetchingStatus(false);
        return false;
      }
    }
    try {
      const sessionIdsToBeDeleted = deletedSessions.map((session) => session.session_id).filter((sessionId) => !!sessionId) as string[];
      const sessionsToBeCreated = [] as SessionInfo[];
      const sessionsToBeUpdated = [] as { key: string; changes: Partial<SessionInfo>; }[];
      // 组装所有需要缓存的数据
      for (const remoteUserSession of updatedSessions) {
        const remoteSession = remoteUserSession.session;
        const localSession = await db.sessions.where({ id: remoteSession?.id }).last();
        if (!localSession && remoteSession) {
          // 本地不存在但远端存在，创建
          sessionsToBeCreated.push({
            id: remoteSession.id!,
            // 若有，标题使用远程的名称，否则使用第一条消息的内容
            title: remoteSession.name || remoteSession.messages?.[0]?.content || '',
            avatar: '',
            botId: 0,
            botRole: '通用（默认）',
            createAt: new Date(remoteSession.created_at!).getTime(),
            withContext: !!remoteSession.enable_context,
            userId: remoteUserSession.user_id,
            provider: settingStore.settings.defaultProvider || chatConfigStore.defaultModel?.providerName,
            model: settingStore.settings.defaultModel || chatConfigStore.defaultModel?.modelName,
            flags: {
              needSync: true,
              isStared: remoteUserSession.flag_info?.star,
            },
          })
        } else if (localSession && remoteSession) {
          // 本地存在且远端存在，更新
          sessionsToBeUpdated.push({
            key: localSession.id,
            changes: {
              title: remoteSession.name || localSession.title || remoteSession.messages?.[0]?.content || '',
              createAt: new Date(remoteSession.created_at!).getTime(),
              userId: remoteUserSession.user_id,
              flags: {
                ...(localSession.flags || {}), // 保持本地数据
                isStared: remoteUserSession.flag_info?.star,
              },
            },
          })
        }
      }
      await db.transaction('rw', db.sessions, async () => {
        // 写入 db
        await db.sessions.bulkAdd(sessionsToBeCreated);
        await db.sessions.bulkUpdate(sessionsToBeUpdated);
        await db.sessions.bulkDelete(sessionIdsToBeDeleted);
      })
      // 成功后保存时间戳
      lastSyncTime.value = serverTime;
    } catch (_) {
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
    const handleJSONCommand = async (cp: CommandParser) => {
      const idCmd = cp.getCommandByName('ID');
      if (idCmd) {
        // 保存远程消息 ID
        const msgIds = [idCmd.data['q'], idCmd.data['a']];
        rawData.msg = rawData.msg.replace(idCmd.raw, '');
        await updateMessage(sessionId, userMsgIndex, { remoteId: msgIds[0] });
        await updateMessage(sessionId, botMsgIndex, { remoteId: msgIds[1] });
      }
      const tooltipCmd = cp.getCommandByName('tooltip');
      if (tooltipCmd) {
        await updateMessage(sessionId, botMsgIndex, { extra: { 'tooltip': tooltipCmd.values.join('') } });
      }
      const problemCmd = cp.getCommandByName('tool:question');
      if (problemCmd) {
        await updateMessage(sessionId, botMsgIndex, { extra: { 'question': problemCmd.data } });
      }
      const examCmd = cp.getCommandByName('tool:exam');
      if (examCmd) {
        await updateMessage(sessionId, botMsgIndex, { extra: { 'exam': examCmd.data } });
      }
    };

    const saveBotMessage = async () => {
      console.log('[saveBotMessage]', rawData.msg, renderedMsg.value);
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
          await handleJSONCommand(new CommandParser(event.data, true).parseJSON());
        } else if (event.event === 'error') {
          callback?.onError?.();
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
          onPreSaveMsg(userMsgId, botMsgId) {
            msgId.value = botMsgId;
            customReceiver?.onPreSaveMsg?.(userMsgId, botMsgId);
          },
          onMessage(msg, originMsg) {
            answerMessage.value = msg;
            customReceiver?.onMessage?.(msg, originMsg);
            isStreaming.value && restartTimeout(originMsg);
          },
          onThinkMessage(msg) {
            thinkMessage.value = msg;
            customReceiver?.onThinkMessage?.(msg);
            isStreaming.value && restartTimeout(msg);
          },
          onFinish(msg) {
            ToastManager.normal('回答完成', { position: 'top-right', icon: h(Correct) });
            customReceiver?.onFinish?.(msg);
            innerCleanEffects();
          },
          onError() {
            ToastManager.danger('出错了，换个姿势再试吧~', { position: 'top-right' });
            customReceiver?.onError?.();
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
      stopTooLong();
    };

    const {
      isPending: isTooLongPending,
      stop: stopTooLong,
      start: startTooLong,
    } = useTimeoutFn((msg: string) => {
      if (!abortController.signal.aborted) {
        abortController.abort('no data for too long');
        console.debug('[timeout]', 'no data for too long', msg);
        ToastManager.danger('服务端超时');
      }
    }, 60000000, {
      immediate: false,
    });

    const restartTimeout = (msg: string = '') => {
      stopTooLong();
      startTooLong(msg);
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
      await resetDatabase();
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
          messages.toLowerCase().indexOf(text.toLowerCase()) != -1)
      ) {
        res.push(session);
      }
    }
    return res;
  }

  return {
    sessions,
    sessionsFirstLoaded,
    isSessionsEmpty,
    isFetchingSessions,
    syncSessions,
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
