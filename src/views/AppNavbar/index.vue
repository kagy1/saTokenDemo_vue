<template>
    <nav :class="style.navbar">
        <el-menu :default-active="$route.name as string" active-text-color="#1976d2" background-color="#f5f7fa"
            text-color="#333" :class="style.menu" :collapse="menuStore.collapse">
            <el-sub-menu v-for="(route, index) in $router.options.routes" :key="index" :index="String(index)">
                <template #title>
                    <component v-if="route.meta?.icon" :is="getIconComponent(route.meta.icon as string)"
                        :class="style.menuIcon" />
                    <span :class="style.menuSpan">{{ route.meta?.title }}</span>
                </template>

                <el-menu-item v-for="routeChild in route.children" :key="routeChild.name"
                    :index="routeChild.name as string" @click="toPage(routeChild)">
                    <div :class="style.menuItem">
                        <component v-if="routeChild.meta?.icon"
                            :is="getIconComponent(routeChild.meta.icon as string)" />
                        <span>{{ routeChild.meta?.title ?? "未定义" }}</span>
                    </div>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </nav>
</template>

<script setup lang="ts">
import { ElMenu, ElSubMenu, ElMenuItem } from "element-plus";
import style from "./style.module.scss";
import { useRouter } from "vue-router";
import * as ElementPlusIcons from '@element-plus/icons-vue';
import { useMenuStore } from '@/stores/menuStore';

const router = useRouter();
const menuStore = useMenuStore();

function toPage(route: any) {
    if (route.name) {
        router.push({ name: route.name });
    }
}

// 获取图标组件
function getIconComponent(iconName: string) {
    return ElementPlusIcons[iconName as keyof typeof ElementPlusIcons] || null;
}
</script>

<style module lang="scss">
.navbar {
    height: 100%;
    padding-top: 12px;
    box-sizing: border-box;
    background: #f5f7fa;
    border-right: 1px solid #e0e0e0;
    box-shadow: 2px 0 8px rgba(66, 165, 245, 0.04);
    border-top-left-radius: 12px;
}

.menu {
    border: none !important;
    background: transparent !important;
}

.menuTitle,
.menuItem {
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
    }
}

.menuIcon {
    flex-shrink: 0;
}

.menuSpan {
    margin-left: 8px;
}
</style>