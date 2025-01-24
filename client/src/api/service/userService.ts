import { createRequest } from "@/api/base";

export const ping = () => {
  return createRequest('/user/ping', {
    method: "POST",
  })
}

export const login = (p: { username: string, password: string }) => {
  return createRequest<API.DataResult<API.LoginResult>>("/auth/login/", {
    method: "POST",
    params: {
      username: p.username,
      password: p.password,
    },
    data: {
      username: p.username,
      password: p.password,
    },
    headers: { "Content-Type": "application/json" },
  });
}

export const current = () => {
  return createRequest<API.DataResult<any>>("/auth/current", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export const logout = () => createRequest<
    API.StatusResult
>("/auth/logout/", {
  method: "GET",
});