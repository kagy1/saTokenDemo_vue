import { computed, defineComponent, onMounted, ref } from "vue";
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar, ElMessage, ElMessageBox, ElForm, ElFormItem, ElInput } from "element-plus";
import { User, Key, SwitchButton } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStote"; // 根据你的实际路径调整
import style from "./style.module.scss";
import { updatePasswordApi } from "@/api/user";

export default defineComponent({
    setup() {
        const router = useRouter();
        const userStore = useUserStore();
        const isLogin = computed(() => userStore.isLoggedIn);

        // 使用计算属性来响应式地获取用户信息
        const userName = computed(() => {
            const nickName = userStore.getNickName();
            return nickName || "用户";
        });

        // 处理修改密码
        const handleChangePassword = () => {
            // 表单数据
            const passwordForm = ref({
                oldPassword: "",
                password: "",
                userId: userStore.userId,
                confirmPassword: ""
            });

            // 表单引用
            const formRef = ref();



            // 表单验证规则
            const validateNewPassword = (rule: any, value: string, callback: Function) => {
                if (value === passwordForm.value.oldPassword) {
                    callback(new Error('新密码不能与旧密码相同'));
                } else {
                    callback();
                }
            };

            const validateConfirmPassword = (rule: any, value: string, callback: Function) => {
                if (value !== passwordForm.value.password) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            };

            const rules = {
                oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { validator: validateNewPassword, trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请确认新密码', trigger: 'blur' },
                    { validator: validateConfirmPassword, trigger: 'blur' }
                ]
            };

            ElMessageBox({
                title: "修改密码",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                closeOnPressEscape: false,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        // 验证表单
                        formRef.value?.validate((valid: boolean) => {
                            if (valid) {
                                // 这里调用修改密码的API
                                updatePasswordApi(passwordForm.value).then(() => {
                                    ElMessage.success('密码修改成功');
                                    done();
                                }).catch((error) => {
                                    ElMessage.error(error.message || '密码修改失败');
                                });
                            } else {
                                ElMessage.error('请正确填写表单');
                            }
                        });
                    } else {
                        done();
                    }
                },
                message: () => (
                    <ElForm
                        ref={formRef}
                        model={passwordForm.value}
                        rules={rules}
                        labelWidth="100px"
                    >
                        <ElFormItem label="旧密码" prop="oldPassword">
                            <ElInput
                                v-model={passwordForm.value.oldPassword}
                                placeholder="请输入旧密码"
                                type="password"
                                showPassword
                            />
                        </ElFormItem>
                        <ElFormItem label="新密码" prop="newPassword">
                            <ElInput
                                v-model={passwordForm.value.password}
                                placeholder="请输入新密码"
                                type="password"
                                showPassword
                            />
                        </ElFormItem>
                        <ElFormItem label="确认新密码" prop="confirmPassword">
                            <ElInput
                                v-model={passwordForm.value.confirmPassword}
                                placeholder="请再次输入新密码"
                                type="password"
                                showPassword
                            />
                        </ElFormItem>
                    </ElForm>
                )
            })
        };

        // 处理退出登录
        const handleLogout = () => {
            ElMessageBox.confirm(
                "确定要退出登录吗？",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).then(() => {
                // 清除用户信息并跳转
                userStore.logout();
            }).catch(() => {
                // 用户取消退出
            });
        };

        const handleNotLoginClick = () => {
            router.push('/login'); // 根据你的登录页路由调整
        };

        return () => (
            <header class={style.header}>
                <span class={style.title}>saToken Demo</span>
                <div class={style.userActions}>
                    {isLogin.value ? (
                        // 已登录：显示下拉菜单
                        <ElDropdown
                            trigger="click"
                            onCommand={(command) => {
                                if (command === "changePassword") {
                                    handleChangePassword();
                                } else if (command === "logout") {
                                    handleLogout();
                                }
                            }}
                        >
                            {{
                                default: () => (
                                    <div class={style.userInfo}>
                                        <ElAvatar
                                            size={32}
                                            class={style.avatar}
                                        >
                                            {{
                                                default: () => userName.value.charAt(0).toUpperCase()
                                            }}
                                        </ElAvatar>
                                        <span class={style.userName}>{userName.value}</span>
                                    </div>
                                ),
                                dropdown: () => (
                                    <ElDropdownMenu>
                                        <ElDropdownItem command="changePassword">
                                            {{
                                                default: () => (
                                                    <div class={style.menuItem}>
                                                        <Key class={style.icon} />
                                                        <span>修改密码</span>
                                                    </div>
                                                )
                                            }}
                                        </ElDropdownItem>
                                        <ElDropdownItem command="logout" divided>
                                            {{
                                                default: () => (
                                                    <div class={style.menuItem}>
                                                        <SwitchButton class={style.icon} />
                                                        <span>退出登录</span>
                                                    </div>
                                                )
                                            }}
                                        </ElDropdownItem>
                                    </ElDropdownMenu>
                                )
                            }}
                        </ElDropdown>
                    ) : (
                        // 未登录：显示可点击的用户信息，点击跳转登录页
                        <div
                            class={[style.userInfo, style.notLoginUserInfo]}
                            onClick={() => {
                                handleNotLoginClick()
                            }}
                        >
                            <ElAvatar
                                size={32}
                                class={style.avatar}
                            >
                                {{
                                    default: () => <User />
                                }}
                            </ElAvatar>
                            <span class={style.userName}>未登录</span>
                        </div>
                    )}
                </div>
            </header>
        );
    }
});