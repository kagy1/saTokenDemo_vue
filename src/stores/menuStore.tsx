import { getMenuListApi } from "@/api/menu";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { RouteRecordRaw } from 'vue-router';

// 使用 glob 动态导入功能，匹配 views 目录下所有的 .vue 和 .tsx 视图文件
// 这样可以在运行时动态加载组件，而不需要手动 import 每个组件
const modules = import.meta.glob('@/views/**/*.{vue,tsx}');

// 定义并导出菜单状态管理 store
export const useMenuStore = defineStore('menuStore', () => {
    // 侧边栏是否折叠的状态
    const collapse = ref(false);

    // 存储动态生成的路由配置数组
    const dynamicRoutes = ref<RouteRecordRaw[]>([]);

    // 存储从后端获取的原始菜单数据
    const menuList = ref<any[]>([]);

    /**
     * 切换侧边栏折叠状态
     */
    const changeCollapse = () => {
        collapse.value = !collapse.value;
    };

    /**
     * 设置侧边栏折叠状态
     * @param value - 折叠状态的布尔值
     */
    const setCollapse = (value: boolean) => {
        collapse.value = value;
    };

    /**
     * 将后端返回的 RouterVo 数据转换为 Vue Router 可识别的路由配置
     * @param routerVos - 后端返回的路由数据数组
     * @returns 转换后的 Vue Router 路由配置数组
     */
    const transformRouterVoToRoute = (routerVos: any[]): RouteRecordRaw[] => {
        const routes: RouteRecordRaw[] = [];

        // 遍历每个路由配置
        routerVos.forEach(router => {
            // 构建基础路由配置对象
            const routeConfig: any = {
                path: router.path,           // 路由路径
                name: router.name,           // 路由名称
                meta: {                      // 路由元信息
                    title: router.meta?.title,     // 菜单标题
                    icon: router.meta?.icon,       // 菜单图标
                    visible: router.meta?.visible, // 是否在菜单中显示
                    keepTab: router.meta?.keepTab  // 是否保持 tab 页
                }
            };

            // 如果存在重定向配置，添加重定向
            if (router.redirect) {
                routeConfig.redirect = router.redirect;
            }

            // 动态解析和加载组件
            if (router.component) {
                // 构建组件的完整路径
                const Path = `/src/views/${router.component}`;

                // 检查该路径的组件是否存在于动态导入的模块中
                if (modules[Path]) {
                    // 如果存在，使用动态导入的组件
                    routeConfig.component = modules[Path];
                } else {
                    // 如果组件不存在，输出警告并使用 404 页面作为后备
                    console.warn(`Component for route "${router.name}" not found. Tried paths: ${Path}`);
                    routeConfig.component = () => import('@/views/Error/404');
                }
            }

            // 递归处理子路由
            if (router.children && router.children.length > 0) {
                routeConfig.children = transformRouterVoToRoute(router.children);
            }

            // 将配置好的路由添加到数组中
            routes.push(routeConfig as RouteRecordRaw);
        });

        return routes;
    };

    /**
     * 获取用户菜单列表并动态添加路由
     * @param router - Vue Router 实例
     * @param userId - 用户ID
     * @returns Promise，成功时返回路由配置数组
     */
    const getMenuList = (router: any, userId: string) => {
        return new Promise((resolve, reject) => {
            // 调用 API 获取菜单数据
            getMenuListApi(userId).then((res) => {
                if (res && res.length > 0) {
                    // 保存原始菜单数据
                    menuList.value = res;

                    // 转换为路由配置
                    const routes = transformRouterVoToRoute(res);
                    dynamicRoutes.value = routes;

                    // 将动态路由添加到 Vue Router 中
                    routes.forEach(route => {
                        router.addRoute(route);
                    });

                    console.log('动态路由添加成功:', routes);
                    resolve(routes);
                } else {
                    // 如果没有菜单数据，抛出错误
                    reject(new Error('没有菜单权限'));
                }
            }).catch(error => {
                // API 调用失败时的错误处理
                console.error('获取菜单失败:', error);
                reject(error);
            });
        });
    };

    /**
     * 清空动态路由和菜单数据
     * 通常在用户退出登录时调用
     */
    const clearDynamicRoutes = () => {
        dynamicRoutes.value = [];
        menuList.value = [];
    };

    // 返回 store 中可供外部使用的状态和方法
    return {
        collapse,             // 折叠状态
        changeCollapse,        // 切换折叠状态方法
        setCollapse,          // 设置折叠状态方法
        getMenuList,          // 获取菜单列表方法
        dynamicRoutes,        // 动态路由数组
        menuList,             // 菜单数据数组
        clearDynamicRoutes    // 清空路由方法
    };
});