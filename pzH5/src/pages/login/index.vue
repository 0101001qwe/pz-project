<template>
  <h1>登录界面</h1>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="form.userName"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="form.passWord"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div class="btn">
      <van-button native-type="" submit round block type="primary"
        >提交</van-button
      >
    </div>
  </van-form>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const { proxy } = getCurrentInstance();
const form = reactive({
  userName: "",
  passWord: "",
});
// 表单提交
const onSubmit = async () => {
  const res = await proxy.$api.login(form);
  console.log(res);
  const { data } = res;
  if (data.code === 10000) {
    localStorage.setItem("h5_token", data.data.token);
    localStorage.setItem("h5_userInfo", JSON.stringify(data.data.userInfo));
    // 登录成功后，跳转到首页
    router.push({ path: "/home" });
  } else {
  }
};
</script>
<style scoped lang="less">
h1 {
  text-align: center;
}
.btn {
  margin: 16px;
}
</style>
