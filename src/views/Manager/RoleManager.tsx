import { addRoleApi, editApi, getListApi } from '@/api/role'
import { ElButton, ElForm, ElFormItem, ElInput, ElMain, ElMessage, ElMessageBox, ElPagination, ElTable, ElTableColumn, type FormInstance } from 'element-plus'
import { defineComponent, Fragment, onMounted, ref } from 'vue'
import type { RoleItem, SysRole } from "@/api/role/type";
import { de } from 'element-plus/es/locales.mjs';

export default defineComponent({
    setup(props, { slots, expose, emit, attrs }) {

        // 定义搜索参数
        const searchParm = ref({
            currentPage: 1,
            pageSize: 10,
            roleName: '',
            total: 10
        })

        // 定义新增角色弹窗的对象
        const addModel = ref({
            roleId: '',
            roleName: '',
            remark: ''
        })

         // 定义编辑角色弹窗的对象
        const editModel = ref({
            roleId: '',
            roleName: '',
            remark: ''
        })

        // 新增表单的ref属性
        const addRef = ref<FormInstance>()
        const editRef = ref<FormInstance>()

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
                getList()
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

                const result = await addRoleApi(addModel.value)

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

        // 重置编辑表单
        const resetEditForm = () => {
            editModel.value = {
                roleId: '',
                roleName: '',
                remark: ''
            }
            // 清除表单验证状态
            editRef.value?.clearValidate()
        }

        // 表格数据
        const tableList = ref<RoleItem[]>([])

        // 查询列表
        const getList = async () => {
            let res = await getListApi(searchParm.value)
            if (res && res.records) {
                tableList.value = res.records
                searchParm.value.total = res.total

            }
        }

        // 更新角色的具体逻辑
        const updateRole = async () => {
            try {
                console.log('更新角色:', editModel.value)

                const result = await editApi(editModel.value)

                ElMessage.success('角色更新成功')

                // 更新成功后刷新列表
                getList()

                // 重置表单
                resetEditForm()

            } catch (error) {
                console.error('更新角色失败:', error)
                ElMessage.error('更新角色失败，请重试')
            }
        }


        // 编辑按钮
        const editBtn = (row: SysRole) => {
            // 设置编辑表单的初始值
            Object.assign(editModel.value, row)

            ElMessageBox({
                title: '编辑角色',
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
                                updateRole()
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
                        model={editModel.value} // 修改：绑定到 editModel
                        rules={rules.value}
                        label-width="80px"
                        size="default"
                    >
                        <ElFormItem label="角色名称" prop="roleName">
                            <ElInput
                                v-model={editModel.value.roleName} // 修改：绑定到 editModel
                                placeholder="请输入角色名称"
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem label="备注" prop="remark">
                            <ElInput
                                v-model={editModel.value.remark} // 修改：绑定到 editModel
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
                // 确认保存后刷新列表
                getList()
            })
        }

        // 删除按钮
        const deleteBtn = (roleId: string) => {
            throw new Error('Function not implemented.');
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
                    <ElTable data={tableList.value} border stripe>
                        <ElTableColumn prop="roleName" label="角色名称" ></ElTableColumn>
                        <ElTableColumn prop="remark" label="备注" ></ElTableColumn>
                        <ElTableColumn prop="remark" label="操作" align='center'>
                            {{
                                default: (scope: any) => (
                                    <>
                                        <ElButton type="primary" icon="edit" onClick={() => { editBtn(scope.row) }}>编辑</ElButton>
                                        <ElButton type="danger" icon="delete" onClick={() => { deleteBtn(scope.row.rowId) }}>删除</ElButton>
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