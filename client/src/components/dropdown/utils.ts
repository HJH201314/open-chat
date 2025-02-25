import type { DropdownMenuProps, DropdownOption } from '@/components/dropdown/types.ts';
import { treeMap } from '@liuli-util/tree';

/**
 * 为菜单选项添加设置
 * @param options 选项节点列表
 * @param fn 返回设置
 */
export const addChildrenDropdownOptions = (options: DropdownOption[], fn: (option: DropdownOption, depth: number) => DropdownMenuProps): DropdownOption[] => {
  return treeMap(options, (t, path) => {
    return {
      ...t,
      childrenMenuOption: fn(t, path.length),
    } as DropdownOption;
  }, {
    id: 'value',
    children: 'children',
  });
};