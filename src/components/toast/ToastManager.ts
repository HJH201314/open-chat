import type { ToastProps } from "./index";
import type { App } from "vue";
import { createApp, h } from "vue";
import Toast from "./Toast.vue";

/**
 * 使用ToastManager来创建令人心动的土司通知吧！
 */
class ToastManager {
  static toastDiv?: HTMLDivElement = undefined;
  static app?: App = undefined;

  static show(props: ToastProps) {
    if (!this.toastDiv) {
      this.toastDiv = document.createElement('div');
      document.querySelector('#app')?.appendChild(this.toastDiv);
    } else {
      this.app?.unmount(); // 卸载之前的应用实例
    }
    this.app = createApp({
      render() {
        return h(Toast, props);
      }
    });
    this.app.mount(this.toastDiv);
  }
  static success(text: string, options?: ToastProps) {
    this.show({...options, text, type: 'success'});
  }
  static danger(text: string, options?: ToastProps) {
    this.show({...options, text, type: 'danger'});
  }
  static info(text: string, options?: ToastProps) {
    this.show({...options, text, type: 'info'});
  }
  static normal(text: string, options?: ToastProps) {
    this.show({...options, text, type: 'normal'});
  }
  static warning(text: string, options?: ToastProps) {
    this.show({...options, text, type: 'warning'});
  }
}

export default ToastManager;