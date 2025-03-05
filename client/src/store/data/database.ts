// db.ts
import Dexie, { type EntityTable } from 'dexie';
import type { MessageInfo, SessionInfo } from '@/types/data.ts';

const db = new Dexie('ChatDatabase') as Dexie & {
  sessions: EntityTable<
    SessionInfo,
    'id'
  >;
  messages: EntityTable<
    MessageInfo,
    'id'
  >;
};

// Schema declaration:
db.version(1).stores({
  sessions: '++, &id, title, avatar, botRole, createAt, withContext, provider, model, flags',
  messages: '++id, *sessionId, [id+sessionId], remoteId, time, sender, type, content, reasoningContent, htmlContent',
});

export { db };
