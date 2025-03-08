import shake from '@/commands/shake';
import pinia from '@/plugins/pinia';
import router from '@/plugins/router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { App } from 'vue';

/**
 * 在 vue app 中注册应用所需的插件
 * @param app APP 实例
 */
export default (app: App) => {
  app.use(pinia);
  app.use(router);

  // 自定义指令v-shake
  app.directive('shake', {
    updated: shake,
  });

  app.component('FontAwesomeIcon', FontAwesomeIcon);
};
