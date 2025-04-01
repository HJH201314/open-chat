import type { AxiosRequestConfig } from 'axios';
import { SERVER_NEXT_API_URL } from '@/constants';

export const defaultAxiosConfig: AxiosRequestConfig = {
  baseURL: SERVER_NEXT_API_URL,
  timeout: 30000,
  withCredentials: false,
};