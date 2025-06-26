<template>
  <!-- <el-sub-menu index="1">
    <template #title>
      <el-icon><location /></el-icon>
      <span>Navigator One</span>
    </template>
    <el-menu-item-group title="Group One">
      <el-menu-item index="1-1">item one</el-menu-item>
      <el-menu-item index="1-2">item two</el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="Group Two">
      <el-menu-item index="1-3">item three</el-menu-item>
    </el-menu-item-group>
    <el-sub-menu index="1-4">
      <template #title>item four</template>
      <el-menu-item index="1-4-1">item one</el-menu-item>
    </el-sub-menu>
  </el-sub-menu>
  <el-menu-item index="2">
    <el-icon><icon-menu /></el-icon>
    <span>Navigator Two</span>
  </el-menu-item>
  <el-menu-item index="3" disabled>
    <el-icon><document /></el-icon>
    <span>Navigator Three</span>
  </el-menu-item> -->
  <template v-for="(item, index) in props.menuData">
    <el-menu-item
      @click="handleClick(item, `${props.index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length == 0"
      :index="`${props.index}-${item.meta.id}`"
      :key="`${props.index}-${item.meta.id}`"
    >
      <el-icon size="20px"
        ><component :is="getIconComponent(item.meta.icon)"
      /></el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon><component :is="getIconComponent(item.meta.icon)" /></el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <tree-menu
        :index="`${props.index}-${item.meta.id}`"
        :menuData="item.children"
      />
    </el-sub-menu>
  </template>
</template>
<script setup>
import * as Icons from "@element-plus/icons-vue";
import { useStore } from "vuex";
import { defineProps } from "vue";
import { useRouter } from "vue-router";
const store = useStore();
const props = defineProps({
  index: {
    type: String,
  },
  menuData: {
    type: Array,
    default: () => [],
  },
});
const router = useRouter();
// 获取图标组件
const getIconComponent = (iconName) => {
  if (!iconName) return Icons.House; // 默认图标，可根据需要修改
  return Icons[iconName] || Icons.House; // 如果找不到对应图标，返回默认图标
};

// 点击菜单
const handleClick = (item, index) => {
  // 点击获取菜单数据,将数据通过响应式在宁外一个组件进行展示
  store.commit("addMenu", item.meta);
  store.commit("updateMenuActive", index);
  router.push({ path: item.meta.path });
};
// console.log(props.menuData);
// console.log(props.menuData[0].meta.icon);
</script>

<style scoped></style>
