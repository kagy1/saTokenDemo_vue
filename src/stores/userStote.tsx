import router from "@/router";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore('userStore', () => {
    const userId = ref('')
    const nickName = ref('')
    const token = ref('')

    // 计算属性：检查是否已登录
    const isLoggedIn = computed(() => !!userId.value)

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

    const logout = () => {
        clearUserInfo()
        ElMessage.success('退出登录成功')
        router.push('/login')
    }

    const getUserInfo = () => {
        return {
            userId: userId.value,
            nickName: nickName.value
        }
    }

    const getToken = () => {
        return token.value
    }

    // 初始化用户信息（页面刷新时恢复状态）
    const initUserInfo = () => {
        const savedUserInfo = localStorage.getItem('userInfo')
        const savedLoginStatus = localStorage.getItem('isLoggedIn')

        if (savedUserInfo && savedLoginStatus === 'true') {
            setUserInfo(JSON.parse(savedUserInfo))
        }
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
        getToken,
        initUserInfo
    }
}, {
    persist: {
        key: 'user-store',  // 存储的键名，默认是 store id
        storage: sessionStorage
    }
})