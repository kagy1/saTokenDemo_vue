import { defineStore } from "pinia";
import { ref } from "vue";

export const menuStore = defineStore('menuStore', () => {
    const collpase = ref(false)
    const changeCollapse = (value: boolean) => {
        collpase.value = !collpase.value
    }
    return {
        collpase,
        changeCollapse
    }
})