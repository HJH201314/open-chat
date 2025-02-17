import { createRequest } from '@/api/base';

/**
 * 发送心跳请求
 * @return false - 登录校验异常; API.UserLoginResult - 登录校验成功
 */
export const ping = async () => {
  try {
    const res = await createRequest<API.UserPingResponse>('/user/ping', {
      method: 'POST',
    });
    if (typeof res.data.data == 'string') {
      return false;
    } else {
      return res.data.data;
    }
  } catch (e) {
    return false;
  }
};

export const login = (p: { username: string; password: string }) =>
  createRequest<API.UserLoginResponse>('/user/login', {
    method: 'POST',
    data: {
      username: p.username,
      password: p.password,
    },
    headers: { 'Content-Type': 'application/json' },
  });

export const register = (p: { username: string; password: string }) =>
  createRequest<API.CommonBooleanResponse>('/user/register', {
    method: 'POST',
    data: {
      username: p.username,
      password: p.password,
    },
    headers: { 'Content-Type': 'application/json' },
  });

export const logout = () =>
  createRequest<API.StatusResult>('/auth/logout/', {
    method: 'GET',
  });
