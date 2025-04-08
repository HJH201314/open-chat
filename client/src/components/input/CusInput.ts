import type { InputHTMLAttributes } from "vue";

export type CusValidator = {
  regex?: RegExp;
  length?: number;
  minLength?: number;
  maxLength?: number;

  error?: boolean;
  errorMsg?: string;
}
export type CusInputProps = {
  value?: string;
  modelValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  validate?: CusValidator[];

  inputAttrs?: InputHTMLAttributes;
}