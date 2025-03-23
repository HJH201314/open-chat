import { inject, type InjectionKey, provide, reactive, type Ref, watchEffect } from 'vue';
import { useLocalStorage } from '@vueuse/core';

type Theme = 'light' | 'dark';

const THEME_KEY: InjectionKey<{
  currentTheme: Ref<Theme>;
  toggleTheme: () => void;
  theme: Record<string, string>;
}> = Symbol('UseTheme');
const DEFAULT_THEME: Theme = 'light';

export const provideTheme = () => {
  const currentTheme = useLocalStorage<Theme>('theme', DEFAULT_THEME);
  const theme: Record<string, string> = reactive({
    colorPrimary: '#26a69a',
    colorBlack: '#000',
    colorWhite: '#fff',
    colorSuccess: '#52c41a',
    colorInfo: '#1890ff',
    colorWarning: '#faad14',
    colorDanger: '#ff4d4f',
  });

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  };

  watchEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${currentTheme.value}`);
  });

  const syncCssVars = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    // 获取相应变量并更新到 theme 对象中
    Object.entries(theme).forEach(([key, _]) => {
      theme[key] = rootStyles.getPropertyValue(`--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`).trim();
    });
    console.log(theme);
  };
  // 初始化时立即同步 CSS 变量
  syncCssVars();

  // 自动监听窗口变化
  if (typeof window !== 'undefined') {
    watchEffect((onCleanup) => {
      const observer = new MutationObserver(syncCssVars);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      onCleanup(() => observer.disconnect());
    });
  }

  provide(THEME_KEY, {
    currentTheme,
    toggleTheme,
    theme,
  });

  return {};
};

export const useTheme = () => {
  const themes = inject(THEME_KEY);

  if (!themes) {
    throw new Error('useTheme can only use in provide theme scopes!')
  }

  return themes;
};
