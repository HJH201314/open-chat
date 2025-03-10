import type { InjectionKey } from 'vue';

export type CusRadioGroupProps = {
  modelValue?: string;
  name?: string;
  type?: 'normal' | 'highlight';
};

export type CusRadioButtonProps = {
  name?: string;
  value?: string;
  label?: string;
};

export const CheckedClassName = 'cus-radio-checked';

export const RadioGroupInjectionKey: InjectionKey<{
  name: string;
  type: Required<CusRadioGroupProps>['type'];
  value: string;
  setValue: (v?: string) => void;
  setElement: (e?: HTMLElement) => void;
}> = Symbol('RadioGroupProvide');

export const RadioButtonInjectionKey: InjectionKey<{}> = Symbol('RadioButtonProvide');
