import type { VNode } from 'vue';

export type SidebarEntry = {
  key: string;
  name: string;
  // icon 若直接使用string，需要使用 app.component 注册
  icon: string | VNode;
  href?: string;
  // 额外的判断入口是否激活
  active?: (path: string) => boolean;
  onClick?: () => void;
};