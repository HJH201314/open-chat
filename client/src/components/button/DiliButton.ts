import type { CSSProperties } from 'vue';

export type CusButtonProps = {
  text?: string;
  icon?: string;
  type?: 'normal' | 'primary' | 'secondary' | 'tertiary' | 'text'; // 按钮的强调样式
  color?: string; // 按钮的主色
  backgroundColor?: string; // 强制指定按钮背景色
  fontColor?: string; // 强制指定按钮文字色
  minWidth?: CSSProperties['min-width'];
  shadow?: boolean | CSSProperties['box-shadow'];
  disabled?: boolean;

  // 自定义样式
  buttonStyle?: CSSProperties;
};

export type CusButtonEmits = {
  (event: 'click'): void;
};
