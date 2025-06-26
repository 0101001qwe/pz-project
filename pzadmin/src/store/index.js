import { createStore } from "vuex";
import menu from "./menu";
import createPresistedstate from "vuex-persistedstate";
export default createStore({
  plugins: [
    // 持久化存储数据  解决刷新之后的问题
    new createPresistedstate({
      key: "pzadmin", // 存储的key
    }),
  ],
  modules: {
    menu,
  },
});
