import { getMenuListApi } from "@/api/menu";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { RouteRecordRaw } from 'vue-router';

// 使用 glob 匹配所有 .vue 和 .tsx 视图文件
const modules = import.meta.glob('@/views/**/*.{vue,tsx}');

export const useMenuStore = defineStore('menuStore', () => {
    const collapse = ref(false);
    const dynamicRoutes = ref<RouteRecordRaw[]>([]);
    const menuList = ref<any[]>([]);

    const changeCollapse = () => {
        collapse.value = !collapse.value;
    };

    const setCollapse = (value: boolean) => {
        collapse.value = value;
    };

    // 将后端RouterVo数据转换为Vue Router配置
    const transformRouterVoToRoute = (routerVos: any[]): RouteRecordRaw[] => {
        const routes: RouteRecordRaw[] = [];

        routerVos.forEach(router => {
            const routeConfig: any = {
                path: router.path,
                name: router.name,
                meta: {
                    title: router.meta?.title,
                    icon: router.meta?.icon,
                    visible: router.meta?.visible,
                    keepTab: router.meta?.keepTab
                }
            };

            if (router.redirect) {
                routeConfig.redirect = router.redirect;
            }

            // 2. 动态解析组件路径
            if (router.component) {
                const Path = `/src/views/${router.component}`;

                if (modules[Path]) {
                    routeConfig.component = modules[Path];
                } else {
                    console.warn(`Component for route "${router.name}" not found. Tried paths: ${Path}`);
                    // 指向一个通用的 NotFound 组件
                    routeConfig.component = () => import('@/views/Error/404');
                }
            }

            if (router.children && router.children.length > 0) {
                routeConfig.children = transformRouterVoToRoute(router.children);
            }

            routes.push(routeConfig as RouteRecordRaw);
        });

        return routes;
    };

    const getMenuList = (router: any, userId: string) => {
        return new Promise((resolve, reject) => {
            getMenuListApi(userId).then((res) => {
                if (res && res.length > 0) {
                    menuList.value = res;
                    const routes = transformRouterVoToRoute(res);
                    dynamicRoutes.value = routes;

                    routes.forEach(route => {
                        router.addRoute(route);
                    });

                    console.log('动态路由添加成功:', routes);
                    resolve(routes);
                } else {
                    reject(new Error('没有菜单权限'));
                }
            }).catch(error => {
                console.error('获取菜单失败:', error);
                reject(error);
            });
        });
    };

    const clearDynamicRoutes = () => {
        dynamicRoutes.value = [];
        menuList.value = [];
    };

    return {
        collapse,
        changeCollapse,
        setCollapse,
        getMenuList,
        dynamicRoutes,
        menuList,
        clearDynamicRoutes
    };
});