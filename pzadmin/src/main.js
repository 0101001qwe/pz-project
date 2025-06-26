import { createApp } from "vue";
import "./style.css";
import router from "./router";
import App from "./App.vue";
import store from "./store";
import PanelHead from "./components/panelHeader.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 刷新后的动态路由添加
const localData = localStorage.getItem("pzadmin");
if (localData) {
  store.commit("dynamicMenu", JSON.parse(localData).menu.routerList);
  // 设置动态路由
  store.state.menu.routerList.forEach((item) => {
    // 在主页面下面注册路由
    router.addRoute("main", item);
  });
}
// 路由守卫
// router.beforeEach((to, from) => {
//   const token = localStorage.getItem("pz_token");
//   if (!token && to.path !== "/login") {
//     return { path: "/login" };
//   }
//   if (token && to.path === "/login") {
//     return { path: "/" };
//   }
//   return true;
// });

const app = createApp(App);
app.component("PanelHead", PanelHead);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router).use(store).mount("#app");
