import type { CSSProperties, VNode } from 'vue';
import type { CusButtonProps } from '@/components/button/DiliButton';
import type { CommonModalProps } from '@/components/modal/types.ts';

type HandlerController = {
  signal: AbortSignal;
  abort: () => any;
};
type MethodType =
  ((abortController: HandlerController) => any)
  | ((abortController: HandlerController) => Promise<any>);
export type CommonDialogProps = {
  type?: 'info' | 'warning' | 'danger' | 'success' | 'none';
  icon?: VNode;
  title?: string;
  subtitle?: string;
  content?: string;
  showClose?: boolean;
  showCancel?: boolean;
  showConfirm?: boolean;
  showHr?: boolean;
  cancelHandler?: MethodType;
  confirmHandler?: MethodType;

  // 样式调整
  modalStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  subtitleStyle?: CSSProperties;
  confirmButtonProps?: CusButtonProps;
  cancelButtonProps?: CusButtonProps;

  [key: string]: any;
} & Pick<CommonModalProps, 'closeOnClickMask'>

export type CommonDialogEmits = {
  (event: 'cancel'): void;
  (event: 'confirm'): void;
  (event: 'after-close'): void;
}

export type CommonDialogExpose = {
  show: () => void;
  close: () => void;
  // 立即触发确认
  confirm: () => Promise<void>;
}

export type CommonDialogSlots = {
  default?: () => VNode;
  action?: () => VNode;
}