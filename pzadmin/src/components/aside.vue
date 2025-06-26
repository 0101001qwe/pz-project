<template>
  <el-menu
    :style="{ width: isCollapse ? '64px' : '230px' }"
    background-color="#545c64"
    class="aside-container"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
    :default-active="menuActive"
  >
    <p class="logo-lg">{{ isCollapse ? "DIDI" : "DIDI陪诊" }}</p>
    <TreeMenu :index="1" :menuData="menuData"></TreeMenu>
  </el-menu>
</template>
<script setup>
import { useRouter } from "vue-router";
import TreeMenu from "./treeMenu.vue";
import { reactive, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const isCollapse = computed(() => store.state.menu.isCollapse);
const handleOpen = (key, keyPath) => {};
const handleClose = (key, keyPath) => {};
const menuActive = computed(() => store.state.menu.menuActive);
const router = useRouter();
const menuData = computed(() => store.state.menu.routerList);
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  .logo-lg {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>
