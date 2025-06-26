<template>
  <div class="panel-heading">
    <div class="panel-lead">
      <div class="title">
        {{ props.route.meta.name }}
        <p class="description">{{ props.route.meta.describe }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";
const props = defineProps({
  route: {
    type: Object,
  },
});
</script>
<style scoped lang="less">
.panel-heading {
  padding: 15px;
  background: #e8edf0;
  border-color: #e8edf0;
  position: relative;
  .panel-lead {
    font-size: 14px;
    .title {
      font-weight: bold;
      font-style: normal;
      color: rgb(23, 66, 66)
    }
    .description {
      margin-top: 5px;
    }
  }
}
</style>
