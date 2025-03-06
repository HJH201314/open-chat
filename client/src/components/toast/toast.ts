import type { ToastProps } from "./types";
import type { App } from "vue";
import { createApp, h } from "vue";
import Toast from "./Toast.vue";
import initPlugins from '@/utils/initPlugins.ts';
import { Alarm, Caution, Info, Remind, Success } from '@icon-park/vue-next';

let toastDiv: HTMLDivElement | null = null;
let app: App | null = null;

function showToast(props: ToastProps) {
  if (!toastDiv) {
    toastDiv = document.createElement('div');
    document.querySelector('#app')?.appendChild(toastDiv);
  } else {
    app?.unmount(); // 卸载之前的应用实例
  }
  app = createApp({
    render() {
      return h(Toast, props);
    }
  });
  initPlugins(app);
  // 注册提示图标
  app.component('IconWarning', Caution);
  app.component('IconInfo', Info);
  app.component('IconSuccess', Success);
  app.component('IconDanger', Alarm);
  app.component('IconNormal', Remind);
  app.mount(toastDiv);
}

export function quickToast(text: string) {
  showToast({text, position: 'top'});
}

export default showToast;
