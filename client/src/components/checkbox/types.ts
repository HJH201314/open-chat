import type { InjectionKey, Ref } from 'vue';

// 多选组件类型定义
export type CusCheckboxGroupProps = {
  name?: string;
  type?: 'normal' | 'highlight';
  barAnimation?: boolean;
  direction?: 'row' | 'column';
  backgroundMode?: 'color' | 'transparent';
  displayStyle?: 'background' | 'icon' | 'both';
};

export type CusCheckboxButtonProps = {
  name?: string;
  value?: any;
  label?: string;
  disabled?: boolean;
};

export const CheckboxCheckedClassName = 'cus-checkbox-checked';

export const CheckboxGroupInjectionKey: InjectionKey<{
  name: Ref<string>;
  type: Ref<Required<CusCheckboxGroupProps>['type']>;
  direction?: Ref<Required<CusCheckboxGroupProps>['direction']>;
  displayStyle: Ref<Required<CusCheckboxGroupProps>['displayStyle']>;
  values: Ref<any[]>;
  toggleValue: (v?: any) => void;
  isSelected: (v?: any) => boolean;
}> = Symbol('CheckboxGroupProvide');

export const CheckboxButtonInjectionKey: InjectionKey<{}> = Symbol('CheckboxButtonProvide');
