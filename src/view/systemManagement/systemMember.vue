<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'systemUserHt'}">
            <img class="appManage" src="@/assets/images/home.png" />
            系统管理
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{name:'systemMember'}">
            <img class="appManage" src="@/assets/images/file.png" />会员管理
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn" @click="clickEdit">保存</el-button>
        <el-button class="btn right-btn" @click="clickClose">取消</el-button>
      </div>
    </Top>
    <div class="bottom">
      <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="tit">
          <span>登录奖励金额设置</span>
        </div>
        <el-form-item label="开启每日奖励" prop="used">
          <el-switch v-model="ruleForm.used" active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="随机红包：">
          <el-input class="start" v-model="ruleForm.min" autocomplete="off"></el-input>
          <span class="pot">--</span>
          <el-input class="end" v-model="ruleForm.max" autocomplete="off"></el-input>
          <span>&emsp;&emsp;元</span>
        </el-form-item>
        <div class="tit">
          <span>会员升级设置</span>
        </div>
        <el-form-item label="青铜会员：">购买课程升级</el-form-item>
        <el-form-item label="白银会员：" prop="byNum">
          <span>团队中有</span>
          <el-input class="vip" v-model="ruleForm.byNum" autocomplete="off"></el-input>
          <span>人购买课程</span>
        </el-form-item>
        <el-form-item label="黄金会员：" prop="hjNum">
          <span>团队中有</span>
          <el-input class="vip" v-model="ruleForm.hjNum" autocomplete="off"></el-input>
          <span>人购买课程</span>
        </el-form-item>
        <el-form-item label="钻石会员：" prop="zsNum">
          <span>团队中有</span>
          <el-input class="vip" v-model="ruleForm.zsNum" autocomplete="off"></el-input>
          <span>人购买课程</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    getMemList,
    updateMem
  } from "@/api/systemManagement/systemMember.js";
  import Top from "@/components/top.vue";

  export default {
    components: {
      Top
    },
    data() {
      return {
        ruleForm: {
          used: "0",
          min: "",
          max: "",
          byNum: 0,
          hjNum: 0,
          zsNum: 0,
        }
      };
    },
    mounted() {
      this.getList();
      console.log(process.env);
    },
    methods: {
      async clickClose() {
        this.getList(this.queryParams);
      },
      async clickEdit() {
        await updateMem(this.ruleForm).then(res => {
          if (res.code == 1) {
            this.getList(this.queryParams);
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data,
              type: "error"
            });
            this.getList(this.queryParams);
          }
        })
      },
      async getList() {
        this.loading = true;
        await getMemList().then(res => {
          if (res.code == 1) {
            this.loading = false;
            this.ruleForm = res.data;
            this.ruleForm.used = String(this.ruleForm.used);
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/style/myUI.less";

  .task-list .top .top-right .left-btn {
    .wh(65px, 32px);
  }

  /deep/.el-breadcrumb__inner {
    img {
      display: inline-block;
      margin-right: 8px;
    }
  }

  .bottom {
    /deep/.el-form-item__label {
      text-align: left;
    }

    .tit {
      .wh(100%, 54px);
      line-height: 54px;
      background: #fafafc;
      border-radius: 4px 4px 0px 0px;
      padding-left: 40px;
      box-sizing: border-box;
      font-weight: 500;
    }

    .pot {
      display: inline-block;
      margin: 0 8px;
    }

    .start {
      .wh(66px, 32px);

      /deep/.el-input__inner {
        .wh(66px, 32px);
      }
    }

    .vip {
      .wh(100px, 40px);
      margin: 0 10px;

      /deep/.el-input__inner {
        .wh(100px, 40px);
      }
    }

    .end {
      .wh(88px, 32px);

      /deep/.el-input__inner {
        .wh(88px, 32px);
      }
    }

    /deep/.el-form-item {
      margin-bottom: 30px;
      margin-top: 30px;
      margin-left: 40px;
    }
  }
</style>