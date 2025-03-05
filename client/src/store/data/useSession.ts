import { computed, type MaybeRefOrGetter, ref, toValue, watch } from 'vue';
import { toObserver, useSubscription } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { db } from '@/store/data/database.ts';
import type { MessageInfo, SessionInfo } from '@/types/data.ts';

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
      return db.messages.where({ sessionId: newSessionId }).reverse().toArray();
    }).subscribe(toObserver(messages)));
  });

  async function addMessage(msg: MessageInfo) {
    return db.messages.add(msg);
  }

  async function deleteMessage(msgId: number) {
    return db.messages.delete(msgId);
  }

  return {
    session,
    messages,
    addMessage,
    deleteMessage,
  };
};

export default useSession;