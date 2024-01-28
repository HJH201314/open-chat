import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { SERVER_CLOUD_API_URL } from '@/constants';

/* 创建axios实例 */
const axiosInstance = axios.create({
  baseURL: SERVER_CLOUD_API_URL,
  timeout: 10000,
  withCredentials: false,
});

/* 创建请求 */
export const createRequest = <TRes>(path: string, args: AxiosRequestConfig) => {
  const config: AxiosRequestConfig<any> = {
    url: path,
    ...args,
  };
  if (!config.headers) config.headers = {};
  return axiosInstance.request<any, AxiosResponse<TRes>>(config);
}
