import type { CSSProperties, MaybeRef, Ref, RendererElement } from 'vue';

export type CommonModalProps = {
  teleportTo?: MaybeRef<RendererElement | string | null>;
  showClose?: boolean;
  showBodyTransition?: boolean;
  closeOnESC?: boolean;
  closeOnClickMask?: boolean;
  visible?: boolean; // 默认不展示
  maskStyle?: CSSProperties;
  modalStyle?: CSSProperties;
  presetBody?: boolean; // 是否预设body样式（默认 false）
  zIndex?: number; // 强行指定 z-index，这会破坏多级弹窗的 z-index 顺序
}

export type CommonModalFunc = {
  open: () => void;
  close: (callbackFn?: () => void) => void;
  isVisible: Ref<boolean>;
}