import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore('menuStore', () => {
    const collpase = ref(false)
    const changeCollapse = () => {
        collpase.value = !collpase.value
    }
    return {
        collpase,
        changeCollapse
    }
})