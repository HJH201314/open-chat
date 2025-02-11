import LoginPage from '@/pages/login/LoginPage.vue';
import ManageUserPage from '@/pages/manage/user/ManageUserPage.vue';
import MessagePage from '@/pages/message/MessagePage.vue';
import SettingPage from '@/pages/setting/SettingPage.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/message',
    },
    {
      path: '/message',
      name: 'messageList',
      component: MessagePage,
    },
    {
      path: '/message/:sessionId',
      name: 'messageDetail',
      component: MessagePage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/manage/user',
      name: 'manage-user',
      component: ManageUserPage,
    },
    {
      path: '/setting',
      name: 'setting',
      component: SettingPage,
    },
  ],
});

export default router;
