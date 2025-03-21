// db.ts
import Dexie, { type EntityTable } from 'dexie';
import type { MessageInfo, SessionInfo } from '@/types/data.ts';

export const db = new Dexie('ChatDatabase') as Dexie & {
  sessions: EntityTable<SessionInfo, 'id'>;
  messages: EntityTable<MessageInfo, 'id'>;
};

const defineDatabase = () => {
  // Schema declaration:
  db.version(1).stores({
    sessions: 'id, *userId, [id+userId], title, avatar, botRole, createAt, withContext, provider, model, flags',
    messages: '++id, *sessionId, [id+sessionId], remoteId, time, sender, type, content, reasoningContent, htmlContent',
  });
};

export const initDatabase = async () => {
  defineDatabase();
  await db.open();
  console.log('[IndexedDB] Database opened.');
};

export const destroyDatabase = async () => {
  await db.delete();
  console.log('[IndexedDB] Database deleted.');
};

export const resetDatabase = async () => {
  await destroyDatabase();
  await initDatabase();
};
