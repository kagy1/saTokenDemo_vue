import axios from 'axios'
import { ElButton } from 'element-plus'
import { defineComponent, Fragment } from 'vue'

export default defineComponent({
    setup(props, { slots, expose, emit, attrs }) {
        return () => (
            <div>
                <div>首页</div>
            </div>
        )
    }
})