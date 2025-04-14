import type { MessageInfo, SessionInfo } from '@/types/data.ts';

export interface MessageExtensionBaseProps {
  sessionInfo: SessionInfo; // 会话数据
  msgInfo: MessageInfo; // 消息数据
}
