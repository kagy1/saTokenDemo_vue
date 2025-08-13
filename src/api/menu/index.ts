import { request } from "@/http"
import type { MenuType } from "./type";

// 获取上级菜单
export const getParentApi = () => {
    return request.get("/api/sysMenu/getParent");
}

export const addApi = (param: MenuType) => {
    return request.post("/api/sysMenu/add", param);
}

// 列表
export const getListApi = () => {
    return request.get("/api/sysMenu/list");
}

// 编辑
export const editApi = (param: MenuType) => {
    return request.put("/api/sysMenu", param);
}

// 删除
export const deleteApi = (menuId: string) => {
    return request.delete(`/api/sysMenu/${menuId}`);
}

// 获取菜单数据
export const getMenuListApi = (userId: string) => {
    return request.get("api/sysMenu/getMenuList", { userId: userId })
}