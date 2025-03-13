import type { InjectionKey } from 'vue';

export const ThemeInjectionKey: InjectionKey<Record<string, string>> = Symbol('CusThemeProvide');