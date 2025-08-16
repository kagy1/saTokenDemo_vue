import { getInfoApi, logoutApi } from "@/api/user";
import router from "@/router";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useTabStore } from "./tabStore";
import { useMenuStore } from "./menuStore";

export const useUserStore = defineStore('userStore', () => {
    const userId = ref('')
    const nickName = ref('')
    const token = ref('')
    const codeList = ref<string[]>([])

    // 计算属性：检查是否已登录
    const isLoggedIn = computed(() => token.value)

    const setUserId = (id: string) => {
        userId.value = id
    }

    const setNickName = (name: string) => {
        nickName.value = name
    }

    const setUserInfo = (info: { userId: string, nickName: string }) => {
        userId.value = info.userId
        nickName.value = info.nickName
    }

    const setToken = (tokenStr: string) => {
        token.value = tokenStr
    }

    const clearUserInfo = () => {
        userId.value = ''
        nickName.value = ''
        token.value = ''
        sessionStorage.removeItem('user-store')
    }

    const menuStore = useMenuStore()

    const logout = async () => {
        try {
            await logoutApi()
            clearUserInfo()
            menuStore.clearDynamicRoutes()
            ElMessage.success('退出登录成功')
            const tabStore = useTabStore()
            tabStore.closeAllTabsExceptHome()
            router.push('/login')
        } catch (error) {
            // 即使后端登出失败，也要清除本地状态
            clearUserInfo()
            const tabStore = useTabStore()
            tabStore.closeAllTabsExceptHome()
            router.push('/login')
        }

    }

    const getUserId = () => {
        return userId.value
    }

    const getNickName = () => {
        return nickName.value
    }

    const getUserInfo = async () => {
        try {
            let res = await getInfoApi(userId.value)
            if (res) {
                // 根据后端返回的数据结构更新
                codeList.value = res.permissions || []
                if (res.name && res.userId) {
                    setUserInfo({
                        userId: res.userId.toString(), // 确保是字符串
                        nickName: res.name
                    })
                }
            }
        } catch (error) {
            console.error('获取用户信息失败:', error)
            ElMessage.error('获取用户信息失败')
        }
    }

    const getToken = () => {
        return token.value
    }

    const getCodeList = () => {
        return codeList.value
    }

    return {
        userId,
        nickName,
        token,
        isLoggedIn,
        setUserId,
        setNickName,
        setUserInfo,
        setToken,
        clearUserInfo,
        logout,
        getUserInfo,
        getUserId,
        getNickName,
        getToken,
        getCodeList
    }
}, {
    persist: {
        key: 'user-store',  // 存储的键名，默认是 store id
        storage: sessionStorage
    }
})