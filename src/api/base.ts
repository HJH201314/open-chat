import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { SERVER_API_URL } from "@/constants";

/* 创建axios实例 */
const axiosInstance = axios.create({
  baseURL: SERVER_API_URL,
  timeout: 10000,
  withCredentials: false,
});

/* 创建请求 */
export const createRequest = <TReq, TResp = any>(
    _: string,
    requestConfigCreator: (args: TReq) => AxiosRequestConfig,
) => {
  return (args: TReq) => {
    return axiosInstance.request<TResp>(requestConfigCreator(args));
  };
};