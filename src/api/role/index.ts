import { request } from "@/http/index";
import type { RoleListParam, SaveMenuParam, SysRole } from "./type";

// 定义分页列表响应类型
interface PageResponse<T = any> {
    records: T[];
    total: number;
    current: number;
    size: number;
    pages: number;
}

// 定义角色项类型

export const addRoleApi = (param: SysRole) => {
    return request.post("/role", param);
};

export const getListApi = (param: RoleListParam): Promise<PageResponse> => {
    return request.get("/role/getList", param);
};

export const editRoleApi = (param: SysRole) => {
    return request.put("/role", param);
};

export const deleteRoleApi = (roleId: string) => {
    return request.delete(`/role/${roleId}`,);
};

export const getSelectApi = () => {
    return request.post("/role/selectList");
}

// 分配权限菜单保存
export const saveRoleMenuApi = (param: SaveMenuParam) => {
    return request.post("/role/saveRoleMenu", param);
}