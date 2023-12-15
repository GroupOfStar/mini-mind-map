import { createApp } from "vue";
import App from "./App.tsx";
import router from "./router/index.ts";
import "./assets/fonts/iconfont/iconfont.css";
import "./style.css";

createApp(App).use(router).mount("#app");
