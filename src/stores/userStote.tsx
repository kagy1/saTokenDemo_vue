import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore('userStore', () => {
    const userId = ref('')
    const nickName = ref('')

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

    const clearUserInfo = () => {
        userId.value = ''
        nickName.value = ''
    }

    const getUserInfo = () => {
        return {
            userId: userId.value,
            nickName: nickName.value
        }
    }

    return {
        userId,
        nickName,
        isLoggedIn,
        setUserId,
        setNickName,
        setUserInfo,
        clearUserInfo,
        getUserInfo
    }
}, {
    persist: {
        key: 'user-store',  // 存储的键名，默认是 store id
        storage: sessionStorage
    }
})