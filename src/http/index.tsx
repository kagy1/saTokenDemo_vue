import axios, {
    type AxiosResponse,
    type AxiosError,
    type InternalAxiosRequestConfig,
    AxiosHeaders
} from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'

// 定义响应数据类型
interface ApiResponse<T = any> {
    code: number
    data: T
    message: string
}

// 定义扩展的请求配置类型
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    showLoading?: boolean
    requestId?: string
}

// Loading实例管理
let loadingInstance: LoadingInstance | null = null
let loadingCount = 0

const showLoading = (): void => {
    if (loadingCount === 0) {
        loadingInstance = ElLoading.service({
            lock: true,
            text: '加载中...',
            background: 'rgba(0, 0, 0, 0.7)'
        })
    }
    loadingCount++
}

const hideLoading = (): void => {
    loadingCount--
    if (loadingCount <= 0) {
        loadingCount = 0
        if (loadingInstance) {
            loadingInstance.close()
            loadingInstance = null
        }
    }
}

// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7411',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    withCredentials: false
})

// Token管理
const TokenManager = {
    getToken(): string | null {
        return localStorage.getItem('token') || sessionStorage.getItem('token')
    },

    setToken(token: string, remember = false): void {
        if (remember) {
            localStorage.setItem('token', token)
        } else {
            sessionStorage.setItem('token', token)
        }
    },

    removeToken(): void {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
    }
}

// 跳转登录页
const redirectToLogin = (): void => {
    TokenManager.removeToken()
    if (window.location.pathname !== '/login') {
        window.location.href = '/login'
    }
}

// 请求拦截器
service.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
        // 添加token
        const token = TokenManager.getToken()
        if (token) {
            if (!config.headers) {
                config.headers = new AxiosHeaders()
            }
            config.headers.set('Authorization', `Bearer ${token}`)
        }

        // 显示loading
        if (config.showLoading !== false) {
            showLoading()
        }

        return config
    },
    (error: AxiosError) => {
        hideLoading()
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const customConfig = response.config as CustomAxiosRequestConfig
        if (customConfig.showLoading !== false) {
            hideLoading()
        }

        const res = response.data

        if (res.code === 200) {
            return res.data
        } else {
            const errorMessage = res.message || '请求失败'

            // 业务状态码处理
            switch (res.code) {
                case 401:
                case 1002: // 用户未登录
                case 1003: // Token过期
                    redirectToLogin()
                    break
                case 1004: // 权限不足
                    ElMessage.error('权限不足')
                    break
                case 1010: // 操作过于频繁
                    ElMessage.warning('操作过于频繁，请稍后再试')
                    break
                default:
                    ElMessage.error(errorMessage)
            }

            return Promise.reject(new Error(errorMessage))
        }
    },
    (error: AxiosError) => {
        hideLoading()

        let message = '网络错误'
        if (error.response) {
            const { status } = error.response
            switch (status) {
                case 400:
                    message = '请求参数错误'
                    break
                case 401:
                    message = '登录已过期，请重新登录'
                    redirectToLogin()
                    return Promise.reject(error)
                case 403:
                    message = '权限不足，拒绝访问'
                    break
                case 404:
                    message = '请求的资源不存在'
                    break
                case 429:
                    message = '请求过于频繁，请稍后再试'
                    break
                case 500:
                    message = '服务器内部错误'
                    break
                default:
                    message = `请求失败 (${status})`
            }
        }

        ElMessage.error(message)
        return Promise.reject(error)
    }
)

export default service

// 请求配置接口
interface RequestConfig {
    showLoading?: boolean
    [key: string]: any
}

// 导出常用的请求方法
export const request = {
    get<T = any>(url: string, params: Record<string, any> = {}, config: RequestConfig = {}): Promise<T> {
        return service({
            method: 'GET',
            url,
            params,
            ...config
        })
    },

    post<T = any>(url: string, data: Record<string, any> = {}, config: RequestConfig = {}): Promise<T> {
        return service({
            method: 'POST',
            url,
            data,
            ...config
        })
    },

    put<T = any>(url: string, data: Record<string, any> = {}, config: RequestConfig = {}): Promise<T> {
        return service({
            method: 'PUT',
            url,
            data,
            ...config
        })
    },

    delete<T = any>(url: string, params: Record<string, any> = {}, config: RequestConfig = {}): Promise<T> {
        return service({
            method: 'DELETE',
            url,
            params,
            ...config
        })
    }
}

export { TokenManager }