import type { CSSProperties } from "vue";

export type DiliButtonProps = {
  text?: string;
  icon?: string;
  type?: 'normal' | 'primary' | 'text';
  backgroundColor?: string;
  fontColor?: string;
  shadow?: boolean;
  disabled?: boolean;

  // 自定义样式
  buttonStyle?: CSSProperties;
}

export type DiliButtonEmits = {
  (event: 'click'): void;
}