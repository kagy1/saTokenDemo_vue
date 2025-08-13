import { addApi, getListApi, getParentApi, editApi, deleteApi } from '@/api/menu'
import type { MenuType } from '@/api/menu/type'
import { $confirm } from '@/utils/confirm'
import { ElButton, ElCol, ElForm, ElFormItem, ElIcon, ElInput, ElMain, ElMessage, ElMessageBox, ElRadio, ElRadioGroup, ElRow, ElTable, ElTableColumn, ElTag, ElTreeSelect, type FormInstance } from 'element-plus'
import { defineComponent, Fragment, onMounted, ref, resolveComponent } from 'vue'
import { component } from 'vxe-pc-ui'

// 定义操作类型
type OperationType = 'add' | 'edit'

export default defineComponent({
    setup(props, { slots, expose, emit, attrs }) {

        const addForm = ref<FormInstance>()

        // 获取上级菜单数据
        const treeList = ref([])

        const getParent = async () => {
            let res = await getParentApi()
            if (res) {
                console.log("res", res);
                treeList.value = res;
            }
        }

        // 上级菜单选中
        const treeClick = (data: any) => {
            console.log("treeClick", data);
            addModel.value.parentName = data.title
        }

        // 表单绑定的对象
        const addModel = ref<MenuType>({
            menuId: '',
            parentId: '',
            title: '',
            code: '',
            name: '',
            path: '',
            url: '',
            type: '0',
            icon: '',
            parentName: '',
            orderNum: ''
        })

        const rules = {
            type: [
                { required: true, message: '请选择菜单类型', trigger: 'change' }
            ],
            title: [
                { required: true, message: '请输入菜单名称', trigger: 'blur' }
            ],
            code: [
                { required: true, message: '请输入权限字段', trigger: 'blur' }

            ],
            name: [
                { required: true, message: '请输入路由名称', trigger: 'blur' }

            ],
            path: [
                { required: true, message: '请输入路由地址', trigger: 'blur' }
            ],
            url: [
                { required: true, message: '请输入组件路径', trigger: 'blur' }
            ],
            orderNum: [
                { required: true, message: '请输入菜单序号', trigger: 'blur' }
            ]
        }

        // 重置表单数据
        const resetForm = () => {
            addModel.value = {
                menuId: '',
                parentId: '',
                title: '',
                code: '',
                name: '',
                path: '',
                url: '',
                type: '0',
                icon: '',
                parentName: '',
                orderNum: ''
            }
        }

        // 获取操作配置
        const getOperationConfig = (operation: OperationType) => {
            const configs = {
                add: {
                    title: '新增菜单',
                    confirmText: '创建',
                    successMessage: '新增成功',
                    errorMessage: '新增失败',
                    api: addApi
                },
                edit: {
                    title: '编辑菜单',
                    confirmText: '保存',
                    successMessage: '编辑成功',
                    errorMessage: '编辑失败',
                    api: editApi
                }
            }
            return configs[operation]
        }

        // 通用的弹窗函数
        const showMenuDialog = async (operation: OperationType, row?: MenuType) => {
            await getParent()

            const config = getOperationConfig(operation)

            // 如果是编辑，填充表单数据
            if (operation === 'edit' && row) {
                addModel.value = { ...row }
            } else {
                resetForm()
            }

            ElMessageBox({
                title: config.title,
                showCancelButton: true,
                confirmButtonText: config.confirmText,
                cancelButtonText: '取消',
                showClose: true,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                customStyle: {
                    width: '600px',
                    minWidth: '600px',
                },
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        // 进行表单验证
                        addForm.value?.validate(async (valid) => {
                            if (valid) {
                                console.log('表单验证通过', addModel.value)
                                try {
                                    console.log("提交表单", addModel.value);
                                    await config.api(addModel.value)
                                    ElMessage.success(config.successMessage)
                                    done()
                                    getList() // 刷新列表
                                } catch (error) {
                                    console.error(config.errorMessage, error)
                                    ElMessage.error(config.errorMessage)
                                }
                            } else {
                                console.log('表单验证失败')
                            }
                        })
                    } else {
                        // 取消或关闭，直接关闭弹窗
                        done()
                    }
                },
                message: () => (
                    <>
                        <ElForm model={addModel.value} ref={addForm} rules={rules} inline={false} >
                            <ElFormItem prop="type" label="菜单类型">
                                <ElRadioGroup v-model={addModel.value.type}>
                                    <ElRadio value={'0'}>目录</ElRadio>
                                    <ElRadio value={'1'}>菜单</ElRadio>
                                    <ElRadio value={'2'}>按钮</ElRadio>
                                </ElRadioGroup>
                            </ElFormItem>
                            <ElRow gutter={20}>
                                <ElCol span={12}>
                                    <ElFormItem label="上级菜单" prop="parentId">
                                        <ElTreeSelect
                                            v-model={addModel.value.parentId}
                                            data={treeList.value}
                                            renderAfterExpand={false}
                                            showCheckbox
                                            placeholder="请选择父菜单"
                                            onCheckChange={treeClick}
                                        >
                                        </ElTreeSelect>
                                    </ElFormItem>
                                </ElCol>
                                <ElCol span={12}>
                                    <ElFormItem label="菜单名称" prop="title">
                                        <ElInput v-model={addModel.value.title} placeholder="请输入菜单名称"></ElInput>
                                    </ElFormItem>
                                </ElCol>
                            </ElRow>
                            {
                                addModel.value.type !== '2' && (
                                    <ElRow gutter={20}>
                                        <ElCol span={12}>
                                            <ElFormItem label="菜单图标" prop="icon">
                                                <ElInput v-model={addModel.value.icon} placeholder="请输入菜单图标"></ElInput>
                                            </ElFormItem>
                                        </ElCol>
                                        <ElCol span={12}>
                                            <ElFormItem label='路由名称' prop="name">
                                                <ElInput v-model={addModel.value.name} placeholder="请输入路由名称"></ElInput>
                                            </ElFormItem>
                                        </ElCol>
                                    </ElRow>
                                )
                            }
                            <ElRow gutter={20}>
                                <ElCol span={12}>
                                    <ElFormItem label="菜单序号" prop="orderNum">
                                        <ElInput v-model={addModel.value.orderNum} placeholder="请输入菜单序号"></ElInput>
                                    </ElFormItem>
                                </ElCol>
                                <ElCol span={12}>
                                    <ElFormItem label='权限字段' prop="code">
                                        <ElInput v-model={addModel.value.code} placeholder="请输入权限字段">
                                        </ElInput>
                                    </ElFormItem>
                                </ElCol>
                            </ElRow>
                            <ElRow gutter={20}>
                                {
                                    addModel.value.type !== '2' && (
                                        <ElCol span={12}>
                                            <ElFormItem label="路由地址" prop="path">
                                                <ElInput v-model={addModel.value.path} placeholder="请输入路由地址"></ElInput>
                                            </ElFormItem>
                                        </ElCol>
                                    )
                                }
                                {
                                    addModel.value.type === '1' && (
                                        <ElCol span={12}>
                                            <ElFormItem label='组件路径' prop="url">
                                                <ElInput v-model={addModel.value.url} placeholder="请输入组件路径">
                                                </ElInput>
                                            </ElFormItem>
                                        </ElCol>
                                    )
                                }
                            </ElRow>
                        </ElForm>
                    </>
                )
            })
        }

        // 新增菜单按钮
        const addBtn = () => {
            showMenuDialog('add')
        }

        const tableList = ref([])

        // 获取表格数据
        const getList = async () => {
            let res = await getListApi()
            if (res) {
                tableList.value = res
            }
        }

        // 编辑
        const editBtn = (row: MenuType) => {
            console.log("editBtn", row);
            showMenuDialog('edit', row)
        }

        // 删除
        const deleteBtn = async (menuId: string) => {
            try {
                await $confirm('确认删除该菜单吗？')
                await deleteApi(menuId);
                ElMessage.success('删除成功')
                getList() // 刷新列表
            } catch (error) {
                // 用户取消删除或删除失败都会进入这里
                if (error !== 'cancel') {
                    // 只有在真正的错误时才显示错误信息
                    console.error('删除失败', error)
                }
            }
        }

        onMounted(() => {
            getList()
        })

        return () => (
            <>
                <ElMain>
                    <ElButton type="primary" icon="plus" size="default" onClick={addBtn} >新增</ElButton>
                    {/* 表格 */}
                    <ElTable data={tableList.value} rowKey={"menuId"} stripe border default-expand-all>
                        <ElTableColumn label="菜单名称" prop="title"></ElTableColumn>
                        <ElTableColumn label="菜单图标" prop='icon'>
                            {{
                                default: (scope: any) => {
                                    if (scope.row.icon) {
                                        const IconComponent = resolveComponent(scope.row.icon) as any
                                        return (
                                            <ElIcon>
                                                <IconComponent />
                                            </ElIcon>
                                        )
                                    }
                                    return <span>无图标</span>
                                }
                            }}
                        </ElTableColumn>
                        <ElTableColumn label="类型" prop='type'>
                            {{
                                default: (scope: any) => {
                                    if (scope.row.type === '0') {
                                        return (
                                            <ElTag type='warning' size="default">目录</ElTag>
                                        )
                                    }
                                    if (scope.row.type === '1') {
                                        return (
                                            <ElTag type='success' size="default">菜单</ElTag>
                                        )
                                    }
                                    if (scope.row.type === '2') {
                                        return (
                                            <ElTag type='info' size="default">按钮</ElTag>
                                        )
                                    }
                                }
                            }}
                        </ElTableColumn>
                        <ElTableColumn label="上级菜单" prop="parentName"></ElTableColumn>
                        <ElTableColumn label="路由名称" prop="name"></ElTableColumn>
                        <ElTableColumn label="路由地址" prop="path"></ElTableColumn>
                        <ElTableColumn label="组件路径" prop="url"></ElTableColumn>
                        <ElTableColumn label="序号" prop="orderNum"></ElTableColumn>
                        <ElTableColumn label="是否显示" prop="visible">
                            {{
                                default: (scope: any) => {
                                    return scope.row.visible ? <ElTag type='success' size="default">显示</ElTag> : <ElTag type='info' size="default">隐藏</ElTag>
                                }
                            }}
                        </ElTableColumn>
                        <ElTableColumn label="是否添加到选项卡" prop="keepTab">
                            {{
                                default: (scope: any) => {
                                    return scope.row.keepTab ? <ElTag type='success' size="default">是</ElTag> : <ElTag type='info' size="default">否</ElTag>
                                }
                            }}
                        </ElTableColumn>
                        <ElTableColumn label="操作" width="250px" align='center'>
                            {{
                                default: (scope: any) => (
                                    <>
                                        <ElButton type="primary" icon="edit" onClick={() => editBtn(scope.row)}>编辑</ElButton>
                                        <ElButton type="danger" icon="delete" onClick={() => deleteBtn(scope.row.menuId)}>删除</ElButton>
                                    </>
                                )
                            }}
                        </ElTableColumn>
                    </ElTable>
                </ElMain>
            </>
        )
    }
})