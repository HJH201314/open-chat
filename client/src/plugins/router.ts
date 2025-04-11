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
      name: 'ChatModule',
      redirect: '/chat/message',
      component: () => import('@/pages/user/chat/ChatLayout.vue'),
      children: [
        {
          path: 'message',
          name: 'MessageList',
          component: () => import('@/pages/user/chat/message/MessagePage.vue'),
        },
        {
          path: 'message/:sessionId',
          name: 'MessageDetail',
          props: true,
          component: () => import('@/pages/user/chat/message/MessagePage.vue'),
        },
        {
          path: 'share/:sessionId',
          name: 'SharedMessageDetail',
          props: true,
          component: () => import('@/pages/user/chat/share/SharePage.vue'),
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
          path: 'exam/auto',
          name: 'ExamPage',
          props: true,
          component: () => import('@/pages/user/tue/exam/ExamPage.vue'),
        },
        {
          path: 'exam/:examId',
          name: 'ExamPage',
          props: true,
          component: () => import('@/pages/user/tue/exam/ExamPage.vue'),
        },
        {
          path: 'exam-answer/:examId',
          name: 'ExamAnswerPage',
          props: true,
          component: () => import('@/pages/user/tue/exam/answer/ExamAnswerPage.vue'),
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
          path: 'manage/tue',
          name: 'Tue',
          meta: { title: '题库管理', icon: 'book' },
          redirect: '/admin/manage/tue/problem',
          component: () => import('@/pages/admin/tue/ManageTuePage.vue'),
          children: [
            {
              path: 'problem',
              name: 'ManageTueProblem',
              meta: { title: '题库' },
              component: () => import('@/pages/admin/tue/problem/ManageTueProblem.vue'),
            },
            // {
            //   path: 'exam',
            //   name: 'ManageTueExam',
            //   meta: { title: '测验' },
            //   component: () => import('@/pages/admin/tue/problem/ManageTueExam.vue'),
            // },
            // {
            //   path: 'problem',
            //   name: 'ManageTueCourse',
            //   meta: { title: '课程' },
            //   component: () => import('@/pages/admin/tue/problem/ManageTueCourse.vue'),
            // },
          ],
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
          ],
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
            {
              path: 'bucket',
              name: 'ManageSystemBucket',
              meta: { title: '储存桶' },
              component: () => import('@/pages/admin/system/bucket/ManageSystemBucket.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/user/login/LoginPage.vue'),
      props: { isModal: false },
    },
  ],
});

const siteLoadingBus = useEventBus(siteLoadingKey);
router.beforeEach((to, from, next) => {
  // 访问新页面时展示加载
  to !== from && siteLoadingBus.emit('start');

  next();
});

router.afterEach(() => {
  // 关闭加载动画
  siteLoadingBus.emit('finish');
});

export default router;

export const getRouterInstance = () => router!;
