<template>
    <div class="loginContainer">
        <ElForm :model="loginModel" :rules="rules" class="loginForm">
            <ElFormItem class="loginTitle">
                <h2>用户登录</h2>
            </ElFormItem>
            <ElFormItem label="用户名" prop="username">
                <ElInput v-model="loginModel.username" placeholder="请输入用户名" />
            </ElFormItem>
            <ElFormItem label="密码" prop="password">
                <ElInput v-model="loginModel.password" type="password" placeholder="请输入密码" />
            </ElFormItem>
            <ElFormItem>
                <ElButton type="primary" class="loginBtn">登录</ElButton>
            </ElFormItem>
        </ElForm>
    </div>
</template>

<script setup lang="ts">
import { ElButton, ElForm, ElFormItem, ElInput, type FormInstance } from 'element-plus';
import { ref } from 'vue';

const form = ref<FormInstance>()

const loginModel = ref({
    username: '',
    password: '',
    code: ''
})

const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
</script>

<style lang="scss" scoped>
.loginContainer{
    width:100%;
    height: 100%; 
    background-color:#fff;
    background: url('@/assets/loginBackImg.jpg');
    background-size: cover; 
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .loginForm{
        height: 320px;
        width: 450px;
        padding: 20px 30px;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        
        .loginTitle{
            display: flex;
            justify-content: center;
            color: #606266;
            margin-bottom: 20px;
            
            h2 {
                margin: 0;
            }
        }
        
        .loginBtn {
            width: 100%;
        }
    }
}
</style>