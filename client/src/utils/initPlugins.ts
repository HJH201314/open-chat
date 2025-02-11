import shake from '@/commands/shake';
import router from '@/router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { MenuFold, MenuUnfold, Message, SettingTwo, Star, User } from '@icon-park/vue-next';
import { createPinia } from 'pinia';
import type { App } from 'vue';

/**
 * 在 vue app 中注册应用所需的插件
 * @param app APP 实例
 */
export default (app: App) => {
  app.use(createPinia());
  app.use(router);

  // 自定义指令v-shake
  app.directive('shake', {
    updated: shake,
  });

  app.component('font-awesome-icon', FontAwesomeIcon);
  app.component('setting-two', SettingTwo);
  app.component('message', Message);
  app.component('menu-unfold', MenuUnfold);
  app.component('menu-fold', MenuFold);
  app.component('star', Star);
  app.component('user', User);
};
