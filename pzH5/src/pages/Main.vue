<template>
  <router-view></router-view>
  <van-tabbar v-model="active">
    <van-tabbar-item
      v-for="(item, index) in router.options.routes[0].children"
      :key="item.path"
      :icon="item.meta.icon"
      :url="`#/${item.path}`"
      >{{ item.meta.name }}</van-tabbar-item
    >
  </van-tabbar>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const active = ref(0);
const router = useRouter();
onMounted(() => {
  console.log(router.options.routes[0].children);
  const data = router.options.routes[0];
  // 获得当前路由的索引
  active.value = data.children.findIndex(
    (item) => item.path == useRoute().path
  );
});
</script>
<style scoped></style>
