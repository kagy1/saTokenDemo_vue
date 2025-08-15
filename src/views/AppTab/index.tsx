import { defineComponent, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTabStore } from '@/stores/tabStore'
import { ElTabs, ElTabPane, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import type { TabsPaneContext, TabPaneName } from 'element-plus'
import style from './style.module.scss'

export default defineComponent({
    setup() {
        const router = useRouter()
        const tabStore = useTabStore()
        const contextMenuRef = ref()
        const contextMenuTab = ref<string>('')

        // 计算属性
        const activeTabName = computed({
            get: () => tabStore.activeTab,
            set: (value: string) => tabStore.setActiveTab(value)
        })

        const currentTabClosable = computed(() => {
            const tab = tabStore.getTabByName(contextMenuTab.value)
            // 首页选项卡不可关闭
            if (tab?.name === 'Main') {
                return false
            }
            return tab?.closable !== false
        })

        // 选项卡点击事件
        const handleTabClick = (pane: TabsPaneContext) => {
            const tabName = String(pane.paneName)
            const tab = tabStore.getTabByName(tabName)

            if (tab) {
                tabStore.setActiveTab(tabName)
                router.push({
                    name: tab.name,
                    query: tab.query,
                    params: tab.params
                })
            }
        }

        // 选项卡移除事件
        const handleTabRemove = (tabName: TabPaneName) => {
            const tabNameStr = String(tabName)

            // 禁止关闭首页选项卡
            if (tabNameStr === 'Main') {
                return
            }

            const newActiveTab = tabStore.removeTab(tabNameStr)

            if (newActiveTab) {
                router.push({
                    name: newActiveTab.name,
                    query: newActiveTab.query,
                    params: newActiveTab.params
                })
            } else if (tabStore.tabs.length === 0) {
                router.push('/')
            }
        }

        // 右键菜单事件
        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault()

            const target = event.target as HTMLElement
            const tabElement = target.closest('.el-tabs__item')
            if (tabElement) {
                const tabId = tabElement.getAttribute('id')
                if (tabId) {
                    const tabName = tabId.replace('tab-', '')
                    contextMenuTab.value = tabName
                }
            }
        }

        // 右键菜单命令处理
        const handleContextMenuCommand = (command: string) => {
            switch (command) {
                case 'closeCurrent':
                    if (contextMenuTab.value && contextMenuTab.value !== 'Main') {
                        handleTabRemove(contextMenuTab.value)
                    }
                    break
                case 'closeOthers':
                    if (contextMenuTab.value) {
                        tabStore.closeOtherTabs(contextMenuTab.value)
                        const tab = tabStore.getTabByName(contextMenuTab.value)
                        if (tab) {
                            router.push({
                                name: tab.name,
                                query: tab.query,
                                params: tab.params
                            })
                        }
                    }
                    break
                case 'closeAll':
                    tabStore.closeAllTabsExceptHome()
                    // 跳转到首页
                    router.push('/')
                    break
            }
        }

        // 监听路由变化自动添加选项卡
        watch(
            () => router.currentRoute.value,
            (newRoute) => {
                if (newRoute.meta?.keepTab !== false) {
                    tabStore.addTab(newRoute)
                }
            },
            { immediate: true }
        )

        // 渲染选项卡内容
        const renderTabPanes = () => {
            return tabStore.tabs.map(tab => (
                <ElTabPane
                    key={tab.name}
                    label={tab.title}
                    name={tab.name}
                    closable={tab.name !== 'Main' && tab.closable !== false}
                />
            ))
        }

        // 返回渲染函数
        return () => {
            // 如果没有选项卡则不显示
            if (tabStore.tabs.length === 0) {
                return null
            }

            return (
                <div class={style.appTab} onContextmenu={handleContextMenu}>
                    <ElTabs
                        v-model={activeTabName.value}
                        type="card"
                        closable
                        onTabClick={handleTabClick}
                        onTabRemove={handleTabRemove}
                    >
                        {renderTabPanes()}
                    </ElTabs>

                    {/* 右键菜单 */}
                    <ElDropdown
                        ref={contextMenuRef}
                        trigger="contextmenu"
                        teleported={false}
                        onCommand={handleContextMenuCommand}
                    >
                        {{
                            default: () => <span></span>,
                            dropdown: () => (
                                <ElDropdownMenu>
                                    <ElDropdownItem
                                        command="closeCurrent"
                                        disabled={!currentTabClosable.value}
                                    >
                                        关闭当前
                                    </ElDropdownItem>
                                    <ElDropdownItem command="closeOthers">
                                        关闭其他
                                    </ElDropdownItem>
                                    <ElDropdownItem command="closeAll">
                                        关闭所有
                                    </ElDropdownItem>
                                </ElDropdownMenu>
                            )
                        }}
                    </ElDropdown>
                </div>
            )
        }
    }
})