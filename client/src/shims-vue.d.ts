// 声明vue的存在, 防止ts报错
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'vue/types/vue' {
  import VueRouter, { Route } from 'vue-router'
  /* Deprecated */
  interface Vue {
    $router: VueRouter // 这表示this下有这个东西
    $route: Route
    $http: any
    $Message: any
    $Modal: any
  }
}
