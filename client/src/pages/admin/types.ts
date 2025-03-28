import type { InjectionKey, Ref } from 'vue';

export const AdminLayoutContentSizeKey: InjectionKey<{
  width: Ref<number>;
  height: Ref<number>;
  contentRef: Ref<HTMLElement | null>;
}> = Symbol('AdminLayoutContentSizeKey');
