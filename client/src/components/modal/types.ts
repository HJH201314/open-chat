import type { CSSProperties, MaybeRef, Ref, RendererElement } from 'vue';

export type CommonModalProps = {
  visible?: boolean; // 默认不展示
  teleportTo?: MaybeRef<RendererElement | string | null>;
  showClose?: boolean;
  showBodyTransition?: boolean;
  closeOnESC?: boolean;
  closeOnClickMask?: boolean;
  draggable?: boolean;

  maskStyle?: CSSProperties;
  modalStyle?: CSSProperties;
  modalTransitionName?: string;
  presetBody?: boolean; // 是否预设body样式（默认 false）
  forceZIndex?: number; // 强行指定 z-index，这会破坏多级弹窗的 z-index 顺序
};

export type CommonModalFunc = {
  open: () => void;
  close: (callbackFn?: () => void) => void;
  isVisible: Ref<boolean>;
};