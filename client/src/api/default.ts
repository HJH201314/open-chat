import type { AxiosRequestConfig } from 'axios';
import { SERVER_NEXT_API_URL, USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from '@/constants';
import { getActivePinia } from 'pinia';
import { useUserStore } from '@/store/useUserStore.ts';
import ToastManager from '@/components/toast/ToastManager.ts';
import router from '@/plugins/router.ts';

export const defaultAxiosConfig: AxiosRequestConfig = {
  baseURL: SERVER_NEXT_API_URL,
  timeout: 10000,
  withCredentials: false,
};

export const successHandler = (resp: any) => {
  if (resp.status === 200) {
    // 处理 header 中的 token
    if (resp.headers['oc-auth-token']) {
      localStorage.setItem(USER_ACCESS_TOKEN_KEY, resp.headers['oc-auth-token']);
    }
    if (resp.headers['oc-refresh-token']) {
      localStorage.setItem(USER_REFRESH_TOKEN_KEY, resp.headers['oc-refresh-token']);
    }
    if (getActivePinia()) {
      const userStore = useUserStore();
      if (userStore.loginStatus == 'offline') {
        userStore.loginStatus = 'login';
      }
    }
  }
};

export const errorHandler = (error: any) => {
  console.log(error);
  if (error.status === 401) {
    // 后端返回登录失效，登出并提示登录态过期
    if (getActivePinia()) {
      const userStore = useUserStore();
      if (userStore.isLogin) {
        // 之前是登录状态，现在鉴权失败，则提示登录态过期
        ToastManager.danger('登录态已过期，请登录后重试~', {
          onClick() {
            router.push('/login');
          },
        });
      }
      useUserStore().logout();
    }
  }
};
