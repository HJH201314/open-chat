import type { InjectionKey, Ref } from 'vue';

export type CusRadioGroupProps = {
  defaultValue?: any;
  name?: string;
  type?: 'normal' | 'highlight';
  direction?: 'row' | 'column';
  barAnimation?: boolean;
  backgroundMode?: 'color' | 'transparent';
  displayStyle?: 'background' | 'icon';
};

export type CusRadioButtonProps = {
  name?: string;
  value?: any;
  label?: string;
};

export const CheckedClassName = 'cus-radio-checked';

export const RadioGroupInjectionKey: InjectionKey<{
  name: Ref<string>;
  type: Ref<Required<CusRadioGroupProps>['type']>;
  direction: Ref<Required<CusRadioGroupProps>['direction']>;
  displayStyle: Ref<Required<CusRadioGroupProps>['displayStyle']>;
  value: Ref<any>;
  setValue: (v?: any) => void;
  setElement: (e?: HTMLElement) => void;
}> = Symbol('RadioGroupProvide');

export const RadioButtonInjectionKey: InjectionKey<{}> = Symbol('RadioButtonProvide');
