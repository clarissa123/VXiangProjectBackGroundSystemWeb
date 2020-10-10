<template>
  <section class="login">
    <div class="container">
      <div class="logo">
        <h1>V享后台管理系统</h1>V享
        <div class="logo-title">后台管理系统</div>
      </div>
      <div class="logo-form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form">
          <el-form-item prop="account" class="form-item name">
            <el-input
              class="login-form-input"
              placeholder="账号"
              autocomplete="off"
              v-model="ruleForm.account"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" class="form-item password">
            <el-input
              class="login-form-input"
              v-model="ruleForm.password"
              type="password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="remember">
        <div
          @click.stop="clickRemember"
          class="remember-common"
          :class="isColor?'remember-color':'remember-pot'"
        ></div>
        <span class="remember-pas">记住密码</span>
      </div>
      <el-button
        :disabled="btnState===false"
        :class="{btnBg:btnState}"
        @click.native.prevent="submitForm('ruleForm')"
        @keyup.enter.native="submitForm('ruleForm')"
        class="login-btn"
      ></el-button>
    </div>
  </section>
</template>
<script>
import { joinLogin } from "@/api/login.js";
export default {
  created() {
    let _this = this;
    document.onkeydown = function(e) {
      var ev = document.all ? window.event : e;
      if (ev.keyCode === 13) {
        _this.submitForm("ruleForm");
      }
    };
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: "账号不能为空",
          type: "warning"
        });
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: "密码不能为空",
          type: "warning"
        });
      }
      callback();
    };
    return {
      //记住密码勾选
      isColor: false,
      //表单项
      ruleForm: {
        account: "", //账户名
        password: "" //密码
      },
      //表单自定义验证规则
      rules: {
        name: [
          {
            validator: validateName,
            trigger: "blur"
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    btnState() {
      return this.ruleForm.name != "" && this.ruleForm.password != "";
    }
  },
  methods: {
    //写cookies
    setCookie(name, value) {
      var Days = 7;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie =
        name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    //读取cookies
    getCookie(name) {
      var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
      else return null;
    },
    //删除cookies
    delCookie(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.getCookie(name);
      if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    clickRemember() {
      this.isColor = !this.isColor;
      if (this.isColor == true) {
        //勾选记住密码 保存到 cookie
        this.setCookie(this.ruleForm.account, this.ruleForm.password);
      } else {
        //清除cookie
        this.delCookie(this.ruleForm.account);
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          joinLogin(this.ruleForm).then(res => {
            if (res.code == 1) {
              // 在请求成功后把document.onkeydown置为undefined
              document.onkeydown = undefined;
              if (this.isColor == true) {
                //重新设置 cookie
                this.setCookie(this.ruleForm.account, this.ruleForm.password);
              }
              //把token放入localStroage里保存
              window.localStorage.setItem("access_token", res.data);
              // 把用户名存入本地存储
              window.localStorage.setItem("name", this.ruleForm.account);
              this.$message({
                type: "success",
                message: "登录成功！"
              });
              this.$router.push({
                name: "taskList"
              });
            } else {
              this.$message({
                type: "error",
                message: res.data
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../assets/style/mixin.less";

.login {
  .wh(100%, 100%);
  .bis;
  background-image: url("../assets/images/login-bg.png");

  .container {
    display: flex;
    .fj(column);
    .center;

    .logo {
      .wh(230px, 24px);
      .sc(20px, @logo-red);
      font-family: PingFangSC-Regular;
      font-weight: 500;
      .fj(row, flex-start);
      box-sizing: border-box;
      padding-left: 35px;
      margin-bottom: 30px;
      font-family: "PingFang Medium";
      font-weight: 600;

      h1 {
        overflow: hidden;
        text-indent: -9999px;
      }

      .logo-title {
        color: @logo-black;
        margin-left: 10px;
      }
    }

    .logo-form {
      .wh(100%, 130px);

      .form {
        .wh(100%, 100%);

        .form-item {
          .wh(230px, 58px);
          .borderRadius(30px);
          background: @white;
          border: 1px solid rgba(211, 220, 230, 1);
          margin-bottom: 10px;

          &:last-child {
            margin-bottom: 0;
          }

          .login-form-input .el-input__inner {
            .center();
            .wh(85%, 40px);
            border: 0;
            margin-top: 5px;
            .sc(14px, @font-color);
          }
        }
      }
    }

    .remember {
      .wh(100%, 20px);
      text-align: left;
      margin-top: 10px;
      margin-bottom: 20px;

      .rememberBg {
        .wh(20px, 20px);
        background-image: url("../assets/images/remember.png");
        display: inline-block;
        margin-right: 10px;
        margin-left: 10px;
        vertical-align: middle;
      }

      .remember-common {
        .cursor();
        .wh(18px, 18px);
        .borderRadius(50%);
        display: inline-block;
        margin-right: 10px;
        margin-left: 10px;
        vertical-align: middle;
        border: 1px solid rgba(211, 220, 230, 1);
      }

      .remember-pot {
        background: @white;
      }

      .remember-color {
        background-image: url("../assets/images/remember.png");
      }

      .remember-pas {
        vertical-align: middle;
        display: inline-block;
        font-family: PingFangSC-Regular;
        .sc(14px, rgba(0, 0, 0, 0.65));
      }
    }

    .login-btn {
      .cursor();
      .wh(60px, 60px);
      .bis();
      border: none;
      background: transparent;
      outline: none;
      background-image: url("../assets/images/login-btn.png");

      &:hover {
        background: transparent;
        outline: none;
        background-image: url("../assets/images/login-btn.png");
      }
    }

    .btnBg {
      transition: all 0.5s;
      background-image: url("../assets/images/login-btn-color.png");
    }
  }
}
</style>