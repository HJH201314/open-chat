import { createRouter, createWebHistory } from 'vue-router';
import { useEventBus } from '@vueuse/core';
import { siteLoadingKey } from '@/constants/eventBusKeys.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/chat/message',
    },
    {
      path: '/chat',
      name: 'chatModule',
      component: () => import('@/pages/user/chat/ChatLayout.vue'),
      children: [
        {
          path: 'message',
          name: 'messageList',
          component: () => import('@/pages/user/chat/message/MessagePage.vue'),
        },
        {
          path: 'message/:sessionId',
          name: 'messageDetail',
          props: true,
          component: () => import('@/pages/user/chat/message/MessagePage.vue'),
        },
        {
          path: 'setting',
          name: 'settingDialog',
          component: () => import('@/pages/user/chat/setting/SettingDialog.vue'),
        },
      ],
    },
    {
      path: '/tue',
      name: 'tueModule',
      component: () => import('@/pages/user/tue/TueLayout.vue'),
      children: [
        {
          path: 'exam/:examId',
          name: 'examPage',
          props: true,
          component: () => import('@/pages/user/tue/exam/ExamPage.vue'),
        },
      ],
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
