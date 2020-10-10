<template>
  <div class="topBody">
    <div class="left">
      <!-- <div class="menu-icon cursor" @click="clickIcon"></div> -->
      V享
      <div class="leftTitle">后台管理系统</div>
    </div>
    <div class="right">
      <div class="logo cursor" @click="clickClose"></div>
      <div class="userName">{{name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "header",
  created() {
    this.name = window.localStorage.getItem("name");
  },
  data() {
    return {
      name: "",
    };
  },
  methods: {
    clickIcon() {
      let menuIcon = document.querySelector(".menu-icon");
      this.bus.$emit("status", "block");
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
    clickClose() {
      this.$confirm("此操作将退出当前账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          //清除 localStorage
          window.localStorage.clear();
          //清除 cookie
          this.delCookie(this.name);
          this.$router.history.push("/login");
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
@import "../assets/style/mixin.less";

.topBody {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 42px;
  box-sizing: border-box;
  border-bottom: 1px solid #d3dce6;

  .menu-icon {
    width: 30px;
    height: 5px;
    border-top: 3px solid #dd575c;
    border-bottom: 3px solid #dd575c;
    background-color: #dd575c;
    padding: 5px 0;
    background-clip: content-box;
  }

  .left {
    height: 24px;
    font-size: 20px;
    font-family: PingFangSC-Regular;
    font-weight: bolder;

    color: @logo-red;
    line-height: 24px;
    display: flex;
    justify-content: flex-start;

    .leftTitle {
      color: @logo-black;
      margin-left: 10px;
    }
  }

  .right {
    width: 200px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .logo {
      width: 32px;
      height: 32px;
      background: rgba(212, 215, 217, 1);
      border-radius: 50%;
    }

    .userName {
      margin-left: 10px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
  }
}
</style>