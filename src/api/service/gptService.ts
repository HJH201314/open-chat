import { createRequest } from "@/api/base";

/* 获取系统默认的所有角色 */
export const getAllRoles = createRequest<
    any,
    API.RoleListResult
>("getAllRoles", () => ({
    url: `/gpt/role/`,
    method: "GET",
    headers: { "Content-Type": "application/json" },
}));

/* 获取session_id作为一个对话的唯一标识 */
export const getSessionId = createRequest<
    any,
    any
>("getSessionId", () => ({
    url: `/gpt/session_id`,
    method: "GET",
}));