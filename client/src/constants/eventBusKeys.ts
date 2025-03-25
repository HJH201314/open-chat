import type { EventBusKey } from '@vueuse/core';

// 加载动画
export const siteLoadingKey: EventBusKey<'start' | 'finish'> = Symbol('site-loading');

// 切换侧边栏显隐
export const toggleSidebarKey: EventBusKey<boolean> = Symbol('toggle-sidebar');

// 切换侧边栏展开
export const toggleSidebarExpandKey: EventBusKey<boolean> = Symbol('expand-sidebar');

// 切换 panel 周围 padding 显隐
export const noPaddingKey: EventBusKey<boolean> = Symbol('no-padding');
