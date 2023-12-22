import type { InputHTMLAttributes } from "vue";

export type CusInputProps = {
  value?: string;
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;

  inputAttrs?: InputHTMLAttributes;
}