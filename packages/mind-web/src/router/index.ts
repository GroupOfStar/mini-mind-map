import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "vHome", // 首页
    component: () => import("../views/home/index.vue")
  },
  {
    path: "/svgjs",
    name: "vSvgjs", // svgjs Demo
    component: () => import("../views/svgjs/index")
  },
  {
    path: "/layout",
    name: "vLayout", // 布局页
    component: () => import("../views/layout/index")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
