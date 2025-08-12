// utils/assignTree.js
import { getAssignTreeApi } from '@/api/user';
import { useUserStore } from '@/stores/userStote'
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import { ref } from 'vue'

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
        console.error('获取权限树失败:', error)
        ElMessage.error('获取权限树失败')
    }
}

export const showAssignTree = async (roleId: string, roleName: string) => {
    assignTreeData.value.list = []
    assignTreeData.value.assignTreeChecked = []
    params.value.userId = store.getUserInfo().userId
    params.value.roleId = roleId

    // 获取树数据
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
                // 保存权限
                // const success = await saveAssign()
                // if (success) {
                //     done()
                // }
                // 如果保存失败，不关闭弹窗
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