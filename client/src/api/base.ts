import ToastManager from '@/components/toast/ToastManager';
import { SERVER_NEXT_API_URL, USER_ACCESS_TOKEN_KEY, USER_REFRESH_TOKEN_KEY } from '@/constants';
import router from '@/plugins/router';
import { useSettingStore } from '@/store/useSettingStore';
import { useUserStore } from '@/store/useUserStore';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { getActivePinia } from 'pinia';
import { HttpClient } from '@/api/gen/http-client.ts';

const axiosConfig: AxiosRequestConfig = {
  baseURL: SERVER_NEXT_API_URL,
  timeout: 10000,
  withCredentials: false,
};

/* 创建axios实例 */
const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.response.use(
  (resp) => {
    successHandler(resp);
    return resp;
  },
  (error) => {
    errorHandler(error);
  },
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
  if (host) config.baseURL = `${host}/next`;

  return axiosInstance.request<TRes>(config);
};

/* 生成的 API 客户端 */
export const genApiClient = new HttpClient({
  ...axiosConfig,
});
// 添加拦截器
genApiClient.instance.interceptors.response.use(
  (resp) => {
    successHandler(resp);
    return resp;
  },
  (error) => {
    errorHandler(error);
  },
);
// 添加 header
genApiClient.instance.interceptors.request.use(
  (req) => {
    req.headers['Authorization'] = localStorage.getItem(USER_ACCESS_TOKEN_KEY)
      ? `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`
      : '';
    if (getActivePinia()) {
      const baseUrl = useSettingStore().settings.baseUrl;
      baseUrl && (req.baseURL = baseUrl);
    }
    return req;
  },
);