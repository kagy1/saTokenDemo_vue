import { ElMenu, ElSubMenu, ElMenuItem } from "element-plus";
import { defineComponent } from "vue";
import style from "./style.module.scss";
import { useRouter } from "vue-router";
import * as ElementPlusIcons from '@element-plus/icons-vue';
import { useMenuStore } from '@/stores/menuStore'

export default defineComponent({
    setup() {
        const router = useRouter();

        function toPage(route: any) {
            if (route.name) {
                router.push({ name: route.name });
            }
        }

        // 渲染图标组件
        function renderIcon(iconName?: string) {
            if (!iconName) return null;
            const IconComponent = ElementPlusIcons[iconName as keyof typeof ElementPlusIcons];
            return IconComponent ? <IconComponent class={style.menuIcon} /> : null;
        }

        // 获取菜单折叠状态
        const menuStore = useMenuStore()

        return () => (
            <nav class={style.navbar}>
                <ElMenu
                    default-active={router.currentRoute.value.name as string}
                    active-text-color="#1976d2"
                    background-color="#f5f7fa"
                    text-color="#333"
                    class={style.menu}
                    collapse={menuStore.collapse}
                >
                    {router.options.routes.map((route, index) => (
                        <ElSubMenu index={String(index)}>

                            {{
                                title: () => (
                                    <>
                                        {renderIcon(route.meta?.icon as string)}
                                        <span class={style.menuSpan}>{route.meta?.title as string}</span>
                                    </>
                                ),
                                default: () => route.children?.map(routeChild => (
                                    <ElMenuItem
                                        index={routeChild.name as string}
                                        onClick={() => toPage(routeChild)}
                                    >
                                        <div class={style.menuItem}>
                                            {renderIcon(routeChild.meta?.icon as string)}
                                            <span>{routeChild.meta?.title ?? "未定义"}</span>
                                        </div>
                                    </ElMenuItem>
                                ))
                            }}
                        </ElSubMenu>
                    ))}
                </ElMenu>
            </nav>
        );
    }
});