import type { CSSProperties } from "vue";
import type { CusButtonProps } from "@/components/button/DiliButton";

export type CommonDialogProps = {
  _id?: string; // DialogManager提供的唯一ID
  title?: string;
  subtitle?: string;
  content?: string;
  showCancel?: boolean;

  // 样式调整
  modalStyle?: CSSProperties;
  confirmButtonProps?: CusButtonProps;
  cancelButtonProps?: CusButtonProps;

  // 提供回调props，方便函数调用时使用
  onCancel?: (close: () => void) => void;
  onConfirm?: (close: () => void) => void;
}

export type CommonDialogEmits = {
  (event: 'onCancel', close: () => void): void;
  (event: 'onConfirm', close: () => void): void;
}

export type CommonDialogExpose = {
  show: () => void;
  close: () => void;
}