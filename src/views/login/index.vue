<template>
  <div class="login-container">
    <div class="login-head"></div>
    <el-form ref="form" :model="user" class="login-form" :rules="rules">
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree"
          >我已阅读并同意用户协议和隐私条款</el-checkbox
        ></el-form-item
      >

      <el-form-item>
        <el-button
          type="primary"
          class="login-btn"
          @click="onLogin"
          :loading="loginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api/user";
import { setItem } from "@/utils/storage";
export default {
  name: "Login",
  data() {
    return {
      user: {
        //手机号
        mobile: "",
        //验证码
        code: "",
        //是否同意协议
        agree: false,
      },
      //验证
      rules: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "change" },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "请输入正确的手机号",
          },
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
          {
            pattern: /^\d{6}$/,
            message: "请输入正确的验证码",
          },
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                callback(new Error("请同意用户协议"));
              }
            },
            trigger: "change",
          },
        ],
      },
      loginLoading: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    onLogin() {
      // 获取表单数据（根据接口要求绑定数据）
      const user = this.user;
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        // 验证通过，提交登录
        this.login();
      });
    },
    login() {
      //按钮添加loading状态
      this.loginLoading = true;
      login(this.user)
        .then((res) => {
          // 登录成功
          this.$message.success("登录成功");
          //改变loading
          this.loginLoading = false;
          const user = {
            refresh_token: res.data.data.refresh_token,
            token: res.data.data.token,
          };
          setItem("user", user);
          this.$store.commit("setUser", user);
          this.$router.push("/");
        })
        .catch((err) => {
          console.log("登录失败", err);
          // 登录失败
          this.$message.error(`登录失败${err}`);
          //改变loading
          this.loginLoading = false;
        });
    },
  },
};
</script>

<style scoped lang='less'>
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
  .login-head {
    width: 300px;
    height: 57px;
    background: url("./logo_index.png") no-repeat;
    margin-bottom: 30px;
  }
  .login-form {
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
  }
  .login-btn {
    width: 100%;
    margin-top: 50px;
  }
}
</style>