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