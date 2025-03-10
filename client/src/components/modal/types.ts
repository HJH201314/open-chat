import type { CSSProperties, MaybeRef, Ref, RendererElement } from 'vue';

export type CommonModalProps = {
  teleportTo?: MaybeRef<RendererElement | string | null>;
  showClose?: boolean;
  closeOnESC?: boolean;
  visible?: boolean; // 默认不展示
  maskStyle?: CSSProperties;
  modalStyle?: CSSProperties;
  presetBody?: boolean; // 是否预设body样式（默认 false）
}

export type CommonModalFunc = {
  open: () => void;
  close: (callbackFn?: () => void) => void;
  isVisible: Ref<boolean>;
}