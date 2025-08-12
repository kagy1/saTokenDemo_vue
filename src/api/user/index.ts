import { request } from "@/http";
import type { SysUser, UserListParam, LoginType, AssignParm } from '@/api/user/type';

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

export const resetPasswordApi = (param: SysUser) => {
    return request.post(`/api/sysUser/resetPassword`, param);
}

// 验证码
export const getImgApi = () => {
    return request.post('/api/sysUser/getImage');
}

// 登录
export const loginApi = (param: LoginType) => {
    return request.post('/api/sysUser/login', param);
}

// 查询菜单树
export const getAssignTreeApi = (param: AssignParm) => {
    return request.get('/api/sysUser/getAssignTree', param);
}