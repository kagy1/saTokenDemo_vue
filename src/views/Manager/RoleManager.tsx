import { ElMain } from 'element-plus'
import { defineComponent, Fragment } from 'vue'

export default defineComponent({
    setup(props, { slots, expose, emit, attrs }) {
        return () => (
            <div>
                <ElMain>
                    
                </ElMain>
            </div>
        )
    }
})