import { computed, type MaybeRefOrGetter, ref, toValue, watch } from 'vue';
import { toObserver, useSubscription } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '@/store/data/database.ts';
import type { MessageInfo, SessionInfo } from '@/types/data.ts';
import type { ApiSchemaMessage } from '@/api/gen/data-contracts.ts';
import genApi from '@/api/gen-api.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import { renderMarkdown } from '@/commands/useMarkdownIt';

/**
 * 响应式读取本地对话缓存
 */
const useSession = (sessionId: MaybeRefOrGetter<string>) => {
  const resolvedSessionId = computed(() => toValue(sessionId));

  const session = ref<SessionInfo>({} as SessionInfo);
  const messages = ref<MessageInfo[]>([]);

  // sessionId 切换时，订阅新的 query
  watch(() => resolvedSessionId.value, (newSessionId) => {
    // 订阅 session
    useSubscription(liveQuery(async () => {
      return await db.sessions.where({ id: resolvedSessionId.value }).last() || ({} as SessionInfo);
    }).subscribe(toObserver(session)));

    // 订阅 message
    useSubscription(liveQuery(async () => {
      return db.messages.where({ sessionId: newSessionId }).reverse().sortBy('time');
    }).subscribe(toObserver(messages)));
  });

  async function addMessage(msg: MessageInfo) {
    return db.messages.add(msg);
  }

  async function deleteMessage(msgId: number) {
    return db.messages.delete(msgId);
  }

  /**
   * 同步会话消息
   * @param sessionId 会话 ID
   * @param controller AbortController
   */
  async function syncMessages(sessionId: string, controller?: AbortController): Promise<boolean> {
    const abortController = controller || new AbortController();
    const remoteMessages: ApiSchemaMessage[] = [];
    // 获取所有远程数据
    let nextPage = 1;
    while (nextPage) {
      try {
        const res = await genApi.Chat.messageListGet(
          sessionId,
          {
            page_num: nextPage,
            page_size: 20,
            sort_expr: 'id ASC',
          },
          {
            signal: abortController.signal,
          }
        );
        remoteMessages.push(...(res.data.data?.list || []));
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
          remoteId: v.id,
          time: new Date(v.created_at!).getTime(),
          sender: v.role === 'user' ? 'user' : 'bot',
          type: 'text',
          content: v.content,
          reasoningContent: JSON.parse(`"${v.reasoning_content}"`),
          htmlContent:
            v.role == 'assistant'
              ? renderMarkdown(v.content)
              : v.content,
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

  return {
    session,
    messages,
    addMessage,
    deleteMessage,
    syncMessages,
  };
};

export default useSession;