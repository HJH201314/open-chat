import { createRequest } from "@/api/base";

export const login = createRequest<
    {
      username: string;
      password: string;
    },
    API.DataResult<API.LoginResult>
>("login", ({ username, password }) => ({
  url: `/auth/login/`,
  method: "POST",
  params: {
    username,
    password,
  },
  data: {
    username,
    password,
  },
  headers: { "Content-Type": "application/json" },
}));

export const logout = createRequest<
    {},
    API.StatusResult
>("logout", () => ({
  url: `/auth/logout/`,
  method: "GET",
}));