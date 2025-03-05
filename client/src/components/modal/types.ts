import type { CSSProperties, Ref } from 'vue';

export type CommonModalProps = {
  showClose?: boolean;
  visible?: boolean; // 默认不展示
  modalStyle?: CSSProperties;
}

export type CommonModalFunc = {
  open: () => void;
  close: (callbackFn?: () => void) => void;
  isVisible: Ref<boolean>;
}