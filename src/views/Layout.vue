<template>
    <div class="common-layout">
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
</script>

<style lang='scss' scoped>
.common-layout {
    height: 100vh;
    width: 100vw;
}

.el-container {
    height: 100%;
}

.main-container {
    height: calc(100vh - 60px); // 减去 header 的高度，根据实际调整
}

.aside {
    height: 100%;
}

.main-content {
    height: 100%;
}

.main {
    height: 100%;
}

.header,
.main,
.aside,
.header1 {
    padding: 0; // 重置 Element Plus 默认 padding
    margin: 0;
}

.aside {
    width: auto;
}

.header1 {
    padding: 0; // 重置 Element Plus 默认 padding
    margin: 0;
    height: 30px;
    width: auto; // 展开时的宽度
}

.tab-container {
    height: 32px; // 选项卡高度
    flex-shrink: 0;
}
</style>