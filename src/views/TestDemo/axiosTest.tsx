import axios from 'axios'
import { ElButton } from 'element-plus'
import { defineComponent, Fragment } from 'vue'
import { t1Api } from '@/api/test/index'
import { request } from '@/http'

export default defineComponent({
    setup(props, { slots, expose, emit, attrs }) {

        return () => (
            <div>
                <div>hello world</div>
                <ElButton onClick={() => {
                    t1Api()
                }}>请求测试t1</ElButton>
                <ElButton onClick={() => {
                    request.post('test/t2')
                }}>请求测试t2</ElButton>
            </div>
        )
    }
})