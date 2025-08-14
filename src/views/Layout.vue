<template>
    <!-- 如果是登录页面，只显示内容 -->
    <div v-if="isLoginPage" class="login-layout">
        <Login />
    </div>
    <div v-else class="common-layout">
        <el-container>
            <el-header class="header">
                <Header />
            </el-header>
            <el-container class="main-container">
                <el-aside class="aside" style="max-width: 200px;">
                    <AppNavbar />
                </el-aside>
                <el-container class="main-content">
                    <el-header class="header1">
                        <AppHeader />
                    </el-header>
                    <div class="tab-container">
                        <AppTab />
                    </div>
                    <el-main class="main">
                        <AppMain />
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang='ts'>
import Header from "./Header";
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";
import AppMain from "./AppMain";
import AppTab from "./AppTab";
import { computed } from "vue";
import { useRoute } from "vue-router";
import Login from '@/views/login/index.vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
</script>

<style lang='scss' scoped>
.common-layout {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

.el-container {
    height: 100%;
}

.main-container {
    height: calc(100vh - 60px);
}

.aside {
    height: 100%;
}

.main-content {
    height: 100%;
}

/* --- 主要修改点在这里 --- */
.main {
    padding: 0;
    margin: 0;
    /* 1. 将 el-main 设置为 flex 容器 */
    display: flex;
    /* 2. 确保其子元素垂直排列 */
    flex-direction: column;
}

.header,
.aside,
.header1 {
    padding: 0;
    margin: 0;
}

.aside {
    width: auto;
}

.header1 {
    height: 30px;
    width: auto;
}

.tab-container {
    height: 32px;
    flex-shrink: 0;
}

.login-layout {
    padding: 0;
    margin: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}
</style>