import type { CSSProperties } from "vue";
import type { CusButtonProps } from "@/components/button/DiliButton";

export type CommonDialogProps = {
  title?: string;
  subtitle?: string;
  content?: string;
  showCancel?: boolean;

  // 样式调整
  modalStyle?: CSSProperties;
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