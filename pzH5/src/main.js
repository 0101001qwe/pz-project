import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import api from "./api/index";
const app = createApp(App);
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("h5_token");
  if (!token && to.path !== "/login") {
    return { path: "/login" };
  }
  if (token && to.path === "/login") {
    return { path: "/" };
  }
  next();
});

app.config.globalProperties.$api = api; // 将api挂载到全局属性上
app.use(router);
app.mount("#app");
