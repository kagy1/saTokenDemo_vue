<template>
    <div class="loginContainer">
        <ElForm ref="form" :model="loginModel" :rules="rules" class="loginForm" align="center">
            <ElFormItem>
                <div class="loginTitle">用户登录</div>
            </ElFormItem>
            <ElFormItem label="用户名" prop="username" label-width="70px">
                <ElInput v-model="loginModel.username" placeholder="请输入用户名" />
            </ElFormItem>
            <ElFormItem label="密码" prop="password" label-width="70px">
                <ElInput v-model="loginModel.password" type="password" placeholder="请输入密码" />
            </ElFormItem>
            <ElFormItem label="验证码" prop="code" label-width="70px">
                <ElRow :gutter=10>
                    <ElCol :span="16">
                        <ElInput placeholder="请输入验证码" v-model="loginModel.code"></ElInput>
                    </ElCol>
                    <ElCol :span="8">
                        <img class="images" alt="验证码" :src="imgSrc" @click="getImg" />
                    </ElCol>
                </ElRow>
            </ElFormItem>
            <ElFormItem class="button-container">
                <ElButton type="primary" class="loginBtn" @click="login">登录</ElButton>
                <ElButton type="info" class="loginBtn" @click="resetForm" plain>重置</ElButton>
            </ElFormItem>
        </ElForm>
    </div>
</template>

<script setup lang="ts">
import { getImgApi, loginApi } from "@/api/user/index";
import {
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElMessage,
    ElRow,
    type FormInstance,
} from "element-plus";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/userStote";
import { useRoute, useRouter } from "vue-router";

const form = ref<FormInstance>();

const store = useUserStore();

const loginModel = ref({
    username: "",
    password: "",
    code: "",
});

const rules = {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};
const imgSrc = ref("");

// 获取验证码
const getImg = async () => {
    try {
        let res = await getImgApi();
        if (res) {
            imgSrc.value = res;
        }
    } catch (error) {
        console.error('获取验证码失败:', error);
    }
}

const router = useRouter()
const route = useRoute()

// 登录
const login = async () => {
    if (!form.value) return;

    try {
        // 验证表单
        const valid = await form.value.validate();
        if (valid) {
            // 调用登录API
            const res = await loginApi(loginModel.value);
            if (res) {
                store.setUserId(res.userId);
                store.setNickName(res.nickName);
                store.setToken(res.token);
                ElMessage.success('登录成功');

                // 登录成功后跳转
                // 如果有重定向地址，跳转到重定向地址，否则跳转到首页
                const redirect = route.query.redirect as string
                router.push(redirect || '/')
            }
        }
    } catch (error) {
        console.error('登录失败:', error);
        ElMessage.error('登录失败，请重试');
        // 登录失败时刷新验证码
        getImg();
    }
}

// 重置表单
const resetForm = () => {
    if (!form.value) return;
    form.value.resetFields();
    getImg(); // 重置后重新获取验证码
}

onMounted(() => {
    // 页面加载时获取验证码
    getImg();
})
</script>

<style lang="scss" scoped>
.loginContainer {
    width: 100%;
    height: 100%;
    background-color: #fff;
    background: url("@/assets/loginBackImg.jpg");
    background-size: cover;
    background-position: top;
    display: flex;
    justify-content: center;
    align-items: center;

    .loginForm {
        height: 320px;
        width: 450px;
        padding: 20px 30px;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        .loginTitle {
            display: flex;
            justify-content: center;
            color: #606266;
            margin-bottom: 20px;
            width: 100%;
            font-size: 24px;
            font-weight: 600;
        }

        // 样式化验证码图片
        .images {
            width: 100%;
            height: 30px; // 与按钮和输入框高度保持一致
            border-radius: 4px;
            background-color: #f0f2f5; // 添加一个背景色作为占位符
            cursor: pointer; // 鼠标悬停时显示为手型
        }

        .loginBtn {
            width: 150px;
            height: 40px;
            margin: 0 8px;
        }

        .button-container {
            text-align: center;
            margin-top: 20px;

            :deep(.el-form-item__content) {
                justify-content: center;
            }
        }


    }
}
</style>