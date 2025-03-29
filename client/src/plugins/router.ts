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
      path: '/admin',
      name: 'Admin',
      redirect: '/admin/dashboard',
      meta: { title: '首页' },
      component: () => import('@/pages/admin/AdminLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          meta: { title: '仪表盘', icon: 'dashboard' },
          component: () => import('@/pages/admin/home/HomePage.vue'),
        },
        {
          path: 'manage/user',
          redirect: '/admin/manage/user/user',
          name: 'ManageUser',
          meta: { title: '用户管理', icon: 'user-1' },
          component: () => import('@/pages/admin/user/ManageUserPage.vue'),
          children: [
            {
              path: 'user',
              name: 'ManageUserUser',
              meta: { title: '用户' },
              component: () => import('@/pages/admin/user/user/ManageUserUser.vue'),
            },
            {
              path: 'role',
              name: 'ManageUserRole',
              meta: { title: '角色' },
              component: () => import('@/pages/admin/user/role/ManageUserRole.vue'),
            },
            {
              path: 'permission',
              name: 'ManageUserPermission',
              meta: { title: '权限' },
              component: () => import('@/pages/admin/user/permission/ManageUserPermission.vue'),
            },
          ]
        },
        {
          path: 'manage/system',
          redirect: '/admin/manage/system/provider',
          name: 'ManageSystem',
          meta: { title: '系统管理', icon: 'system-components' },
          component: () => import('@/pages/admin/system/ManageSystemPage.vue'),
          children: [
            {
              path: 'provider',
              name: 'ManageSystemProvider',
              meta: { title: '接入点' },
              component: () => import('@/pages/admin/system/provider/provider/ManageSystemProvider.vue'),
            },
            {
              path: 'model',
              name: 'ManageSystemModel',
              meta: { title: '模型' },
              component: () => import('@/pages/admin/system/provider/model/ManageSystemModel.vue'),
            },
            {
              path: 'collection',
              name: 'ManageSystemCollection',
              meta: { title: '模型聚合' },
              component: () => import('@/pages/admin/system/collection/ManageSystemCollection.vue'),
            },
          ]
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
