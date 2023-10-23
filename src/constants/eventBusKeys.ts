// fooKey.ts
import type { EventBusKey } from '@vueuse/core'
export const toggleSidebarKey: EventBusKey<boolean> = Symbol('toggle-sidebar')