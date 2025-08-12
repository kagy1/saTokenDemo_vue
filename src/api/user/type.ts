// 定义用户接口类型
export interface SysUser {
    userId?: number
    username: string
    nickName: string
    email: string
    phone: string
    password?: string
    createTime?: string
    updateTime?: string
    sex?: string
    roleIds?: []
}

export type UserListParam = {
    currentPage: number
    pageSize: number
    username?: string
    nickName?: string
    email?: string
    phone?: string
    total: number
}

// 定义角色类型
export interface Role {
    value: number      // 改为 value
    label: string      // 改为 label
    check?: boolean
}

// 登录
export type LoginType = {
    username: string
    password: string
    code: string
}

// 菜单树参数
export type AssignParm = {
    roleId: string
    userId: string
}