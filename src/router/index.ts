import { createRouter, createWebHistory } from 'vue-router';
import MessagePage from '@/pages/message/MessagePage.vue';
import ManageUserPage from '@/pages/manage/user/ManageUserPage.vue';
import SettingPage from '@/pages/setting/SettingPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/message'
    },
    {
      path: '/message',
      name: 'message',
      component: MessagePage
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
  ]
})

export default router;
