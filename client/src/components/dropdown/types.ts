import type { CSSProperties, InjectionKey, Reactive, Ref, VNode } from 'vue';
import type { useElementBounding } from '@vueuse/core';

export const DropdownCurrentInfoInjectionKey: InjectionKey<{
  currentOptionPath?: Ref<DropdownOption[]>;
  currentValue?: Ref<string | undefined>;
  onSelect?: (option: DropdownOption, valuePath: string[]) => void;
}> = Symbol('DropdownCurrentInfo');

export type DropdownOption = {
  label: string;
  value: string;
  icon?: string | VNode | (() => VNode);
  style?: CSSProperties;
  onClick?: (option: DropdownOption, valuePath: string[]) => void;
  children?: DropdownOption[];
  childrenMenuOption?: DropdownMenuCommonProps;
};

export type Horizontal = 'left' | 'right';
export type Vertical = 'top' | 'bottom';
export type CombinedPosition = `${Vertical}-${Horizontal}` | `${Horizontal}-${Vertical}`;
export type DropdownMenuCommonProps = {
  position?: CombinedPosition | Horizontal | Vertical; // 弹出方位
  disabled?: boolean; // 是否禁用
};

export type DropdownMenuInnerProps = {
  _valuePath: string[];
  _depth: number;
} & DropdownMenuCommonProps;

export type DropdownMenuProps = {
  options: DropdownOption[];
  parentBounding: Omit<Reactive<ReturnType<typeof useElementBounding>>, 'update'>;
  isOpen: boolean;
} & DropdownMenuInnerProps;

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
} & DropdownMenuCommonProps;

export type CusContextMenuProps = {
  options?: DropdownOption[];
} & DropdownMenuCommonProps;

export type CusContextMenuEmits = CusSelectEmits;