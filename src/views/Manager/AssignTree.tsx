import { saveRoleMenuApi } from '@/api/role';
import { getAssignTreeApi } from '@/api/user';
import { useUserStore } from '@/stores/userStote'
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import { nextTick, ref } from 'vue'

const assignTreeData = ref({
    list: [],
    assignTreeChecked: []
})

const store = useUserStore();

const params = ref({
    userId: '',
    roleId: ''
})

// 树组件的引用
const treeRef = ref<InstanceType<typeof ElTree>>()

const getAssignTree = async (): Promise<void> => {
    try {
        const result = await getAssignTreeApi(params.value)
        if (result) {
            assignTreeData.value.list = result.menuList || []
            assignTreeData.value.assignTreeChecked = result.checkList || []
        }
    } catch (error) {
        ElMessage.error('获取权限树失败')
        throw error
    }
}

// 提交数据
const commitParam = ref({
    roleId: '',
    list: [] as string[]
})

export const showAssignTree = async (roleId: string, roleName: string) => {
    assignTreeData.value.list = []
    assignTreeData.value.assignTreeChecked = []
    params.value.userId = store.getUserId()
    params.value.roleId = roleId

    commitParam.value.roleId = roleId

    // 获取树数据，如果失败则不弹出弹框
    await getAssignTree()


    return ElMessageBox({
        title: `分配${roleName}权限`,
        showCancelButton: true,
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        showClose: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
                // 确保树组件已经渲染完成
                await nextTick()

                const checkIds = treeRef.value?.getCheckedKeys() || []
                const halfCheckIds = treeRef.value?.getHalfCheckedKeys() || []
                let ids = [...checkIds, ...halfCheckIds] // 使用展开运算符

                commitParam.value.list = ids as string[]

                try {
                    // 保存权限
                    const res = await saveRoleMenuApi(commitParam.value)

                    if (res) {
                        ElMessage.success('权限分配成功')
                        done()
                    }
                } catch (error) {
                    console.error('保存权限失败:', error)
                    ElMessage.error('保存权限失败')
                }
            } else {
                // 取消时直接关闭
                done()
            }
        },
        message: () => (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <ElTree
                    ref={treeRef}
                    data={assignTreeData.value.list}
                    nodeKey='menuId'
                    props={{
                        children: 'children',
                        label: 'title'
                    }}
                    show-checkbox
                    default-expand-all
                    default-checked-keys={assignTreeData.value.assignTreeChecked}
                    style={{ width: '100%' }}
                />
            </div>
        )
    })
}