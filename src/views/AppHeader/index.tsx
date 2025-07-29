import { defineComponent } from "vue";
import style from "./style.module.scss";
import { ElBreadcrumb, ElBreadcrumbItem, ElIcon } from "element-plus";
import { useMenuStore } from '@/stores/menuStore'
import { Fold, Expand } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

export default defineComponent({
    setup() {
        const menuStore = useMenuStore()
        const route = useRoute()
        // 根据路由生成面包屑数据
        const getBreadcrumbs = () => {
            // 使用 route.matched 获取匹配的路由记录
            return route.matched
                .filter(record => record.meta && record.meta.title) // 过滤有 title 的路由
                .map(record => ({
                    title: record.meta.title,
                    path: record.path
                }))
        }
        return () => (
            <header class={style.header}>
                <div onClick={menuStore.changeCollapse} style={{ cursor: 'pointer' }}>
                    <ElIcon size={25} style={{
                        display: 'flex',
                        alignItems: 'center'
                    }} >
                        {
                            menuStore.collapse ? <Expand /> : <Fold />
                        }
                    </ElIcon>
                </div>
                <ElBreadcrumb separator="/" style={{ marginLeft: '20px' }}>
                    {getBreadcrumbs().map((item, index) => (
                        <ElBreadcrumbItem key={index} to={item.path}>
                            {item.title}
                        </ElBreadcrumbItem>
                    ))}
                </ElBreadcrumb>
            </header >
        );
    }
});