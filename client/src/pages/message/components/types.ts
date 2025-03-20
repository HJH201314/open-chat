import type { DropdownOption } from '@/components/dropdown/types.ts';
import type { MessageInfo } from '@/types/data.ts';

export type DialogActionProps = {
  title: string;
  messageCount: number;
  hasPermission: boolean;
  isLogin: boolean;
  messageSyncing: boolean;
};

export type DialogActionEmits = {
  (e: 'back'): void;
  (e: 'share'): void;
  (e: 'sync'): void;
  (e: 'edit'): void;
  (e: 'editSystemPrompt'): void;
  (e: 'delete'): void;
  (e: 'actionTipClick'): void;
};

export type DialogInputProps = {
  // 数据参数
  providerDropdown?: DropdownOption[];
  botDropdown?: DropdownOption[];

  // 控制参数
  isStreaming?: boolean;
  hideSelf?: boolean;
  displayInMiddle?: boolean;
  showModelSelector?: boolean;
  showBotSelector?: boolean;
  showContextToggle?: boolean;
};

export type DialogInputEmits = {
  (e: 'send'): void;
  (e: 'modelSelect', path: string[]): void;
  (e: 'botSelect', value: number): void;
};

export type DialogDetailProps = {
  dialogId: string;
  messages: MessageInfo[];
  isReceivingMsg: boolean;
  answerMsgId?: number; // 用于判断当前正在输出的消息，进行异化展示
  answerMsg: string;
  thinkMsg: string;
  isSmallScreen: boolean;
} & DialogActionProps & // 透传操作模块参数
  Pick<
    DialogInputProps,
    'providerDropdown' | 'botDropdown' | 'showModelSelector' | 'showBotSelector' | 'showContextToggle'
  >; // 透传输入模块参数

export type DialogDetailEmits = DialogActionEmits & // 透传操作模块事件
  DialogInputEmits; // 透传输入模块事件
