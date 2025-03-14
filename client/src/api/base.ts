import ToastManager from '@/components/toast/ToastManager';
import { SERVER_NEXT_API_URL, USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from '@/constants';
import router from '@/plugins/router';
import { useSettingStore } from '@/store/useSettingStore';
import { useUserStore } from '@/store/useUserStore';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { getActivePinia } from 'pinia';

export const defaultAxiosConfig: AxiosRequestConfig = {
  baseURL: SERVER_NEXT_API_URL,
  timeout: 10000,
  withCredentials: false,
};

/* 创建axios实例 */
const axiosInstance = axios.create(defaultAxiosConfig);

axiosInstance.interceptors.response.use(
  (resp) => {
    successHandler(resp);
    return resp;
  },
  (error) => {
    errorHandler(error);
    return Promise.reject(error);
  }
);

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

/* 创建自定义请求 */
export const createRequest = <TRes>(path: string, args: AxiosRequestConfig = {}): Promise<AxiosResponse<TRes>> => {
  const token = localStorage.getItem(USER_ACCESS_TOKEN_KEY) ?? '';
  const config: AxiosRequestConfig = {
    url: path,
    ...args,
    headers: {
      ...args.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  // Optionally update the base URL
  const host = useSettingStore().settings.baseUrl;
  if (host) config.baseURL = host;

  return axiosInstance.request<TRes>(config);
};
