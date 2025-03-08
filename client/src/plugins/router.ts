import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/chat/message',
    },
    {
      path: '/chat/message',
      name: 'messageList',
      component: () => import('@/pages/message/MessagePage.vue'),
    },
    {
      path: '/chat/message/:sessionId',
      name: 'messageDetail',
      component: () => import('@/pages/message/MessagePage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/LoginPage.vue'),
    },
    {
      path: '/manage/user',
      name: 'manage-user',
      component: () => import('@/pages/manage/user/ManageUserPage.vue'),
    },
    {
      path: '/chat/setting',
      name: 'setting',
      component: () => import('@/pages/setting/SettingPage.vue'),
    },
  ],
});

export default router;
