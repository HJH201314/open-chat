import { USER_ACCESS_TOKEN_KEY } from '@/constants';
import { useSettingStore } from '@/store/useSettingStore';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { defaultAxiosConfig, errorHandler, successHandler } from '@/api/default.ts';

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
