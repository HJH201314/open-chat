import { useUserStore } from '@/store/useUserStore';
import { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import axios from 'axios';
import { SERVER_ORIGIN_API_URL } from "@/constants";
import { useSettingStore } from "@/store/useSettingStore";
import { getActivePinia } from "pinia";

/* 创建axios实例 */
const axiosInstance = axios.create({
  baseURL: SERVER_ORIGIN_API_URL,
  timeout: 10000,
  withCredentials: false,
});

axiosInstance.interceptors.response.use((resp) => {
  if (resp.status === 200) {
    if (getActivePinia()) {
      const userStore = useUserStore();
      if (userStore.loginStatus == 'offline') {
        userStore.loginStatus = 'login';
      }
    }
  }
  return resp;
}, (error) => {
  if (error.status === 401) {
    if (getActivePinia()) {
      useUserStore().logout();
    }
  }
}, {});

/* 创建请求 */
export const createRequest = <TRes>(path: string, args: AxiosRequestConfig) => {
  const config: AxiosRequestConfig<any> = {
    url: path,
    ...args,
  };
  if (getActivePinia()) {
    if (useSettingStore().settings.host) config.baseURL = useSettingStore().settings.host + '/next';
  }
  if (!config.headers) config.headers = {};
  config.headers['token'] = localStorage.getItem("token") ?? '';
  config.headers['Authorization'] = 'Bearer ' + (localStorage.getItem("token") ?? '');
  return axiosInstance.request<any, AxiosResponse<TRes>>(config);
}
