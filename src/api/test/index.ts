import { request } from "@/http"

export const t1Api = () => {
    return request.post('test/t1')
}