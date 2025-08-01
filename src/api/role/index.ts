import request from '@/http/index'
import type { SysRole } from './type'

export const addRoleApi = (parm: SysRole) => {
    return request.post("/api/role", parm)
}