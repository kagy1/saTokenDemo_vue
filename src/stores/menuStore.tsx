import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore('menuStore', () => {
    const collapse = ref(false)
    const changeCollapse = () => {
        collapse.value = !collapse.value
    }
    return {
        collapse,
        changeCollapse
    }
})