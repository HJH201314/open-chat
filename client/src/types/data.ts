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
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'other'; // 消息类型
  content: string; // 消息原始内容
  reasoningContent?: string; // 思考消息原始内容
  htmlContent?: string; // 编译后的html 消息内容

  [key: string]: any;
};

/* Storage中储存的Msg数据列表 */
export type MsgData = {
  messages?: MsgInfo[];
  version?: number;
};
