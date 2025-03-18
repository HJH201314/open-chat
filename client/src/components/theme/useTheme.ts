import { inject, reactive } from 'vue';
import { ThemeInjectionKey } from './types';

export const useTheme = () => {
  const theme = inject(ThemeInjectionKey);

  if (!theme) {
    throw new Error('useTheme must be used within a CusThemeProvider');
  }

  return {
    // 主题色
    primaryColor: theme.colorPrimary,
    // 获取所有主题变量
    theme: reactive(theme),
  };
} 