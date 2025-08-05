import { request } from "@/http";
import type { SysUser, UserListParam } from '@/api/user/type';

interface PageResponse<T = any> {
    records: T[];
    total: number;
    current: number;
    size: number;
    pages: number;
}

// 用户API调用函数
export const addUserApi = (param: SysUser) => {
    return request.post("/api/sysUser", param);
};

export const getUserListApi = (param: UserListParam): Promise<PageResponse> => {
    return request.get("/api/sysUser/list", param);
};

export const editUserApi = (param: SysUser) => {
    return request.put("/api/sysUser", param);
};

export const deleteUserApi = (userId: number) => {
    return request.delete(`/api/sysUser/${userId}`);
};