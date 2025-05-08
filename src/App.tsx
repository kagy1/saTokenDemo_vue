import { defineComponent, h } from "vue";
import Layout from "./views/Layout.vue";

export default defineComponent({
    setup() {
        return () => (
            <>
                <Layout />
            </>
        );
    },
});