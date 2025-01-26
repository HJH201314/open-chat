import { createRequest } from "@/api/base";

/**
 * 发送心跳请求
 */
export const ping = async () => {
  try {
    const res = await createRequest<API.CommonStringResponse>('/user/ping', {
      method: "POST",
    });
    return res.data.data == 'pong';
  } catch (e) {
    return false;
  }
};

export const login = (p: { username: string, password: string }) => {
  return createRequest<API.UserLoginResponse>("/user/login", {
    method: "POST",
    data: {
      username: p.username,
      password: p.password,
    },
    headers: { "Content-Type": "application/json" },
  });
};

export const register = (p: { username: string, password: string }) => {
  return createRequest<API.CommonBooleanResponse>("/user/register", {
    method: "POST",
    data: {
      username: p.username,
      password: p.password,
    },
    headers: { "Content-Type": "application/json" },
  });
};

export const logout = () => createRequest<
    API.StatusResult
>("/auth/logout/", {
  method: "GET",
});