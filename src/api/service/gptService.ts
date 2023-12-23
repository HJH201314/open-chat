import { createRequest } from "@/api/base";

/* 获取系统默认的所有角色 */
export const getAllRoles = () => createRequest<
    API.RoleListResult
>("/gpt/role/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
});

/* 获取指定角色的提示词 */
export const getSentenceByRoleId = (roleId: number) => createRequest<
    API.RoleSentenceResult
>(`/gpt/role/sentence/${roleId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
});

/* 获取session_id作为一个对话的唯一标识 */
export const getSessionId = () => createRequest<
    any
>("/gpt/session_id", {
    method: "GET",
});