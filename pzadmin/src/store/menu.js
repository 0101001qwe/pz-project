const localData = localStorage.getItem("pzadmin");
const state = localData
  ? localData.menu
  : {
      isCollapse: false,
      selectMenu: [],
      routerList: [], // 用于存储动态路由
      menuActive: "1-1",
    };
const mutations = {
  // 折叠菜单功能
  setCollapse(state) {
    state.isCollapse = !state.isCollapse;
    console.log(state.isCollapse);
  },
  // 选中菜单功能
  addMenu(state, menu) {
    if (state.selectMenu.findIndex((item) => item.path === menu.path) === -1) {
      state.selectMenu.push(menu);
    }
  },
  closeMenu(state, menu) {
    // 查找当前选中菜单的索引
    const index = state.selectMenu.findIndex((item) => item.name === menu.name);
    // 删除选中菜单
    state.selectMenu.splice(index, 1);
  },
  dynamicMenu(state, payload) {
    console.log(payload);
    // 通过glob导入文件
    const modules = import.meta.glob("../views/**/**/*.vue");
    console.log(modules);
    function routerSet(router) {
      router.forEach((route) => {
        // 判断有无子菜单
        if (!route.children) {
          const url = `../views${route.meta.path}/index.vue`;
          // 拿到获取的vue组件
          route.component = modules[url];
        } else {
          routerSet(route.children); // 递归处理子菜单
        }
      });
    }
    routerSet(payload);
    // 设置动态路由
    state.routerList = payload;
  },
  updateMenuActive(state, payload) {
    state.menuActive = payload;
  }
};

// es6对象简写方式
export default {
  state,
  mutations,
};
