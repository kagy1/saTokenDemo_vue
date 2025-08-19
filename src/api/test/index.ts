import { request } from "@/http"

export const t1Api = () => {
    return request.post('/api/test/t1')
}