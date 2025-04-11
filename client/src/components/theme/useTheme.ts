import {
  inject,
  type InjectionKey,
  type MaybeRefOrGetter,
  provide,
  reactive,
  type Ref,
  toValue,
  watchEffect,
} from 'vue';
import { tryOnMounted, useLocalStorage } from '@vueuse/core';
import tinycolor from 'tinycolor2';

type Theme = 'light' | 'dark';

const THEME_KEY: InjectionKey<{
  currentTheme: Ref<Theme>;
  toggleTheme: () => void;
  setThemeColor: (color1000: string) => void;
  theme: Record<string, string>;
}> = Symbol('UseTheme');
const DEFAULT_THEME: Theme = 'light';
export const DEFAULT_COLOR: string = '#757cbd';

/**
 * 设置主题色
 * @param colorPrimary 主题色
 * @param name 名称
 */
export const registerThemeColor = (colorPrimary: string, name?: string) => {
  if (typeof window !== 'undefined') {
    const baseColor = tinycolor(colorPrimary);
    if (!baseColor.isValid()) return;

    const root = document.documentElement;
    const baseLevel = 400; // 输入的主题色是 400
    const levelList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const result: string[] = [];
    levelList.forEach((level, index) => {
      let tintedColor: string = '';
      if (level <= baseLevel) {
        tintedColor = tinycolor.mix('#fff', baseColor, (level / baseLevel) * 100).toHexString();
      } else {
        if (index < 1) throw new Error('Invalid color level');
        // 颜色加深时，以上一个色阶为基准进行加深
        tintedColor = tinycolor
          .mix(result[index - 1], '#000', ((level - levelList[index - 1]) / levelList[index - 1]) * 100)
          .toHexString();
      }
      root.style.setProperty(`--color-primary-${level}`, tintedColor);
      name && root.style.setProperty(`--color-${name}-${level}`, tintedColor);
      result.push(tintedColor);
    });
  }
};

/**
 * 将主题色重置为默认值
 */
export const resetThemeColor = () => {
  registerThemeColor(localStorage.getItem('theme-color') || DEFAULT_COLOR, 'default');
}

export const saveThemeColor = (colorPrimary: string) => {
  localStorage.setItem('theme-color', colorPrimary);
}

export const useThemeColor = (colorPrimary?: MaybeRefOrGetter<string>, name?: string) => {
  const colorStorage = useLocalStorage<string>('theme-color', toValue(colorPrimary || DEFAULT_COLOR), {
    listenToStorageChanges: true,
  });

  tryOnMounted(() => {
    watchEffect(() => {
      registerThemeColor(colorStorage.value, name);
    });
  });
};

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
    colorGrey100: '',
    colorGrey200: '',
    colorGrey300: '',
    colorGrey400: '',
    colorGrey500: '',
  });

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  };

  const setThemeColor = (colorPrimary: string) => {
    localStorage.setItem('theme-color', colorPrimary);
  };

  watchEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${currentTheme.value}`);
  });

  const syncCssVars = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    // 获取相应变量并更新到 theme 对象中
    Object.entries(theme).forEach(([key, _]) => {
      if (key.startsWith('--')) return;

      const cssKey = '--' + key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).replace(/(\D)(\d)/g, '$1-$2'); // 在字母和数字之间添加短横线
      const cssValue = rootStyles.getPropertyValue(cssKey).trim();
      theme[key] = cssValue;
      theme[cssKey] = cssValue;
    });
    console.debug('[syncCssVars]', theme);
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
    setThemeColor,
    theme,
  });

  return {};
};

export const useTheme = () => {
  const themes = inject(THEME_KEY);

  if (!themes) {
    throw new Error('useTheme can only use in provide theme scopes!');
  }

  return themes;
};
