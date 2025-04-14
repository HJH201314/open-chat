import { computed, type MaybeRefOrGetter, reactive, ref, shallowRef, toValue, watch } from 'vue';
import { toObserver, useSubscription } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '@/store/data/database.ts';
import type { MessageInfo, SessionInfo } from '@/types/data.ts';
import type { ApiSchemaMessage } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import useMarkdownIt, { renderMarkdown } from '@/commands/useMarkdownIt';
import { useTimeoutFn, watchThrottled } from '@vueuse/core';
import { useChatConfigStore } from '@/store/useChatConfigStore.ts';
import { CommandParser } from '@/utils/command-parser';
import api from '@/api';
import { useDataStore } from '@/store/data/useDataStore.ts';

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

/**
 * 更新消息数据
 * @param sessionId 会话 ID
 * @param messageIndex 消息本地 ID
 * @param extra 额外数据（增量更新）
 */
export const updateSessionMessageExtra = async (
  sessionId: string,
  messageIndex: number,
  extra: Record<string, any>
) => {
  if (!sessionId || !messageIndex) return false;

  // 更新本地消息
  try {
    await db.messages.where({ sessionId: sessionId, id: messageIndex }).modify((obj) => {
      obj['extra'] = {
        ...obj['extra'],
        ...extra,
      };
    });
  } catch (_) {
    return false;
  }
  // 更新远程消息
  try {
    // 查询远程消息 ID
    const localMsg = await db.messages.where({ sessionId: sessionId, id: messageIndex }).last();
    localMsg?.messageId &&
      (await genApi.Chat.messageUpdatePost(localMsg.messageId, {
        extra: extra,
      }));
  } catch (_) {
    return false;
  }
  return true;
};

/**
 * 响应式读取本地对话缓存
 * @param sessionId 会话 ID
 * @param queryMessage 是否查询消息（若只需要查询会话信息时可传入 false 节约资源）
 */
