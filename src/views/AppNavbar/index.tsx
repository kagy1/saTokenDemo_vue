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
        console.log("router", router.options.routes);

        // 渲染图标组件
        function renderIcon(iconName?: string) {
            if (!iconName) return null;
            const IconComponent = ElementPlusIcons[iconName as keyof typeof ElementPlusIcons];
            return IconComponent ? <IconComponent class={style.menuIcon} /> : null;
        }

        // 获取菜单折叠状态
        const menuStore = useMenuStore()

        // 过滤菜单路由 - 排除重定向路由和不需要显示的路由
        const getMenuRoutes = () => {
            return menuStore.menuList.filter(route => {
                if (!route.meta?.title) {
                    return false;
                }
                if (route.meta?.visible === false) {
                    return false;
                }
                return true;
            });
        }

        // 过滤子路由菜单
        const getMenuChildren = (children: any[]) => {
            return children.filter(child => {
                return child.meta?.visible !== false;
            });
        }

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
                    {getMenuRoutes().map((route, index) => {
                        // 如果路由有子路由，渲染为 SubMenu
                        if (route.children && route.children.length > 0) {
                            const visibleChildren = getMenuChildren(route.children);
                            // 如果没有可显示的子路由，则不渲染父级菜单
                            if (visibleChildren.length === 0) {
                                return null;
                            }
                            return (
                                <ElSubMenu index={String(index)} key={index}>
                                    {{
                                        title: () => (
                                            <>
                                                {renderIcon(route.meta?.icon as string)}
                                                <span class={style.menuSpan}>{route.meta?.title as string}</span>
                                            </>
                                        ),
                                        default: () => visibleChildren.map(routeChild => (
                                            <ElMenuItem
                                                index={routeChild.name as string}
                                                onClick={() => toPage(routeChild)}
                                                key={routeChild.name as string}
                                            >
                                                <div class={style.menuItem}>
                                                    {renderIcon(routeChild.meta?.icon as string)}
                                                    <span>{routeChild.meta?.title ?? "未定义"}</span>
                                                </div>
                                            </ElMenuItem>
                                        ))
                                    }}
                                </ElSubMenu>
                            )
                        } else {
                            // 如果路由没有子路由，直接渲染为 MenuItem
                            return (
                                <ElMenuItem
                                    index={route.name as string}
                                    onClick={() => toPage(route)}
                                    key={index}
                                >
                                    <div class={style.menuItem}>
                                        {renderIcon(route.meta?.icon as string)}
                                        <span>{route.meta?.title ?? "未定义"}</span>
                                    </div>
                                </ElMenuItem>
                            )
                        }
                    })}
                </ElMenu>
            </nav>
        );
    }
});