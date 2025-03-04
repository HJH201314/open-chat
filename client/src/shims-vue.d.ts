// 声明vue的存在, 防止ts报错
declare module '*.vue' {
  import type { DefineComponent, Plugin } from 'vue';
  const component: DefineComponent<{}, {}, any> & Plugin;
  export default component;
}
declare module 'vue/types/vue' {
  import type { Route } from 'vue-router';
  import type VueRouter from 'vue-router';
  /* Deprecated */
  interface Vue {
    $router: VueRouter // 这表示this下有这个东西
    $route: Route
    $http: any
    $Message: any
    $Modal: any
  }
}
