import { getMenuListApi } from "@/api/menu";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore('menuStore', () => {
    const collapse = ref(false)
    const changeCollapse = () => {
        collapse.value = !collapse.value
    }

    const setCollapse = (value: boolean) => {
        collapse.value = value
    }

    const getMenuList = (router: any, userId: string) => {
        return new Promise((resolve, reject) => {
            getMenuListApi(userId).then((res) => {
                let accessRoute;
                if (res) {
                    // 生成路由

                }
            })
        })
    }

    return {
        collapse,
        changeCollapse,
        setCollapse,
        getMenuList
    }
})