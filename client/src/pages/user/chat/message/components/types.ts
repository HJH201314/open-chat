import type { DropdownOption } from '@/components/dropdown/types.ts';
import type { MessageInfo, SessionInfo } from '@/types/data.ts';
import type { InjectionKey, Ref } from 'vue';
import type { useScroll } from '@vueuse/core';

export type DialogDetailSlots = {
  action: (props: { detailArrivedState: ReturnType<typeof useScroll>['arrivedState'] }) => any;
  input: (props: { detailArrivedState: ReturnType<typeof useScroll>['arrivedState'] }) => any;
  empty: () => any;
};

export type DialogActionProps = {
  title?: string;
  messageCount?: number;
  hasPermission?: boolean;
  isLogin?: boolean;
  shadowed?: boolean;
  isStared?: boolean;
  isShared?: boolean;
  messageSyncing?: boolean;
  showMenu?: boolean; // 是否展示菜单/菜单入口
  canExpandMenu?: boolean; // 是否允许展开菜单
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
  emptyTip?: string;
  session: SessionInfo;
  messages: MessageInfo[];
  isReceivingMsg?: boolean;
  answerMsgId?: number; // 用于判断当前正在输出的消息，进行异化展示
  answerMsg?: string; // 正在输出的回答消息
  thinkMsg?: string; // 正在输出的思考消息
  isSmallScreen?: boolean; // 是否小屏模式
  userInput?: string; // 当前用户输入的消息
  messageSyncing?: boolean;
}

export type DialogDetailEmits = DialogInputEmits; // 透传输入模块事件

// 在 DialogDetail 组件中，通过 provide/inject 传递插槽的 ref
type InjectSlots = Pick<DialogDetailSlots, 'action' | 'input'>;
export const DialogDetailSlotsInjectionKey: InjectionKey<{
  [K in keyof InjectSlots]: Ref<Maybe<HTMLDivElement>>;
} & {
  [K in keyof InjectSlots as `set${Capitalize<K>}Ref`]: (
    ref: Ref<Maybe<HTMLDivElement>>
  ) => void;
}> =
  Symbol('DialogDetailSlotInjectionKey');
