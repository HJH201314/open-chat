import type { VNode } from 'vue';

export type SidebarEntry = {
  key: string;
  name: string;
  // icon 若直接使用string，需要使用 app.component 注册
  icon: string | VNode;
  href?: string;
  onClick?: () => void;
};