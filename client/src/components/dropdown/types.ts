import type { CSSProperties, InjectionKey, VNode } from 'vue';

export const DropdownCurrentInfoInjectionKey: InjectionKey<{
  currentOptionPath: DropdownOption[];
  currentValue: string | undefined;
  onSelect: (option: DropdownOption, valuePath: string[]) => void;
}> = Symbol('DropdownCurrentInfo');

export type DropdownOption = {
  label: string;
  value: string;
  icon?: string | VNode;
  children?: DropdownOption[];
  childrenMenuOption?: DropdownMenuProps;
};

export type DropdownMenuProps = {
  position?: 'top' | 'bottom' | 'left' | 'right'; // 弹出方位
  disabled?: boolean; // 是否禁用
};

export type DropdownMenuInnerProps = {
  _valuePath: string[];
  _depth: number;
} & DropdownMenuProps;


export type CusSelectEmits = {
  /**
   *
   * @param event 选中事件
   * @param value 选中的值
   * @param option 选中的项
   * @param valuePath （多级菜单）值的路径
   */
  (event: 'select', value: string, option: DropdownOption, valuePath: string[]): void;
};

export type CusSelectProps = {
  backgroundMode?: 'color' | 'transparent';
  options: DropdownOption[]; // 下拉选项，支持嵌套
  placeholder?: string; // 占位符
  labelRenderText?: (selectedOption?: DropdownOption, selectedOptionPath?: DropdownOption[]) => string | undefined;

  toggleStyle?: CSSProperties;
} & DropdownMenuProps;