const useSession = (sessionId: MaybeRefOrGetter<string>, queryMessage: boolean = true) => {
  const resolvedSessionId = computed(() => toValue(sessionId));

  const session = ref<SessionInfo>({} as SessionInfo);
  const messages = ref<MessageInfo[]>([]);

  // sessionId 切换时，订阅新的 query
  watch(
    () => resolvedSessionId.value,
    (newSessionId) => {
      // 订阅 session
      useSubscription(
        liveQuery(async () => {
          return (await db.sessions.where({ id: resolvedSessionId.value }).last()) || ({} as SessionInfo);
        }).subscribe(toObserver(session))
      );

      // 订阅 message
      if (queryMessage) {
        useSubscription(
          liveQuery(async () => {
            // 先进行 time 排序，对于相同的 time 使用 远程ID 排序
            return (await db.messages.where({ sessionId: newSessionId }).sortBy('time')).sort((a, b) => {
              return a.time - b.time || Number(a.messageId || 0) - Number(b.messageId || 0);
            });
          }).subscribe(toObserver(messages))
        );
      }
    },
    { immediate: true }
  );

  const dataStore = useDataStore();

  async function editSessionTitle(newTitle: string, syncToRemote: boolean = true) {
    return dataStore.editDialogTitle(resolvedSessionId.value, newTitle, syncToRemote);
  }

  async function editSessionSystemPrompt(newSystemPrompt: string) {
    return dataStore.editDialogSystemPrompt(resolvedSessionId.value, newSystemPrompt);
  }

  async function updateSessionFlags(flags: SessionInfo['flags']) {
    return dataStore.updateSessionFlags(resolvedSessionId.value, flags);
  }

  async function addMessage(msg: MessageInfo) {
    return db.messages.add(msg);
  }

  async function getMessage(msgIndex: number) {
    return db.messages.get(msgIndex);
  }

  async function deleteMessage(msgIndex: number) {
    return db.messages.delete(msgIndex);
  }

  /**
   * 同步会话消息
   * @param sessionId 会话 ID
   * @param controller AbortController
   */
  async function syncMessages(sessionId: string, controller?: AbortController): Promise<boolean> {
    console.debug('syncMessages', sessionId);
    const abortController = controller || new AbortController();
    const remoteMessages: ApiSchemaMessage[] = [];
    let modelMap: Record<string, string> = {};
    // 获取所有远程数据
    let nextPage = 1;
    while (nextPage) {
      try {
        const res = await genApi.Chat.messageListGet(
          sessionId,
          {
            page_num: nextPage,
            page_size: 20,
          },
          {
            signal: abortController.signal,
          }
        );
        remoteMessages.push(...(res.data.data?.list || []));
        if (res.data.data?.model_map) modelMap = { ...modelMap, ...res.data.data.model_map };
        if (res.data.data?.next_page) nextPage = res.data.data?.next_page;
        else break;
      } catch (_) {
        ToastManager.danger('获取数据异常，请稍后重试～');
        return false;
      }
    }
    const newMessages = remoteMessages.map(
      (v) =>
        ({
          sessionId,
          messageId: v.id ? String(v.id) : undefined,
          time: new Date(v.created_at!).getTime(),
          sender: v.role === 'user' ? 'user' : 'bot',
          type: 'text',
          content: v.content,
          reasoningContent: JSON.parse(`"${v.reasoning_content}"`),
          htmlContent: v.role == 'assistant' ? renderMarkdown(v.content) : v.content,
          model: v.model_id ? modelMap[v.model_id] : '',
          extra: v.extra,
        }) as MessageInfo
    );
    try {
      // 删除旧数据
      await db.messages.where({ sessionId }).delete();
      // 插入新数据
      await db.messages.bulkAdd(newMessages);
    } catch (_) {
      ToastManager.warning('保存数据失败，请稍后重试');
      return false;
    }
    return true;
  }

  const chatConfigStore = useChatConfigStore();
  /**
   * 发送文本信息
   * @param message 发送的文本消息
   * @param  callback 回调
   * @param abort AbortController
   */
  const sendMessageText = async (message: string, callback?: MessageCallback, abort?: AbortController) => {
    if (message == '') return Promise.reject();
    const sessionId = resolvedSessionId.value;
    const ctrl = abort || new AbortController();
    const rawData = reactive({
      msg: '',
      think: '',
    });
    const { result: renderedMsg } = useMarkdownIt(() => rawData.msg);
    if (!session.value) return;
    if (!session.value.model || !chatConfigStore.chatModels.find((v) => v.name == session.value.model)) {
      session.value.model = chatConfigStore.defaultModel?.name;
      if (session.value.model) dataStore.changeDialogModel(sessionId, session.value.model);
      else return;
    }

    let userMsgIndex: number = 0;
    let botMsgIndex: number = 0;
    try {
      // 预插入消息
      userMsgIndex = await saveMessage(sessionId, message, 'user', 'text', '', message, '', undefined);
      botMsgIndex = await saveMessage(sessionId, '', 'bot', 'text', session.value.model, '', '', undefined);
      callback?.onPreSaveMsg?.(userMsgIndex, botMsgIndex);

      // 观测回答的变化
      const stopWatchingContent = watchThrottled(
        () => renderedMsg.value,
        (v, ov) => {
          if (v == ov) return;
          callback?.onMessage?.(v, rawData.msg); // 消息接收回调
        },
        { throttle: 150 }
      );
      // 观测思考的变化
      const stopWatchingReasoning = watchThrottled(
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
          await updateMessage(userMsgIndex, { messageId: msgIds[0] });
          await updateMessage(botMsgIndex, { messageId: msgIds[1] });
        }
        const tooltipCmd = cp.getCommandByName('tooltip');
        if (tooltipCmd) {
          const msg = await getMessage(botMsgIndex);
          await updateMessage(botMsgIndex, {
            extra: { tooltips: [...(msg?.extra?.tooltips || []), tooltipCmd.values.join('')] },
          });
        }
        const problemCmd = cp.getCommandByName('tool:question');
        if (problemCmd) {
          await updateMessage(botMsgIndex, { extra: { question: problemCmd.data } });
        }
        const examCmd = cp.getCommandByName('tool:exam');
        if (examCmd) {
          await updateMessage(botMsgIndex, { extra: { exam: examCmd.data } });
        }
        const birthdayCmd = cp.getCommandByName('tool:birthday-gift');
        if (birthdayCmd) {
          await updateMessage(botMsgIndex, { extra: { 'birthday-gift': birthdayCmd.values.join('') } });
        }
      };

      let usage: Record<string, any> = {};
      const saveBotMessage = async (extra: Record<string, any> = {}) => {
        console.debug('[saveBotMessage]', rawData.msg, renderedMsg.value);
        botMsgIndex &&
          (await updateMessage(botMsgIndex, {
            content: rawData.msg,
            reasoningContent: JSON.parse(`"${rawData.think}"`),
            htmlContent: renderedMsg.value || usage['content'] || '', // 如果渲染结果为空，可能是回复太快导致没有处理到数据，此时保存 usage 中的完整数据
            extra: extra,
          }));
      };

      // 提交处理
      return await api.chat.completionStream(
        {
          model_name: session.value.model,
          bot_id: session.value.botId,
          session_id: sessionId,
          question: message,
          enable_context: session.value.withContext,
          enable_search: session.value.withSearch,
        },
        ctrl.signal,
        async (event) => {
          if (event.event === 'done') {
            // 停止截流观测
            stopWatchingContent();
            stopWatchingReasoning();
            // 当接收到服务器端的结束标记时，数据库保存消息
            saveBotMessage(usage['extra'] || {}).finally(() => {
              callback?.onFinish?.(renderedMsg.value); // 消息接收完毕回调
            });
          } else if (event.event === 'msg') {
            const data = JSON.parse(event.data)?.content || '';
            console.debug('[msg]', event.data, `'${data}'`);
            rawData.msg += data; // 记录已接收的消息
          } else if (event.event === 'think') {
            const data = JSON.parse(event.data)?.content || '';
            console.debug('[think]', event.data, `'${data}'`);
            rawData.think += data;
          } else if (event.event === 'cmd') {
            await handleJSONCommand(new CommandParser(event.data, true).parseJSON());
          } else if (event.event === 'usage') {
            usage = JSON.parse(event.data);
          } else if (event.event === 'error') {
            callback?.onError?.();
          }
        }
      );
    } catch (err) {
      // 发生错误时，删除消息并继续抛出异常
      deleteMessage(userMsgIndex);
      deleteMessage(botMsgIndex);
      throw err;
    }
  };

  const useSendMessageText = () => {
    const thinkMessage = shallowRef('');
    const answerMessage = shallowRef('');
    const isStreaming = shallowRef(false);
    const msgId = shallowRef<number>();
    let abortController = new AbortController();

    const startStreaming = async (message: string, customReceiver?: MessageCallback) => {
      isStreaming.value = true;
      abortController = new AbortController();
      abortController.signal.addEventListener('abort', () => {
        innerCleanEffects();
      });
      clearMessage();
      await sendMessageText(
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
            customReceiver?.onFinish?.(msg);
            innerCleanEffects();
          },
          onError() {
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

    const { stop: stopTooLong, start: startTooLong } = useTimeoutFn(
      (msg: string) => {
        if (!abortController.signal.aborted) {
          abortController.abort('no data for too long');
          console.debug('[timeout]', 'no data for too long', msg);
          ToastManager.danger('服务端超时');
        }
      },
      60000000,
      {
        immediate: false,
      }
    );

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
    model: string,
    htmlMessage?: string,
    thinking?: string,
    messageId?: string
  ): Promise<number> {
    try {
      return db.messages.add({
        messageId,
        sessionId,
        sender,
        type,
        model,
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
  async function updateMessage(index: number, updateObj: Partial<MessageInfo>): Promise<boolean> {
    try {
      return (
        (await db.messages.where({ id: index }).modify((obj) => {
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
   * 更新消息 extra 数据
   */
  async function updateMessageExtra(index: number, obj: Record<string, any>): Promise<boolean> {
    return updateSessionMessageExtra(resolvedSessionId.value, index, obj);
  }

  return {
    session,
    messages,
    editSessionTitle,
    editSessionSystemPrompt,
    updateSessionFlags,
    addMessage,
    deleteMessage,
    updateMessageExtra,
    syncMessages,
    sendMessageText,
    useSendMessageText,
  };
};

export default useSession;
