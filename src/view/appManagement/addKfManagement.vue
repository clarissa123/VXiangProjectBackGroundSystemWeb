<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'kfManagement'}">
            <img class="appManage" src="@/assets/images/home.png" />
            APP管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <img class="appManage" src="@/assets/images/file.png" />客服设置
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn" @click="addCustomer">保存</el-button>
        <router-link :to="{name:'drbManagement'}">
          <el-button class="btn right-btn">取消</el-button>
        </router-link>
      </div>
    </Top>
    <div class="bottom">
      <div class="tit tit1">
        <span>编辑</span>
      </div>
      <div class="item">
        <span class="label-name">二维码：</span>
        <span class="label-con">
          <el-upload class="bannerBg" :action="uploadActionUrl" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="extraParams">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-button v-else class="uploadBtn" type="primary">选择图片</el-button>
            <div v-if="!imageUrl" class="uploadWen">尺寸：184px * 184px</div>
          </el-upload>
        </span>
      </div>
      <div class="item">
        <span class="label-name">微信名：</span>
        <span class="label-con">
          <el-input class="input-w" v-model="officialName" autocomplete="off"></el-input>
        </span>
      </div>
      <div class="item">
        <span class="label-name">标题：</span>
        <span class="label-con">
          <el-input class="input-w" v-model="describe" autocomplete="off"></el-input>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    addCustomer
  } from "@/api/appManagement/kfManagement.js";
  import Top from "@/components/top.vue";
  import Upload from "@/components/upload.vue";

  export default {
    inject: ["reload"], //注入reload方法
    components: {
      Top,
      Upload
    },
    data() {
      return {
        //图片上传
        uploadActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile",
        extraParams: {
          fileType: 5 //普通图片
        },
        //二维码
        qrcode: "",
        imageUrl: "",
        //微信名
        officialName: "",
        //标题
        describe: ""
      };
    },
    mounted() {
      console.log(process.env);
    },
    methods: {
      async addCustomer() {
        let params = {
          qrcode: this.qrcode,
          officialName: this.officialName,
          describe: this.describe
        };
        await addCustomer(params).then(res => {
          if (res.code == 1) {
            this.reload();
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$router.push({
              name: "kfManagement"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
        });
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        if (res.code == 1) {
          this.$message({
            message: "上传图片成功",
            type: "success"
          });
          this.qrcode = res.data;
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
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
    padding-top: 30px;

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
      width: 400px;
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
        vertical-align: top;
      }

      .label-con {
        display: inline-block;
      }

      .hot-info {
        vertical-align: top;
      }

      .bannerBg {
        height: 184px;
        width: 184px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.02);

        /deep/.bannerBg .el-upload {
          border: none;
        }

        .avatar {
          width: 184px;
          height: 184px;
        }

        .uploadBtn {
          width: 106px;
          height: 32px;
          border-radius: 4px;
        }

        .uploadWen {
          height: 22px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
          line-height: 22px;
          margin-top: 10px;
        }
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