import ToastManager from '@/components/toast/ToastManager';
import { SERVER_ORIGIN_API_URL } from '@/constants';
import router from '@/plugins/router';
import { useSettingStore } from '@/store/useSettingStore';
import { useUserStore } from '@/store/useUserStore';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { getActivePinia } from 'pinia';

/* 创建axios实例 */
const axiosInstance = axios.create({
  baseURL: SERVER_ORIGIN_API_URL,
  timeout: 10000,
  withCredentials: false,
});

axiosInstance.interceptors.response.use(
  (resp) => {
    successHandler(resp);
    return resp;
  },
  (error) => {
    errorHandler(error);
  }
);

export const successHandler = (resp: any) => {
  if (resp.status === 200) {
    if (getActivePinia()) {
      const userStore = useUserStore();
      if (userStore.loginStatus == 'offline') {
        userStore.loginStatus = 'login';
      }
    }
  }
}

export const errorHandler = (error: any) => {
  if (error.status === 401) {
    // 后端返回登录失败，前端配合清除登录态
    if (getActivePinia()) {
      useUserStore().logout();
      ToastManager.danger('登录态已过期，请登录后重试~', {
        onClick() {
          router.push('/login');
        },
      });
    }
  }
};

/* 创建请求 */
export const createRequest = <TRes>(path: string, args: AxiosRequestConfig = {}): Promise<AxiosResponse<TRes>> => {
  const token = localStorage.getItem('token') ?? '';
  const config: AxiosRequestConfig = {
    url: path,
    ...args,
    headers: {
      ...args.headers,
      token,
      Authorization: `Bearer ${token}`,
    },
  };

  // Optionally update the base URL
  const host = useSettingStore().settings.host;
  if (host) config.baseURL = `${host}/next`;

  return axiosInstance.request<TRes>(config);
};
