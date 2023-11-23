import { createApp } from "vue";
import App from "./App.tsx";
import router from "./router/index.ts";
import "./style.css";

createApp(App).use(router).mount("#app");
