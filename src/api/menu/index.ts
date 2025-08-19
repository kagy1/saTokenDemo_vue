import { request } from "@/http"
import type { MenuType } from "./type";

// 获取上级菜单
export const getParentApi = () => {
    return request.get("/sysMenu/getParent");
}

export const addApi = (param: MenuType) => {
    return request.post("/sysMenu/add", param);
}

// 列表
export const getListApi = () => {
    return request.get("/sysMenu/list");
}

// 编辑
export const editApi = (param: MenuType) => {
    return request.put("/sysMenu", param);
}

// 删除
export const deleteApi = (menuId: string) => {
    return request.delete(`/sysMenu/${menuId}`);
}

// 获取菜单数据
export const getMenuListApi = (userId: string) => {
    return request.get("/sysMenu/getMenuList", { userId: userId })
}