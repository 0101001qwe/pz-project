<template>
  <el-row class="login-container" justify="center" align="middle">
    <el-card>
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="登录头部图片" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{
          isHandle ? "返回登陆" : "注册账户"
        }}</el-link>
      </div>
      <el-form
        ref="loginFormRef"
        class="demo-ruleForm"
        style="max-width: 600px"
        :model="loginFrom"
        label-width="10px"
        :rules="rules"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginFrom.userName"
            :prefix-icon="UserFilled"
            placeholder="手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginFrom.passWord"
            type="password"
            :prefix-icon="Lock"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isHandle">
          <el-input
            v-model="loginFrom.validCode"
            :prefix-icon="Check"
            placeholder="验证码"
          >
            <template #append>
              <span @click="countdownChange()">{{ countdown.text }}</span>
            </template></el-input
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            @click="submitFrom(loginFormRef)"
          >
            {{ !isHandle ? "登录" : "注册账号" }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>
<script setup>
import { ref, reactive, computed, toRaw } from "vue";

import { useRouter } from "vue-router";
import { UserFilled, Lock, Check } from "@element-plus/icons-vue"; // 替换为实际存在的图标
import {
  getCode,
  userAuthentication,
  login,
  menuPermissions,
} from "@/api/index"; // 替换为实际存在的接口
import { useStore } from "vuex";
const imgUrl = new URL("@/assets/images/login-head.png", import.meta.url).href;
const router = useRouter();
// 数据记录登录或者注册
const isHandle = ref(false);
// 登录数据
const loginFrom = reactive({
  userName: "",
  passWord: "",
  validCode: "",
});
// 需先声明 validateUser 函数等校验函数，在 rules 中引用它,否则就会报错.
// 手机号验证
const validateUser = (rules, value, callback) => {
  if (!value) {
    return callback(new Error("请输入手机号"));
  }
  const phoneReg =
    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
  if (!phoneReg.test(value)) {
    return callback(new Error("请输入正确的手机号"));
  }
  callback(); // 验证通过
};
// 密码验证
const validatePassWord = (rules, value, callback) => {
  if (!value) {
    return callback(new Error("请输入密码"));
  }
  const reg = /^[a-zA-Z0-9_-]{4,16}$/;
  if (!reg.test(value)) {
    return callback(new Error("请输入正确的密码,密码长度为4-16位"));
  }
  callback();
};
// 登录表单校验规则
const rules = {
  userName: [{ validator: validateUser, trigger: "blur" }],
  passWord: [{ validator: validatePassWord, trigger: "blur" }],
};

// 验证码发送
const countdown = reactive({
  text: "获取验证码",
  time: 60,
});
// 验证码倒计时
let flag = false;
// 手机号正则
const phoneReg =
  /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
// 验证码倒计时
const countdownChange = () => {
  if (flag) {
    ElMessage.error("请不要频繁操作");
    return;
  }
  // 判断手机号是否正确
  if (!loginFrom.userName || !phoneReg.test(loginFrom.userName)) {
    ElMessage.error("请输入正确的手机号");
    return;
  }
  const timer = setInterval(() => {
    if (countdown.time <= 0) {
      countdown.text = "获取验证码";
      countdown.time = 60;
      flag = false;
      clearInterval(timer);
    } else {
      countdown.time--;
      countdown.text = `剩余${countdown.time}秒`;
    }
  }, 1000);
  flag = true;
  getCode({
    tel: loginFrom.userName,
  }).then((res) => {
    if (res.code === 10000) {
      ElMessage.success("验证码发送成功");
    }
  });
};
// 切换登录或者注册
const handleChange = () => {
  isHandle.value = !isHandle.value;
};
const loginFormRef = ref();
const store = useStore();
const routerList = computed(() => store.state.menu.routerList);
// 登录或者注册的校验
const submitFrom = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 注册页面
      if (isHandle.value) {
        userAuthentication(loginFrom).then((res) => {
          console.log("注册结果:", res);
          if (res.data.code === 10000) {
            ElMessage.success("注册成功");
            handleChange(); // 切换到登录页面
          } else {
            ElMessage.error("注册失败");
          }
        });
      }
    }
    // 登录页面
    if (!isHandle.value) {
      login(loginFrom).then((res) => {
        console.log("登录结果:", res);
        if (res.data.code === 10000) {
          ElMessage.success("登录成功");
          console.log(res.data);
          //将token和用户信息存储到本地
          localStorage.setItem("pz_token", res.data.data.token);
          localStorage.setItem(
            "pz_userInfo",
            JSON.stringify(res.data.data.userInfo)
          );
          menuPermissions().then(({ data }) => {
            // router.push("/");
            localStorage.setItem(
              "pz_menuPermissions",
              JSON.stringify(data.data)
            );
            store.commit("dynamicMenu", data.data);
            console.log("动态路由信息", routerList);
            toRaw(routerList.value).forEach((item) => {
              router.addRoute("main", item);
            });
          });
          // 跳转到首页
          router.push("/");
        } else {
          console.log(res.data);
          ElMessage.error(res.msg || "登录失败");
        }
      });
    }
  });
};
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
  .demo-ruleForm {
    // 让下面元素居中
    width: 400px;
    margin: 0 auto;
  }
}
</style>
