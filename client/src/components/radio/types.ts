import type { InjectionKey } from 'vue';

export type CusRadioGroupProps = {
  modelValue?: string;
  name?: string;
}

export type CusRadioButtonProps = {
  name?: string;
  value?: string;
  label?: string;
}

export const CheckedClassName = 'cus-radio-checked';

export const RadioGroupInjectionKey: InjectionKey<{
  name: string;
  value: string;
  setValue: (v?: string) => void;
  setElement: (e?: HTMLElement) => void;
}> = Symbol('RadioGroupProvide');

export const RadioButtonInjectionKey: InjectionKey<{}> = Symbol('RadioButtonProvide');