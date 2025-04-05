/* Dialog信息 */
export type DialogInfo = {
  id: string; // 对应session_id
  title: string;
  avatarPath: string;
  digest: string;
  botRole: string; // bot角色
  storageKey: string;
  createAt: string;
  withContext?: boolean; // 是否启用上下文
  provider?: string; // 模型供应商
  model?: string; // 模型名称
};

/* Storage中储存的Dialog数据列表 */
export type DialogData = {
  dialogs?: Record<string, DialogInfo>;
  version?: number;
};

/* Msg信息 */
export type MsgInfo = {
  id?: string; // 服务器消息 ID
  time: string; // 消息发送/接收时间
  sender: 'user' | 'bot'; // 消息发送者
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'other' | 'question'; // 消息类型
  content: string; // 消息原始内容
  reasoningContent?: string; // 思考消息原始内容
  htmlContent?: string; // 编译后的html 消息内容
  metadata?: Record<string, any>;

  [key: string]: any;
};

/* Storage中储存的Msg数据列表 */
export type MsgData = {
  messages?: MsgInfo[];
  version?: number;
};

/* 上方为旧版使用 localStorage 储存的数据，下方为 IndexedDB 数据结构 */

export type SessionInfo = {
  id: string; // session_id
  createAt?: number;
  title?: string;
  avatar?: string;
  botRole?: string; // bot角色名称
  botId?: number; // bot角色 ID
  withContext?: boolean; // 是否启用上下文
  userId?: number; // 用户 ID
  model?: string; // 模型名称
  flags?: SessionFlags;
};

export type SessionFlags = {
  needSync?: boolean; // 是否需要从服务器同步消息数据
  isStared?: boolean; // 是否收藏
};

export type MessageInfo = {
  sessionId: string; // 关联 session_id
  messageId?: string; // 服务器消息ID
  time: number; // 消息发送/接收时间
  sender: 'user' | 'bot'; // 消息发送者
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'other' | 'problem'; // 消息类型
  content: string; // 消息原始内容
  reasoningContent?: string; // 思考消息原始内容
  htmlContent?: string; // 编译后的html 消息内容
  model?: string; // 模型名称
  extra?: Record<string, any>;

  [key: string]: any;
};
