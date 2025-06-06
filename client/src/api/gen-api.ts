import { Chat } from '@/api/gen/Chat.ts';
import { Manage } from '@/api/gen/Manage.ts';
import { User } from '@/api/gen/User.ts';
import { Preset } from '@/api/gen/Preset.ts';
import { Tue } from '@/api/gen/Tue.ts';
import { Base } from '@/api/gen/Base.ts';
import { Auth } from '@/api/gen/Auth.ts';
import { USER_ACCESS_TOKEN_KEY } from '@/constants';
import { getActivePinia } from 'pinia';
import { useSettingStore } from '@/store/useSettingStore.ts';
import { HttpClient } from '@/api/gen/http-client.ts';
import { errorHandler, successHandler } from '@/api/handler.ts';
import { defaultAxiosConfig } from '@/api/config.ts';

/* 生成的 API 客户端 */
export const genApiClient = new HttpClient({
  ...defaultAxiosConfig,
});
// 添加拦截器
genApiClient.instance.interceptors.response.use(
  (resp) => {
    successHandler(resp);
    return resp;
  },
  (error) => {
    errorHandler(error);
    return Promise.reject(error);
  }
);
// 添加 header
genApiClient.instance.interceptors.request.use((req) => {
  req.headers['Authorization'] = localStorage.getItem(USER_ACCESS_TOKEN_KEY)
    ? `Bearer ${localStorage.getItem(USER_ACCESS_TOKEN_KEY)}`
    : '';
  if (getActivePinia()) {
    const baseUrl = useSettingStore().settings.baseUrl;
    baseUrl && (req.baseURL = baseUrl);
  }
  return req;
});

export default {
  Chat: new Chat(genApiClient),
  Manage: new Manage(genApiClient),
  User: new User(genApiClient),
  Auth: new Auth(genApiClient),
  Preset: new Preset(genApiClient),
  Tue: new Tue(genApiClient),
  Base: new Base(genApiClient),
};
