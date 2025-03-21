import { createRouter, createWebHistory } from 'vue-router';
import { useEventBus } from '@vueuse/core';
import { siteLoadingKey } from '@/constants/eventBusKeys.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'homePage',
      component: () => import('@/pages/user/home/HomePage.vue'),
    },
    {
      path: '/',
      redirect: '/chat/message',
    },
    {
      path: '/chat/message',
      name: 'messageList',
      component: () => import('@/pages/user/message/MessagePage.vue'),
    },
    {
      path: '/chat/message/:sessionId',
      name: 'messageDetail',
      props: true,
      component: () => import('@/pages/user/message/MessagePage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/user/login/LoginPage.vue'),
      props: { isModal: false },
    },
    {
      path: '/manage/user',
      name: 'manage-user',
      component: () => import('@/pages/admin/manage/user/ManageUserPage.vue'),
    },
    {
      path: '/chat/setting',
      name: 'setting',
      component: () => import('@/pages/user/setting/SettingDialog.vue'),
    },
  ],
});

export default router;

const siteLoadingBus = useEventBus(siteLoadingKey);

router.beforeEach((to, from, next) => {
  to !== from && siteLoadingBus.emit('start');
  next();
});

router.afterEach(() => {
  // 关闭加载动画
  siteLoadingBus.emit('finish');
});
