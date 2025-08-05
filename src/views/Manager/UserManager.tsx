import { ElButton, ElForm, ElFormItem, ElInput, ElMain, ElMessage, ElMessageBox, ElPagination, ElTable, ElTableColumn, type FormInstance, type FormRules } from 'element-plus'
import { defineComponent, Fragment, onMounted, ref } from 'vue'
import { $confirm } from '@/utils/confirm'
import type { SysUser, UserListParam } from '@/api/user/type'
import { addUserApi, deleteUserApi, editUserApi, getUserListApi } from '@/api/user'

export default defineComponent({
    setup(props, { slots, expose, emit, attrs }) {
        
        // 定义搜索参数
        const searchParm = ref<UserListParam>({
            currentPage: 1,
            pageSize: 10,
            username: '',
            nickName: '',
            email: '',
            phone: '',
            total: 0
        })

        // 定义新增用户弹窗的对象
        const addModel = ref<SysUser>({
            username: '',
            nickName: '',
            email: '',
            phone: '',
            password: ''
        })

        // 定义编辑用户弹窗的对象
        const editModel = ref<SysUser>({
            userId: undefined,
            username: '',
            nickName: '',
            email: '',
            phone: ''
        })

        // 新增表单的ref属性
        const addRef = ref<FormInstance>()
        const editRef = ref<FormInstance>()

        // 表单验证规则
        const rules = ref<FormRules>({
            username: [
                {
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }
            ],
            nickName: [
                {
                    required: true,
                    message: '请输入昵称',
                    trigger: 'blur'
                }
            ],
            email: [
                {
                    required: true,
                    message: '请输入邮箱',
                    trigger: 'blur'
                },
                {
                    type: 'email',
                    message: '请输入正确的邮箱格式',
                    trigger: 'blur'
                }
            ],
            phone: [
                {
                    required: true,
                    message: '请输入手机号',
                    trigger: 'blur'
                },
                {
                    pattern: /^1[3-9]\d{9}$/,
                    message: '请输入正确的手机号格式',
                    trigger: 'blur'
                }
            ],
            password: [
                {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                },
                {
                    min: 6,
                    message: '密码长度不能少于6位',
                    trigger: 'blur'
                }
            ]
        })

        // 重置新增表单
        const resetAddForm = () => {
            addModel.value = {
                username: '',
                nickName: '',
                email: '',
                phone: '',
                password: ''
            }
            // 清除表单验证状态
            addRef.value?.clearValidate()
        }

        // 新增按钮处理
        const addBtn = () => {
            // 重置表单数据
            resetAddForm()

            ElMessageBox({
                title: '新增用户',
                showCancelButton: true,
                confirmButtonText: '创建',
                cancelButtonText: '取消',
                showClose: true,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        // 验证表单
                        addRef.value?.validate((valid) => {
                            if (valid) {
                                // 表单验证通过，执行创建逻辑
                                createUser()
                                done()
                            } else {
                                // 表单验证失败，不关闭弹窗
                                ElMessage.error('请检查表单输入')
                            }
                        })
                    } else {
                        // 取消或关闭时直接关闭弹窗
                        done()
                    }
                },
                message: () => (
                    <ElForm
                        ref={addRef}
                        model={addModel.value}
                        rules={rules.value}
                        label-width="80px"
                        size="default"
                    >
                        <ElFormItem label="用户名" prop="username">
                            <ElInput
                                v-model={addModel.value.username}
                                placeholder="请输入用户名"
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem label="昵称" prop="nickName">
                            <ElInput
                                v-model={addModel.value.nickName}
                                placeholder="请输入昵称"
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem label="邮箱" prop="email">
                            <ElInput
                                v-model={addModel.value.email}
                                placeholder="请输入邮箱"
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem label="手机号" prop="phone">
                            <ElInput
                                v-model={addModel.value.phone}
                                placeholder="请输入手机号"
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem label="密码" prop="password">
                            <ElInput
                                v-model={addModel.value.password}
                                type="password"
                                placeholder="请输入密码"
                                show-password
                                clearable
                            />
                        </ElFormItem>
                    </ElForm>
                )
            }).then(() => {
                getList()
                // 确认创建后的处理已在 beforeClose 中完成
            }).catch(() => {
                // 取消时重置表单
                resetAddForm()
            })
        }

        // 创建用户的具体逻辑
        const createUser = async () => {
            try {
                console.log('创建用户:', addModel.value)

                const result = await addUserApi(addModel.value)

                ElMessage.success('用户创建成功')

                // 创建成功后刷新列表
                searchBtn()

                // 重置表单
                resetAddForm()

            } catch (error) {
                console.error('创建用户失败:', error)
                ElMessage.error('创建用户失败，请重试')
            }
        }

        const searchBtn = () => {
            searchParm.value.currentPage = 1
            getList()
        }

        const resetBtn = () => {
            searchParm.value.username = ''
            searchParm.value.nickName = ''
            searchParm.value.email = ''
            searchParm.value.phone = ''
            // 重置后自动搜索
            searchBtn()
        }

        // 重置编辑表单
        const resetEditForm = () => {
            editModel.value = {
                userId: undefined,
                username: '',
                nickName: '',
                email: '',
                phone: ''
            }
            // 清除表单验证状态
            editRef.value?.clearValidate()
        }

        // 表格数据
        const tableList = ref<SysUser[]>([])

        // 查询列表
        const getList = async () => {
            try {
                let res = await getUserListApi(searchParm.value)
                if (res && res.records) {
                    tableList.value = res.records
                    searchParm.value.total = res.total
                }
            } catch (error) {
                console.error('获取用户列表失败:', error)
                ElMessage.error('获取用户列表失败')
            }
        }

        // 更新用户的具体逻辑
        const updateUser = async () => {
            try {
                console.log('更新用户:', editModel.value)

                const result = await editUserApi(editModel.value)

                ElMessage.success('用户更新成功')

                // 更新成功后刷新列表
                getList()

                // 重置表单
                resetEditForm()

            } catch (error) {
                console.error('更新用户失败:', error)
                ElMessage.error('更新用户失败，请重试')
            }
        }

        // 编辑按钮
        const editBtn = (row: SysUser) => {
            // 设置编辑表单的初始值
            Object.assign(editModel.value, row)

            ElMessageBox({
                title: '编辑用户',
                showCancelButton: true,
                confirmButtonText: '保存',
                cancelButtonText: '取消',
                showClose: true,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        // 验证表单
                        editRef.value?.validate((valid) => {
                            if (valid) {
                                // 表单验证通过，执行编辑逻辑
                                updateUser()
                                done()
                            } else {
                                // 表单验证失败，不关闭弹窗
                                ElMessage.error('请检查表单输入')
                            }
                        })
                    } else {
                        // 取消或关闭时直接关闭弹窗
                        done()
                    }
                },
                message: () => (
                    <ElForm
                        ref={editRef}
                        model={editModel.value}
                        rules={rules.value}
                        label-width="80px"
                        size="default"
                    >
                        <ElFormItem label="用户名" prop="username">
                            <ElInput
                                v-model={editModel.value.username}
                                placeholder="请输入用户名"
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem label="昵称" prop="nickName">
                            <ElInput
                                v-model={editModel.value.nickName}
                                placeholder="请输入昵称"
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem label="邮箱" prop="email">
                            <ElInput
                                v-model={editModel.value.email}
                                placeholder="请输入邮箱"
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem label="手机号" prop="phone">
                            <ElInput
                                v-model={editModel.value.phone}
                                placeholder="请输入手机号"
                                clearable
                            />
                        </ElFormItem>
                    </ElForm>
                )
            }).then(() => {
                // 确认保存后刷新列表
                getList()
            })
        }

        // 删除按钮
        const deleteBtn = async (userId: number) => {
            try {
                const confirmed = await $confirm('是否确认删除该用户？', '删除用户')
                if (confirmed) {
                    await deleteUserApi(userId)
                    ElMessage.success('删除成功')
                    // 删除成功后刷新列表
                    getList()
                }
            } catch (error) {
                console.error('删除失败:', error)
                ElMessage.error('删除失败，请重试')
            }
        }

        // 分页页容量改变时触发
        const sizeChange = (size: number) => {
            searchParm.value.pageSize = size
            getList()
        }

        // 分页页码改变时触发
        const currentChange = (page: number) => {
            searchParm.value.currentPage = page
            getList()
        }

        onMounted(() => {
            getList()
        })

        return () => (
            <div>
                <ElMain>
                    <ElForm model={searchParm.value} inline={true} size="default">
                        <ElFormItem>
                            <ElInput
                                placeholder="请输入用户名"
                                v-model={searchParm.value.username}
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem>
                            <ElInput
                                placeholder="请输入昵称"
                                v-model={searchParm.value.nickName}
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem>
                            <ElInput
                                placeholder="请输入邮箱"
                                v-model={searchParm.value.email}
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem>
                            <ElInput
                                placeholder="请输入手机号"
                                v-model={searchParm.value.phone}
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem>
                            <ElButton icon="Search" onClick={searchBtn}>搜索</ElButton>
                            <ElButton icon="refresh" onClick={resetBtn}>重置</ElButton>
                            <ElButton icon="Plus" type="primary" onClick={addBtn}>新增</ElButton>
                        </ElFormItem>
                    </ElForm>
                    <ElTable data={tableList.value} border stripe>
                        <ElTableColumn prop="username" label="用户名"></ElTableColumn>
                        <ElTableColumn prop="nickName" label="昵称"></ElTableColumn>
                        <ElTableColumn prop="email" label="邮箱"></ElTableColumn>
                        <ElTableColumn prop="phone" label="手机号"></ElTableColumn>
                        <ElTableColumn prop="createTime" label="创建时间" width="180">
                            {{
                                default: (scope: any) => (
                                    <span>{scope.row.createTime ? new Date(scope.row.createTime).toLocaleString() : '-'}</span>
                                )
                            }}
                        </ElTableColumn>
                        <ElTableColumn label="操作" align="center" width="200">
                            {{
                                default: (scope: any) => (
                                    <>
                                        <ElButton type="primary" icon="edit" onClick={() => { editBtn(scope.row) }}>编辑</ElButton>
                                        <ElButton type="danger" icon="delete" onClick={() => { deleteBtn(scope.row.userId) }}>删除</ElButton>
                                    </>
                                )
                            }}
                        </ElTableColumn>
                    </ElTable>
                    <ElPagination
                        v-model:current-page={searchParm.value.currentPage}
                        v-model:page-size={searchParm.value.pageSize}
                        onSize-change={sizeChange}
                        onCurrent-change={currentChange}
                        page-sizes={[10, 20, 40, 60, 80, 100]}
                        total={searchParm.value.total}
                        layout="total, sizes, prev, pager, next, jumper"
                    ></ElPagination>
                </ElMain>
            </div>
        )
    }
})