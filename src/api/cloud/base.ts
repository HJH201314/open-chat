import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

/* 创建axios实例 */
const axiosInstance = axios.create({
  baseURL: '/api/cloud',
  timeout: 10000,
  withCredentials: false,
});

/* 创建请求 */
export const createRequest = <TRes>(path: string, args: AxiosRequestConfig) => {
  let config: AxiosRequestConfig<any> = {
    url: path,
    ...args,
  };
  if (!config.headers) config.headers = {};
  return axiosInstance.request<any, AxiosResponse<TRes>>(config);
}
