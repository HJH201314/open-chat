// db.ts
import Dexie, { type EntityTable } from 'dexie';
import type { MessageInfo, SessionInfo } from '@/types/data.ts';

export const db = new Dexie('ChatDatabase') as Dexie & {
  sessions: EntityTable<SessionInfo, 'id'>;
  messages: EntityTable<MessageInfo, 'id'>;
};

const defineDatabase = () => {
  // Schema declaration:
  db.version(8).stores({
    sessions: 'id, *userId, [id+userId], title, avatar, botRole, createAt, withContext, model, flags',
    messages: '++id, *messageId, *sessionId, [messageId+sessionId], time, sender, type, content, reasoningContent, htmlContent',
  });
};

export const initDatabase = async () => {
  try {
    defineDatabase();
    await db.open();
    console.debug('[IndexedDB] Database opened.');
  } catch (_) {
    await destroyDatabase();
  }
};

export const destroyDatabase = async () => {
  try {
    await db.delete();
    console.debug('[IndexedDB] Database deleted.');
  } catch (_) {
    // do nothing
  }
};

export const resetDatabase = async () => {
  await destroyDatabase();
  await initDatabase();
};
