import type { MaybeRef, RendererElement, VNode } from 'vue';

export interface ToastProps {
  text?: string;
  position?:
    | 'top'
    | 'top-center'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right';
  teleportTo?: MaybeRef<RendererElement | string | null>;
  duration?: 'normal' | 'long' | 'short' | 'forever' | number;
  type?: 'normal' | 'success' | 'danger' | 'info' | 'warning';
  icon?: VNode;
  showIcon?: boolean;
  onClick?: () => void;
}
