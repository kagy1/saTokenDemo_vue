import { request } from "@/http";
import type { SysUser, UserListParam, LoginType, AssignParam, UpdateParam, UserInfo } from '@/api/user/type';
interface PageResponse<T = any> {
    records: T[];
    total: number;
    current: number;
    size: number;
    pages: number;
}

// 用户API调用函数
export const addUserApi = (param: SysUser) => {
    return request.post("/sysUser", param);
};

export const getUserListApi = (param: UserListParam): Promise<PageResponse> => {
    return request.get("/sysUser/list", param);
};

export const editUserApi = (param: SysUser) => {
    return request.put("/sysUser", param);
};

export const deleteUserApi = (userId: number) => {
    return request.delete(`/sysUser/${userId}`);
};

export const resetPasswordApi = (param: SysUser) => {
    return request.post(`/sysUser/resetPassword`, param);
}

// 验证码
export const getImgApi = () => {
    return request.post('/sysUser/getImage');
}

// 登录
export const loginApi = (param: LoginType) => {
    return request.post('/sysUser/login', param);
}

// 查询菜单树
export const getAssignTreeApi = (param: AssignParam) => {
    return request.get('/sysUser/getAssignTree', param);
}

// 更新密码
export const updatePasswordApi = (param: UpdateParam) => {
    return request.post('/sysUser/updatePassword', param);
}

// 获取用户信息
export const getInfoApi = (userId: string): Promise<UserInfo> => {
    return request.get('/sysUser/getInfo', { userId: userId })
}

// 登出
export const logoutApi = () => {
    return request.post('/sysUser/logout');
}