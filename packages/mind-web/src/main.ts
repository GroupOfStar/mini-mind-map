import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.tsx";
import router from "./router/index.ts";
import "./assets/fonts/iconfont/iconfont.css";
import "./style.css";

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
