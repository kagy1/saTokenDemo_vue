import { defineComponent } from "vue";
import style from "./style.module.scss";

export default defineComponent({
    setup() {
        return () => (
            <header class={style.header}>
                <span class={style.title}>saToken Demo</span>
            </header>
        );
    }
});