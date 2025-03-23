import type { InjectionKey } from 'vue';

export type CusRadioGroupProps = {
  name?: string;
  type?: 'normal' | 'highlight';
  direction?: 'row' | 'column';
  barAnimation?: boolean;
};

export type CusRadioButtonProps = {
  name?: string;
  value?: any;
  label?: string;
};

export const CheckedClassName = 'cus-radio-checked';

export const RadioGroupInjectionKey: InjectionKey<{
  name: string;
  type: Required<CusRadioGroupProps>['type'];
  direction: Required<CusRadioGroupProps>['direction'];
  value: any;
  setValue: (v?: any) => void;
  setElement: (e?: HTMLElement) => void;
}> = Symbol('RadioGroupProvide');

export const RadioButtonInjectionKey: InjectionKey<{}> = Symbol('RadioButtonProvide');
