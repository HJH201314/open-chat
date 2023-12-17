import { createRequest } from "@/api/base";
import type { AxiosRequestConfig } from "axios";

export const addUsers = (...users: API.UserCreateParam[]) => {
  return createRequest<API.StatusResult>("/manage/user", {
    method: "POST",
    data: {
      users: users
    },
    headers: { "Content-Type": "application/json" },
  });
}

export const deleteUser = (userId: number) => {
  return createRequest<API.StatusResult>(`/manage/user/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

export const getUser = (userId: number) => {
  return createRequest<API.UserResult>(`/manage/user/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export const getUsers = (pageNum?: number, pageSize?: number) => {
  const args: AxiosRequestConfig = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  if (pageNum && pageSize) {
    args.params = {
      pageNum: pageNum,
      pageSize: pageSize,
    }
  }
  return createRequest<API.UsersResult>(`/manage/user`, args);
}

export const updateUser = (username: string, user: API.UserCreateParam) => {
  return createRequest<API.StatusResult>(`/manage/user/${username}`, {
    method: "PUT",
    data: {
      user: user,
    },
    headers: { "Content-Type": "application/json" },
  });
}
