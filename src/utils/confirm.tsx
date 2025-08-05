import { ElMessageBox } from 'element-plus'
import type { ElMessageBoxOptions } from 'element-plus'
import type { VNode } from 'vue'

export function $confirm(
    message: string | VNode,
    title = '提示',
    options: Partial<ElMessageBoxOptions> = {}
) {
    const defaultOptions: ElMessageBoxOptions = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' as const, // 使用 const 断言确保类型正确
        showCancelButton: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        ...options
    }

    return ElMessageBox.confirm(message, title, defaultOptions)
        .then(() => {
            return Promise.resolve(true)
        })
        .catch((action) => {
            if (action === 'cancel') {
                return Promise.resolve(false)
            }
            return Promise.reject(action)
        })
}