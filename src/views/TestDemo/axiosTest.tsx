import axios from 'axios'
import { ElButton } from 'element-plus'
import { defineComponent, Fragment } from 'vue'

export default defineComponent({
    setup(props, { slots, expose, emit, attrs }) {
        return () => (
            <div>
                <div>hello world</div>
                <ElButton onClick={() => {
                    axios.post('http://localhost:7401/test')
                }}>请求测试</ElButton>
            </div>
        )
    }
})