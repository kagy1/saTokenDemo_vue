export type SysRole = {
    /**角色ID */
    roleId: string
    /**角色名称 */
    roleName: string
    /**备注 */
    remark: string
}

// 列表查询参数
export type RoleListParam = {
    /**当前页 */
    currentPage: number
    /**每页条数 */
    pageSize: number
    /**角色名称 */
    roleName?: string
    /**总条数 */
    total: number
}


export interface RoleItem {
    roleId: string
    roleName: string
    type: string | null
    remark: string | null
    createTime: string | null
    updateTime: string | null
}