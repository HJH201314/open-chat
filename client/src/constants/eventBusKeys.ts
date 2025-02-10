import type { EventBusKey } from '@vueuse/core';

// 切换侧边栏显隐
export const toggleSidebarKey: EventBusKey<boolean> = Symbol('toggle-sidebar');

// 切换 panel 周围 padding 显隐
export const noPaddingKey: EventBusKey<boolean> = Symbol('no-padding');
