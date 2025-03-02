import type { CSSProperties } from "vue";
import type { CusButtonProps } from "@/components/button/DiliButton";

type HandlerController = {
  signal: AbortSignal;
  abort: () => any;
};
type MethodType = ((abortController: HandlerController) => any) | ((abortController: HandlerController) => Promise<any>);
export type CommonDialogProps = {
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
}

export type CommonDialogEmits = {
  (event: 'cancel'): void;
  (event: 'confirm'): void;
  (event: 'after-close'): void;
}

export type CommonDialogExpose = {
  show: () => void;
  close: () => void;
}