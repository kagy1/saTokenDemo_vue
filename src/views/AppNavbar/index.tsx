import { ElMenu, ElSubMenu, ElMenuItem } from "element-plus";
import { defineComponent } from "vue";
import style from "./style.module.scss";
import { useRouter } from "vue-router";

export default defineComponent({
    setup() {
        const router = useRouter();
        function toPage(route: any) {
            if (route.name) router.push({ name: route.name });
        }
        return () => (
            <nav class={style.navbar}>
                <ElMenu
                    default-active={router.currentRoute.value.name as string}
                    active-text-color="#1976d2"
                    background-color="#f5f7fa"
                    text-color="#333"
                    class={style.menu}
                    router
                >
                    {router.options.routes.map((route, index) => (
                        <ElSubMenu
                            index={'' + index}
                            v-slots={{
                                title: () => <span>{route.meta?.title as string}</span>
                            }}
                        >
                            {route.children?.map(routeChild => (
                                <ElMenuItem
                                    index={routeChild.name as string}
                                    onClick={() => toPage(routeChild)}
                                >
                                    <span>{routeChild.meta?.title ?? "未定义"}</span>
                                </ElMenuItem>
                            ))}
                        </ElSubMenu>
                    ))}
                </ElMenu>
            </nav>
        );
    }
});