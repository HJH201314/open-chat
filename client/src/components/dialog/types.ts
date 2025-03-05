import type { CSSProperties, VNode } from 'vue';
import type { CusButtonProps } from '@/components/button/DiliButton';

type HandlerController = {
  signal: AbortSignal;
  abort: () => any;
};
type MethodType =
  ((abortController: HandlerController) => any)
  | ((abortController: HandlerController) => Promise<any>);
export type CommonDialogProps = {
  visible?: boolean;
  title?: string;
  subtitle?: string;
  content?: string;
  showCancel?: boolean;
  showConfirm?: boolean;
  cancelHandler?: MethodType;
  confirmHandler?: MethodType;

  // 样式调整
  modalStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  subtitleStyle?: CSSProperties;
  confirmButtonProps?: CusButtonProps;
  cancelButtonProps?: CusButtonProps;

  [key: string]: any;
}

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