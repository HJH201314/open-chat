import type { ToastProps } from './types';
import type { App } from 'vue';
import { createApp, h } from 'vue';
import CusToast from './CusToast.vue';
import initPlugins from '@/utils/initPlugins.ts';
import CusThemeProvider from '@/components/theme/CusThemeProvider.ts';

/**
 * 使用ToastManager来创建令人心动的吐司通知吧！
 */
class ToastManager {
  static toastDiv?: HTMLDivElement = undefined;
  static app?: App = undefined;

  static show(props: ToastProps): App | undefined {
    if (!this.toastDiv) {
      this.toastDiv = document.createElement('div');
      document.querySelector('#app')?.appendChild(this.toastDiv);
    } else {
      this.app?.unmount(); // 卸载之前的应用实例
    }
    this.app = createApp({
      render() {
        // 在 CusThemeProvider 中渲染 CusToast 组件 TODO：需要考虑自定义 theme
        return h(CusThemeProvider, () => h(CusToast, props));
      },
    });
    initPlugins(this.app);
    this.app.mount(this.toastDiv);

    return this.app;
  }

  static success(text: string, options?: ToastProps) {
    this.show({ ...options, text, type: 'success' });
  }

  static danger(text: string, options?: ToastProps) {
    this.show({ ...options, text, type: 'danger' });
  }

  static info(text: string, options?: ToastProps) {
    this.show({ ...options, text, type: 'info' });
  }

  static normal(text: string, options?: ToastProps) {
    this.show({ ...options, text, type: 'normal' });
  }

  static warning(text: string, options?: ToastProps) {
    this.show({ ...options, text, type: 'warning' });
  }
}

export default ToastManager;
