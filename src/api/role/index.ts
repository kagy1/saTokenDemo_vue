import request from '@/http/index'
import type { RoleListParam, SysRole } from './type'

// 定义分页列表响应类型
interface PageResponse<T = any> {
    records: T[]
    total: number
    current: number
    size: number
    pages: number
}

// 定义角色项类型

export const addRoleApi = (param: SysRole) => {
    return request.post("/api/role", param)
}

export const getListApi = (param: RoleListParam): Promise<PageResponse> => {
    return request.get("/api/role/getList", { params: param })
}

export const editApi = (param: SysRole) => {
    return request.put("/api/role", param)
}