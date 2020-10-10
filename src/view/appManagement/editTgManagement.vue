<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'courseManagementList'}">
            <img class="appManage" src="@/assets/images/home.png" />
            APP管理
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{name:'tgManagement'}">
            <img class="appManage" src="@/assets/images/file-list.png" />推广设置
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <img class="appManage" src="@/assets/images/file.png" />推广文字-编辑
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </Top>
    <div class="bottom">
      <el-form ref="form" :model="form" label-width="80px" class="bottom-form">
        <el-form-item label="推广图片">
          <el-upload class="bannerBg" :action="uploadActionUrl" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="extraParams">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-button v-else class="uploadBtn" type="primary">选择图片</el-button>
            <div v-if="!imageUrl" class="uploadWen">尺寸：368px * 368px</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="推广文字：" class="editor">
          <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="detail"></el-input>
        </el-form-item>
        <el-button class="btn ok-btn" @click="updateText">保存</el-button>
        <router-link class="btn no-btn" tag="el-button" :to="{name:'tgManagement'}">取消</router-link>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    updateText
  } from "@/api/appManagement/tgManagement.js";
  import Top from "@/components/top.vue";
  import Upload from "@/components/upload.vue";

  export default {
    components: {
      Top,
      Upload,
    },
    data() {
      return {
        form: {},
        //图片上传
        uploadActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile",
        width: "368px",
        height: "368px",
        extraParams: {
          fileType: 5 //普通图片
        },
        imageUrl: "",
        images: "",
        //文本域
        detail: "",
        //配置热度信息弹框
        Popup: {
          width: 380,
          height: 310,
          showModal: false,
          title: "热度信息"
        }
      };
    },
    mounted() {
      this.getData();
      console.log(process.env);
    },
    methods: {
      getData() {
        this.imageUrl = this.$route.params.row.images;
        this.detail = this.$route.params.row.content;
      },
      //编辑
      async updateText() {
        let params = {
          images: this.images,
          content: this.detail,
          id: this.$route.params.id
        };
        await updateText(params).then(res => {
          if (res.code == 1) {
            this.getData();
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            this.$router.push({
              name: "tgManagement",
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

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        if (res.code == 1) {
          this.$message({
            message: "上传图片成功",
            type: "success"
          });
          this.images = res.data;
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

  .bottom {
    box-sizing: border-box;
    padding-top: 30px;
    padding-left: 90px;

    /deep/ .el-textarea__inner {
      width: 80%;
    }

    /deep/.bottom-form .el-form-item__label {
      box-sizing: border-box;
      text-align: left;
      padding: 0px 10px 0 0;
    }

    /deep/.bottom-form .el-input__inner {
      .wh(1086px, 40px);
    }

    /deep/.bottom-form .input2 {
      width: auto;
      margin-right: 10px;
    }

    /deep/.bottom-form .input3 {
      width: auto;
      margin-right: 20px;
    }

    /deep/.bottom-form .input4 {
      width: auto;
      margin-right: 12px;
    }

    /deep/.bottom-form .inp .el-input__inner {
      .wh(180px, 40px);
      display: inline-block;
    }

    /deep/.bottom-form .price {
      display: inline-block;
      margin-right: 30px;
    }

    /deep/.bottom-form .input4 .el-input__inner {
      .wh(500px, 40px);
    }

    .el-tag {
      height: 22px;
      line-height: 22px;
      background-color: #d9d9d9;
      .borderRadius(4px);
      border: 1px solid rgba(217, 217, 217, 1);
      color: @font-color;
      vertical-align: middle;

      /deep/.el-tag__close {
        color: @font-color;

        &:hover {
          background-color: transparent;
        }
      }
    }

    .el-tag+.el-tag {
      margin-left: 10px;
    }

    /deep/.button-new-tag {
      .wh(58px, 22px);
      line-height: 22px;
      .borderRadius(4px);
      border: 1px dashed rgba(217, 217, 217, 1);
      margin-left: 10px;
      background-color: @white;
      padding-top: 0;
      padding-bottom: 0;
      vertical-align: middle;
    }

    //图片上传
    .bannerBg {
      height: 368px;
      width: 368px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px dashed rgba(0, 0, 0, 0.15);
      background: #fafafc;

      /deep/.el-upload .avatar {
        height: 368px;
        width: 368px;
      }

      /deep/.el-upload {
        border: none;
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

    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }

    /deep/.input5 .el-input__inner {
      .wh(368px, 368px);
      display: inline-block;
    }

    .download-num {
      display: inline-block;
      margin-left: 20px;
    }

    /deep/.input5,
    .input6 {
      width: auto;
    }

    /deep/.input6 .el-input__inner {
      .wh(100px, 32px);
      display: inline-block;
    }

    .delete-btn {
      background: @gray;
      .wh(52px, 32px);
      .borderRadius(4px);
      margin-left: 10px;
    }

    .add-btn {
      .wh(106px, 32px);
      background: @blue;
      .borderRadius(4px);
      color: @white;
      margin-left: 10px;
    }

    /deep/.el-form-item {
      margin: 0 0 20px 0;
    }

    .btn {
      margin-bottom: 115px;
      margin-top: 30px;
    }

    .upload-demo {
      width: auto;
      display: inline-block;
      margin-left: 10px;
    }

    .upload-file {
      .wh(106px, 32px);
      background: @white;
      .borderRadius(4px);
      border: 1px solid @gray;
      color: @font-color;
    }

    .el-upload-list {
      display: inline-block;
      margin-left: 10px;
    }
  }

  // 配置热度信息弹框
  .slot-content-w {
    width: 100%;
    height: 253px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    position: relative;

    .slot-middle {
      width: 100%;
      height: 200px;
      padding: 34px 20px;
      box-sizing: border-box;

      .item {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 15px;
        min-height: 22px;

        .itemLeft {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.65);
          width: 60px;
          display: flex;
          justify-content: flex-start;
          height: 40px;
          align-items: center;
          line-height: 40px;
          margin-left: 11px;
        }

        .itemRight {
          margin-left: 33px;
          min-height: 22px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
          line-height: 25px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .selectBody {
          width: 104px;
          height: 40px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(217, 217, 217, 1);
        }

        .jtBg {
          width: 240px;
          height: 357px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          padding: 11px;
          box-sizing: border-box;

          .img {
            width: 100%;
            height: 100%;
            background: red;
          }
        }

        .textArea {
          width: 770px;
          height: 114px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          padding: 12px;
          box-sizing: border-box;
        }

        .input {
          width: 220px;
          height: 40px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.15);
        }
      }
    }

    .slot-btns {
      width: 100%;
      height: 52px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 10px 20px 0 0;
      box-sizing: border-box;
      border-top: 1px solid rgba(0, 0, 0, 0.09);

      .btn {
        width: 65px;
        height: 32px;
        border-radius: 4px;
        line-height: 32px;
        .cursor();
      }

      .cancel {
        color: #000000;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(217, 217, 217, 1);
        margin-right: 8px;
      }

      .ok {
        background: #1890ff;
        box-sizing: 1px solid #1890ff;
        color: #ffffff;
      }
    }
  }
</style>