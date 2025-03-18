import type { InjectionKey } from 'vue';

export type BaseThemeTokenKeys = {
  colorPrimary: string;
  colorSuccess: string;
  colorInfo: string;
  colorWarning: string;
  colorDanger: string;

  [key: string]: string;
}

export type ThemeKeyType = keyof BaseThemeTokenKeys | string

export const ThemeInjectionKey: InjectionKey<Record<ThemeKeyType, string>> = Symbol('CusThemeProvide');