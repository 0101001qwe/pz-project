<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="store.commit('setCollapse')"
        ><Fold
      /></el-icon>
      <ul class="flex-box" :style="{ height: '100%' }">
        <li
          v-for="(item, index) in selectMenu"
          :key="item.path"
          class="tab flex-box"
          :class="{ selected: route.path == item.path }"
        >
          <el-icon size="12"><component :is="item.icon"></component></el-icon>
          <router-link class="item-name" :to="item.path">{{
            item.name
          }}</router-link>
          <el-icon class="close" size="12" @click="closeTab(item, index)"
            ><Close
          /></el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick">
        <span class="el-dropdown-link flex-box">
          <el-avatar :src="userInfo ? JSON.parse(userInfo).avatar : ''" />
          <p class="user-name">
            {{ userInfo ? JSON.parse(userInfo).name : '未登录' }}
          </p>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
const store = useStore();
// 获取当前路由
const route = useRoute();
// 获取路由器
const router = useRouter();
// 获取用户信息
const userInfo = localStorage.getItem("pz_userInfo");
console.log(userInfo, "userInfo");

const selectMenu = computed(() => store.state.menu.selectMenu);
// 关闭标签函数
const closeTab = (item, index) => {
  store.commit("closeMenu", item);
  // 删除非当前页
  if (route.path !== item.path) {
    return;
  }
  const selectMenuData = selectMenu.value;
  // 删除最后一个
  if (index === selectMenuData.length) {
    if (selectMenuData.length === 0) {
      router.push("/");
    } else {
      router.push({
        path: selectMenuData[index - 1].path,
      });
    }
  } else {
    router.push({
      path: selectMenuData[index].path,
    });
  }
};
const handleClick = (command) => {
  if (command === "cancel") {
    localStorage.removeItem("pz-token");
    localStorage.removeItem("pz_userInfo");
    localStorage.removeItem("pzadmin");
    router.push("/login");
  }
};
</script>

<style scoped>
.flex-box {
  display: flex;
  align-items: center;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-left: 25px;
  .header-left {
    height: 100%;
    .icon {
      width: 45px;
      height: 100%;
      cursor: pointer;
    }
    .icon:hover {
      cursor: pointer;
      background-color: #f5f5f5;
    }
    .tab {
      height: 100%;
      padding: 0 10px;
      .item-name {
        line-height: 30px;
        height: 30px;
        display: inline-block;
        margin-left: 5px;
      }
      .close {
        visibility: hidden;
      }
      &.selected {
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover {
      height: 100%;
      background-color: #f5f5f5;
      .close {
        visibility: inherit;
        cursor: pointer;
      }
    }
  }
  .header-right {
    .el-dropdown-link {
      padding-right: 10px;
    }
    .user-name {
      margin-left: 10px;
    }
  }
  a {
    color: #333;
    height: 100%;
    font-size: 15px;
  }
}
</style>
