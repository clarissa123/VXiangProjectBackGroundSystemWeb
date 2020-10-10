<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'drbManagement'}">
            <img class="appManage" src="@/assets/images/home.png" />
            达人榜管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <img class="appManage" src="@/assets/images/file.png" />推广数据修改
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn" @click="clickUpdate">保存</el-button>
        <router-link :to="{name:'drbManagement'}">
          <el-button class="btn right-btn">取消</el-button>
        </router-link>
      </div>
    </Top>
    <div class="bottom">
      <div class="tit">
        <span>推广数据</span>
      </div>
      <div class="item">
        <span class="label-name">数据一：</span>
        <span class="label-con">
          <el-input class="input-o" v-model="data1" autocomplete="off"></el-input>
        </span>
      </div>
      <div class="item">
        <span class="label-name">数据二：</span>
        <span class="label-con">
          <el-input class="input-o" v-model="data2" autocomplete="off"></el-input>
        </span>
      </div>
      <div class="item">
        <span class="label-name">数据三：</span>
        <span class="label-con">
          <el-input class="input-o" v-model="data3" autocomplete="off"></el-input>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    updateSetting,
    lookSetting
  } from "@/api/appManagement/drbManagement.js";
  import Top from "@/components/top.vue";

  export default {
    inject: ["reload"], //注入reload方法
    components: {
      Top
    },
    data() {
      return {
        data1: "",
        data2: "",
        data3: ""
      };
    },
    mounted() {
      this.getAttr()
      console.log(process.env);
    },
    methods: {
      //获取属性名
      async getAttr() {
        this.loading = true;
        await lookSetting().then(res => {
          if (res.code == 1) {
            this.loading = false;
            // if (res.data == null) {
            //   this.data1 = '无推广数据';
            //   this.data2 = '无推广数据';
            //   this.data3 = '无推广数据';
            // } else {
            this.data1 = res.data.data1;
            this.data2 = res.data.data2;
            this.data3 = res.data.data3;
            // }
          } else {
            this.$message({
              message: res.data,
              type: "error"
            });
            return;
          }
        });
      },

      async clickUpdate() {
        let params = {
          data1: this.data1,
          data2: this.data2,
          data3: this.data3
        };
        await updateSetting(params).then(res => {
          if (res.code == 1) {
            this.reload();
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            this.$router.push({
              name: "drbManagement"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/style/myUI.less";

  /deep/.el-breadcrumb__inner {
    img {
      display: inline-block;
      margin-right: 8px;
    }
  }

  .task-list .top {
    .wh(100%, 59px);
    margin-top: 0;
    margin-bottom: 0;
    border-bottom: 1px solid rgba(211, 220, 230, 1);
  }

  .task-list .top .top-right .left-btn {
    .wh(65px, 32px);
  }

  .bottom {
    box-sizing: border-box;

    .tit {
      .wh(100%, 54px);
      background: #fafafa;
      line-height: 54px;
      padding: 0;
      padding-left: 84px;
      box-sizing: border-box;
      margin-bottom: 26px;
    }

    .input-w {
      width: 370px;
    }

    .input-o {
      width: 180px;

      &:nth-child(2n) {
        margin-left: 10px;
      }
    }

    .item {
      padding-left: 84px;
      margin-bottom: 20px;

      .label-name {
        font-weight: 500;
        margin-right: 10px;
        display: inline-block;
        width: 70px;
      }

      .headImage {
        vertical-align: top;
      }

      .label-con {
        display: inline-block;
      }

      .hot-info {
        vertical-align: top;
      }
    }

    .good-num {
      display: inline-flex;

      .good {
        margin-right: 30px;
      }
    }

    .task-detail {
      vertical-align: top;
      width: 668px;
    }
  }
</style>