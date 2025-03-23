import type { InjectionKey } from 'vue';

// 多选组件类型定义
export type CusCheckboxGroupProps = {
  name?: string;
  type?: 'normal' | 'highlight';
  barAnimation?: boolean;
};

export type CusCheckboxButtonProps = {
  name?: string;
  value?: any;
  label?: string;
  disabled?: boolean;
};

export const CheckboxCheckedClassName = 'cus-checkbox-checked';

export const CheckboxGroupInjectionKey: InjectionKey<{
  name: string;
  type: Required<CusCheckboxGroupProps>['type'];
  values: any[];
  toggleValue: (v?: any) => void;
  isSelected: (v?: any) => boolean;
}> = Symbol('CheckboxGroupProvide');

export const CheckboxButtonInjectionKey: InjectionKey<{}> = Symbol('CheckboxButtonProvide');
