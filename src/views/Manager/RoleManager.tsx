import { ElButton, ElForm, ElFormItem, ElInput, ElMain, ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { defineComponent, Fragment, ref } from 'vue'

export default defineComponent({
    setup(props, { slots, expose, emit, attrs }) {

        // 定义搜索参数
        const searchParm = ref({
            currentPage: 1,
            pageSize: 10,
            roleName: ''
        })

        // 定义新增角色弹窗的对象
        const addModel = ref({
            roleId: '',
            roleName: '',
            remark: ''
        })

        // 新增表单的ref属性
        const addRef = ref<FormInstance>()

        // 表单验证规则
        const rules = ref({
            roleName: [
                {
                    required: true,
                    message: '请输入角色名称',
                    trigger: 'blur'
                }
            ],
            remark: [
                {
                    max: 200,
                    message: '备注长度不能超过 200 个字符',
                    trigger: 'blur'
                }
            ]
        })

        // 重置新增表单
        const resetAddForm = () => {
            addModel.value = {
                roleId: '',
                roleName: '',
                remark: ''
            }
            // 清除表单验证状态
            addRef.value?.clearValidate()
        }

        // 新增按钮处理
        const addBtn = () => {
            // 重置表单数据
            resetAddForm()

            ElMessageBox({
                title: '新增角色',
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
                                createRole()
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
                        <ElFormItem label="角色名称" prop="roleName">
                            <ElInput
                                v-model={addModel.value.roleName}
                                placeholder="请输入角色名称"
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem label="备注" prop="remark">
                            <ElInput
                                v-model={addModel.value.remark}
                                type="textarea"
                                placeholder="请输入备注信息"
                                rows={3}
                                maxlength={200}
                                show-word-limit
                                clearable
                            />
                        </ElFormItem>
                    </ElForm>
                )
            }).then(() => {
                // 确认创建后的处理已在 beforeClose 中完成
            }).catch(() => {
                // 取消时重置表单
                resetAddForm()
            })
        }

        // 创建角色的具体逻辑
        const createRole = async () => {
            try {
                // 这里添加你的API调用逻辑
                console.log('创建角色:', addModel.value)

                // 模拟API调用
                // const result = await createRoleApi(addModel.value)

                ElMessage.success('角色创建成功')

                // 创建成功后刷新列表
                searchBtn()

                // 重置表单
                resetAddForm()

            } catch (error) {
                console.error('创建角色失败:', error)
                ElMessage.error('创建角色失败，请重试')
            }
        }

        const searchBtn = () => {
            console.log(searchParm.value)
            // 这里添加搜索逻辑
        }

        const resetBtn = () => {
            searchParm.value.roleName = ''
            // 重置后自动搜索
            searchBtn()
        }

        return () => (
            <div>
                <ElMain>
                    <ElForm v-model={searchParm.value} inline={true} size="default">
                        <ElFormItem>
                            <ElInput
                                placeholder="请输入关键字"
                                v-model={searchParm.value.roleName}
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem>
                            <ElButton icon="Search" onClick={searchBtn}>搜索</ElButton>
                            <ElButton icon="Close" type="danger" onClick={resetBtn}>重置</ElButton>
                            <ElButton icon="Plus" type="primary" onClick={addBtn}>新增</ElButton>
                        </ElFormItem>
                    </ElForm>
                </ElMain>
            </div>
        )
    }
})