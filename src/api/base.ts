import type { AxiosRequestConfig, AxiosResponse } from 'axios';
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

/* 创建请求 */
export const createRequest = <TRes>(path: string, args: AxiosRequestConfig) => {
  const config: AxiosRequestConfig<any> = {
    url: path,
    ...args,
  };
  if (getActivePinia()) {
    if (useSettingStore().settings.host) config.baseURL = useSettingStore().settings.host + '/origin';
  }
  if (!config.headers) config.headers = {};
  config.headers['token'] = localStorage.getItem("token") ?? '';
  config.headers['Authorization'] = localStorage.getItem("token") ?? '';
  return axiosInstance.request<any, AxiosResponse<TRes>>(config);
}
