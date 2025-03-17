import type { CSSProperties } from "vue";

export type CusButtonProps = {
  text?: string;
  icon?: string;
  type?: 'normal' | 'primary' | 'secondary' | 'text';
  backgroundColor?: string;
  fontColor?: string;
  minWidth?: CSSProperties['min-width'];
  shadow?: boolean;
  disabled?: boolean;

  // 自定义样式
  buttonStyle?: CSSProperties;
}

export type CusButtonEmits = {
  (event: 'click'): void;
}