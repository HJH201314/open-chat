import type { InputHTMLAttributes } from "vue";

export type CusInputProps = {
  value?: string;
  modelValue?: string | number;
  placeholder?: string;
  disabled?: boolean;

  inputAttrs?: InputHTMLAttributes;
}