import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "vHome", // 首页
    component: () => import("../views/home/index.vue")
  },
  {
    path: "/layout",
    name: "vLayout", // 布局页
    component: () => import("../views/layout/index.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
