import type { CSSProperties } from 'vue';

export type DropdownOption = {
  label: string;
  value: string;
  children?: DropdownOption[];
  childrenMenuOption?: DropdownMenuProps;
};

export type DropdownMenuEmits = {
  /**
   *
   * @param event 选中事件
   * @param value 选中的值
   * @param option 选中的项
   * @param valuePath （多级菜单）值的路径
   */
  (event: 'select', value: string, option: DropdownOption, valuePath: string[]): void;
};

export type DropdownMenuProps = {
  position?: 'top' | 'bottom' | 'left' | 'right'; // 弹出方位
  disabled?: boolean; // 是否禁用
  selectedValue?: string | undefined;
};

export type DropdownMenuInnerProps = {
  _valuePath: string[];
  _currentOptionPath?: DropdownOption[];
  _depth: number;
} & DropdownMenuProps;

export type CusSelectProps = {
  modelValue?: string; // 双向绑定
  options: DropdownOption[]; // 下拉选项，支持嵌套
  placeholder?: string; // 占位符
  labelRenderText?: (selectedOption?: DropdownOption, selectedOptionPath?: DropdownOption[]) => string | undefined;

  toggleStyle?: CSSProperties;
} & DropdownMenuProps;
