import { defineComponent } from "vue";
import style from "./style.module.scss";
import { ElIcon } from "element-plus";
import { useMenuStore } from '@/stores/menuStore'
import { Fold, Expand } from "@element-plus/icons-vue";

export default defineComponent({
    setup() {
        const menuStore = useMenuStore()
        const IconComponent = menuStore.collpase ? Expand : Fold

        return () => (
            <header class={style.header}>
                <div onClick={menuStore.changeCollapse} style={{ cursor: 'pointer' }}>
                    <ElIcon size={30}>
                        {
                            menuStore.collpase ? <Expand /> : <Fold />
                        }
                    </ElIcon>
                </div>

            </header >
        );
    }
});