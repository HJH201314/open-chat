import type { CSSProperties } from "vue";
import type { CusButtonProps } from "@/components/button/DiliButton";

type CloseFunction = (callback?: () => void) => void;
export type CommonDialogProps = {
  _id?: string; // DialogManager 提供的唯一 ID
  title?: string;
  subtitle?: string;
  content?: string;
  showCancel?: boolean;

  // 样式调整
  modalStyle?: CSSProperties;
  confirmButtonProps?: CusButtonProps;
  cancelButtonProps?: CusButtonProps;

  // 提供回调props，方便函数调用时使用
  onCancel?: (close: CloseFunction) => void;
  onConfirm?: (close: CloseFunction) => void;
}

export type CommonDialogEmits = {
  (event: 'onCancel', close: CloseFunction): void;
  (event: 'onConfirm', close: CloseFunction): void;
}

export type CommonDialogExpose = {
  show: () => void;
  close: () => void;
}