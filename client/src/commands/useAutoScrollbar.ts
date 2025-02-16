import { type MaybeElementRef, unrefElement } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';

const classnameHidden = 'scrollbar-auto-hidden';
const hideRuleSelector = `.${classnameHidden}::-webkit-scrollbar-thumb`;
// 隐藏样式，设置滑块颜色透明
const hideRuleText = `
    ${hideRuleSelector} {
      background-color: transparent;
    }
    `;

class StyleInjector {
  private static instance: StyleInjector;

  private constructor() {
    document.styleSheets[0].insertRule(hideRuleText, 0);
  }

  public static initStyle(): StyleInjector {
    if (!StyleInjector.instance) {
      StyleInjector.instance = new StyleInjector();
    }
    return StyleInjector.instance;
  }
}

/**
 * 自动隐藏滚动条
 * @param target 组件的 Ref
 */
export const useAutoScrollbar = (target: MaybeElementRef) => {
  StyleInjector.initStyle();
  const targetRef = ref(target);
  let hideTimer: number | undefined;

  onMounted(() => {
    const el = unrefElement(targetRef);
    if (!el || !(el instanceof Element)) return;

    el.classList.add(classnameHidden);
  });

  const onScroll = () => {
    const el = unrefElement(targetRef);
    if (!el || !(el instanceof Element)) return;

    // 显示滚动条
    el.classList.remove(classnameHidden);
    // 清除定时器
    clearTimeout(hideTimer);
    // 设置定时器 1.5 秒后隐藏
    hideTimer = setTimeout(() => {
      el.classList.add(classnameHidden);
    }, 1500);
  };

  const stopWatching = watch(targetRef, () => {
    const el = unrefElement(targetRef);
    if (!el || !(el instanceof Element)) return;

    el.addEventListener('scroll', onScroll);
  });

  const stop = () => {
    stopWatching();
    const el = unrefElement(targetRef);
    if (!el || !(el instanceof Element)) return;

    el.removeEventListener('scroll', onScroll);
  };

  return {
    stop,
  };
};
