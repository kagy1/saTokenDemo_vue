import { defineComponent } from "vue";
import style from "./style.module.scss";
import { RouterView } from "vue-router";

export default defineComponent({
    setup() {
        return () => (
            <main class={style.main}>
                <RouterView />
            </main>
        );
    }
});