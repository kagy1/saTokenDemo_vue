// stores/tabStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export interface TabItem {
    name: string
    title: string
    path: string
    query?: Record<string, any>
    params?: Record<string, any>
    closable?: boolean
}

export const useTabStore = defineStore('tab', () => {
    const tabs = ref<TabItem[]>([])
    const activeTab = ref<string>('')

    // 添加选项卡
    const addTab = (route: RouteLocationNormalized) => {
        const { name, path, meta, query, params } = route

        if (!name) return

        const tabName = name.toString()
        const tabTitle = (meta?.title as string) || tabName

        // 检查是否已存在
        const existingTab = tabs.value.find(tab => tab.name === tabName)
        if (!existingTab) {
            const newTab: TabItem = {
                name: tabName,
                title: tabTitle,
                path,
                query: Object.keys(query).length > 0 ? query : undefined,
                params: Object.keys(params).length > 0 ? params : undefined,
                closable: meta?.closable !== false // 默认可关闭，除非明确设置为false
            }
            tabs.value.push(newTab)
        }

        // 设置为活动选项卡
        activeTab.value = tabName
    }

    // 移除选项卡
    const removeTab = (tabName: string) => {
        const index = tabs.value.findIndex(tab => tab.name === tabName)
        if (index === -1) return

        tabs.value.splice(index, 1)

        // 如果移除的是当前活动选项卡，需要切换到其他选项卡
        if (activeTab.value === tabName) {
            if (tabs.value.length > 0) {
                // 优先选择右边的选项卡，如果没有则选择左边的
                const newActiveTab = tabs.value[index] || tabs.value[index - 1]
                activeTab.value = newActiveTab.name
                return newActiveTab
            } else {
                activeTab.value = ''
            }
        }
        return null
    }

    // 设置活动选项卡
    const setActiveTab = (tabName: string) => {
        activeTab.value = tabName
    }

    // 关闭其他选项卡
    const closeOtherTabs = (keepTabName: string) => {
        tabs.value = tabs.value.filter(tab => tab.name === keepTabName || !tab.closable)
        activeTab.value = keepTabName
    }

    // 关闭所有选项卡
    const closeAllTabs = () => {
        tabs.value = tabs.value.filter(tab => !tab.closable)
        if (tabs.value.length > 0) {
            activeTab.value = tabs.value[0].name
        } else {
            activeTab.value = ''
        }
    }

    // 根据名称获取选项卡
    const getTabByName = (name: string) => {
        return tabs.value.find(tab => tab.name === name)
    }

    // 关闭除首页外的所有选项卡
    const closeAllTabsExceptHome = () => {
        // 只保留首页选项卡
        const homeTab = tabs.value.find(tab => tab.name === 'Main')
        if (homeTab) {
            tabs.value = [homeTab]
            activeTab.value = 'Main'
        } else {
            // 如果没有首页选项卡，清空所有
            tabs.value = []
            activeTab.value = ''
        }
    }

    return {
        tabs,
        activeTab,
        addTab,
        removeTab,
        setActiveTab,
        closeOtherTabs,
        closeAllTabs,
        getTabByName,
        closeAllTabsExceptHome
    }
}, {
    persist: {
        key: 'tab-store',
        storage: localStorage
    }
})