import type { DropdownOption } from '@/components/dropdown/types.ts';
import type { MessageInfo, SessionInfo } from '@/types/data.ts';

export type DialogActionProps = {
  title: string;
  messageCount: number;
  hasPermission: boolean;
  isLogin: boolean;
  shadowed?: boolean;
  isStared?: boolean;
  messageSyncing: boolean;
  canShowMenu?: boolean; // 是否允许展示菜单
  menuInMore?: boolean; // 菜单是否需要通过“更多”按钮打开
};

export type DialogActionEmits = {
  (e: 'back'): void;
  (e: 'star'): void;
  (e: 'share'): void;
  (e: 'sync'): void;
  (e: 'edit'): void;
  (e: 'delete'): void;
  (e: 'actionTipClick'): void;
};

export type DialogInputProps = {
  // 数据参数
  modelDropdown?: DropdownOption[];
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
  (e: 'modelSelect', value: string): void;
  (e: 'botSelect', value: number): void;
};

export type DialogDetailProps = {
  session: SessionInfo;
  messages: MessageInfo[];
  isReceivingMsg: boolean;
  answerMsgId?: number; // 用于判断当前正在输出的消息，进行异化展示
  answerMsg: string;
  thinkMsg: string;
  isSmallScreen: boolean;
} & Omit<DialogActionProps, 'title' | 'menuInMore'> & // 透传操作模块参数
  Pick<
    DialogInputProps,
    'modelDropdown' | 'botDropdown' | 'showModelSelector' | 'showBotSelector' | 'showContextToggle'
  >; // 透传输入模块参数

export type DialogDetailEmits = DialogActionEmits & // 透传操作模块事件
  DialogInputEmits; // 透传输入模块事件
