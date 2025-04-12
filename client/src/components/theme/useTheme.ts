import { computed, reactive, watch, watchEffect } from 'vue';
import { tryOnMounted, useLocalStorage, useMediaQuery } from '@vueuse/core';
import tinycolor from 'tinycolor2';
import { nextFrame } from '@/utils/element.ts';
import { useSettingStore } from '@/store/useSettingStore.ts';
import { DEFAULT_COLOR } from '@/constants';
import { defineStore } from 'pinia';

type Theme = 'light' | 'dark';

const defaultTheme: Theme = 'light';
const themeColorStorageKey = 'theme-color';

/**
 * 将主题色应用于 html 元素
 * @param colorPrimary 主题色，若不指定，则使用储存在 localStorage 中的颜色，默认 DEFAULT_COLOR 兜底
 * @param name 名称
 */
export const registerThemeColor = (colorPrimary?: string, name: string = 'default') => {
  if (typeof window !== 'undefined') {
    const baseColor = tinycolor(colorPrimary || localStorage.getItem(themeColorStorageKey) || DEFAULT_COLOR);
    if (!baseColor.isValid()) return;

    const root = document.documentElement;
    // 输入的主题色是 400
    const baseLevel = 400;
    // 亮色模式下色阶等级，对应 var(--color-primary-x)
    const lightLevelList = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    // 暗色模式下色阶等级，与亮色模式一一对应
    const darkLevelList = [
      950, 930, 910, 890, 870, 850, 830, 810, 790, 770, 750, 600, 550, 400, 300, 200, 100, 50, 20, 10,
    ];
    // 升序，用于辅助计算
    const darkLevelListAsc = darkLevelList.slice().toReversed();
    if (lightLevelList.length != darkLevelList.length) throw new Error('Invalid color level list');

    const isDark = localStorage.getItem('theme') == 'dark';
    const levelList = isDark ? darkLevelListAsc : lightLevelList;
    const result: string[] = [];
    levelList.forEach((level, index) => {
      let tintedColor: string = '';
      if (level <= baseLevel) {
        tintedColor = tinycolor.mix('#fff', baseColor, (level / baseLevel) * 100).toHexString();
      } else {
        if (index < 1) throw new Error('Invalid color level');
        // 颜色加深时，以上一个色阶为基准进行加深
        tintedColor = tinycolor
          .mix(result[index - 1], '#252525', ((level - levelList[index - 1]) / levelList[index - 1]) * 100)
          .toHexString();
      }
      result.push(tintedColor);
    });

    if (isDark) {
      result.reverse();
    }
    result.forEach((color, index) => {
      root.style.setProperty(`--color-primary-${lightLevelList[index]}`, color);
      name && root.style.setProperty(`--color-${name}-${lightLevelList[index]}`, color);
    });
  }
};

/**
 * 将主题色重置为已保存的主题色，默认值兜底
 */
export const resetThemeColor = () => {
  registerThemeColor(undefined, 'default');
};

/**
 * 使用 pinia 实现全局单例的主题管理
 * @description 当组件只需要引用主题色时，可以使用 `const { theme } = useTheme()`，theme 内的属性是 reactive 响应式更新的
 * @description 如果需要使用其它属性， 比如 currentTheme，需要使用 const { currentTheme } = storeToRefs(useTheme()) 来解构
 * @description 或不解构，const themeStore = useTheme() 后使用 themeStore.currentTheme 来访问
 */
export const useTheme = defineStore('theme', () => {
  const systemPreferDark = useMediaQuery('(prefers-color-scheme: dark)');
  const currentTheme = useLocalStorage<Theme>('theme', defaultTheme);
  const currentThemeColor = useLocalStorage<string>(themeColorStorageKey, DEFAULT_COLOR, {
    listenToStorageChanges: true,
  });
  const theme: Record<string, string> = reactive({
    colorPrimary: '#26a69a',
    colorBlack: '#252525',
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

  const saveThemeColor = (color: string) => {
    currentThemeColor.value = color;
    registerThemeColor(color);
  };

  watch(
    () => currentTheme.value,
    () => {
      document.documentElement.classList.remove('theme-light', 'theme-dark');
      document.documentElement.classList.add(`theme-${currentTheme.value}`);
      nextFrame(() => {
        registerThemeColor();
      });
    },
    { immediate: true }
  );

  // 将 CSS 变量同步到 theme 对象中
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

  // 监听变化
  if (typeof window !== 'undefined') {
    // 初始化时立即注册并同步 CSS 变量
    registerThemeColor();
    syncCssVars();

    const settingStore = useSettingStore();

    tryOnMounted(() => {
      watchEffect((onCleanup) => {
        const observer = new MutationObserver(syncCssVars);
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class'],
        });
        onCleanup(() => observer.disconnect());
      });

      watchEffect(() => {
        if (settingStore.settings.theme == 'auto') {
          if (systemPreferDark.value) {
            currentTheme.value = 'dark';
          } else {
            currentTheme.value = 'light';
          }
        } else {
          currentTheme.value = settingStore.settings.theme;
        }
      });

      watch(
        () => currentThemeColor.value,
        (newColor) => {
          if (newColor) {
            registerThemeColor();
            syncCssVars();
          }
        }
      );
    });
  }

  return {
    currentTheme,
    isLight: computed(() => currentTheme.value === 'light'),
    isDark: computed(() => currentTheme.value === 'dark'),
    toggleTheme,
    saveThemeColor,
    theme,
  };
});
