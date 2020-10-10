<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'scriptManagementList'}">
            <img class="appManage" src="@/assets/images/home.png" />
            APP管理
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{name:'scriptManagementList'}">
            <img class="appManage" src="@/assets/images/file-list.png" />脚本管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <img class="appManage" src="@/assets/images/file.png" />查看
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </Top>
    <div class="bottom">
      <el-form ref="form" :model="form" label-width="80px" class="bottom-form">
        <el-form-item label="主标题：">
          <span>{{form.mainTitle}}</span>
        </el-form-item>
        <el-form-item label="分类：">
          <span>{{form.typeName}}</span>
        </el-form-item>
        <!-- <el-form-item label="脚本图片：">
          <img :src="form.previewImage" alt class="previewImage" />
        </el-form-item> -->
        <el-form-item label="副标题：">
          <span>{{form.subTitle}}</span>
        </el-form-item>
        <el-form-item label="脚本详情：" class="editor">
          <p>{{form.content}}</p>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    lookTutorial,
  } from "@/api/appManagement/scriptManagement/scriptManagementList.js";
  import {
    getTutorialTypeList
  } from "@/api/appManagement/scriptManagement/scriptManagementType.js";
  import Top from "@/components/top.vue";
  import Upload from "@/components/upload.vue";
  import editorBar from "@/components/wangEditor.vue";

  export default {
    components: {
      Top,
      Upload,
      editorBar
    },
    data() {
      return {
        //图片上传
        uploadActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile",
        extraParams: {
          fileType: 5 //普通图片
        },
        imageUrl: "",
        // 下拉选择器
        options: [],
        value: "",
        form: {
          content: "",
          mainTitle: "",
          previewImage: "",
          subTitle: "",
          typeId: ""
        },
        //互斥的单选框
        radio: 3,
        //动态编辑标签
        dynamicTags: ["标签一", "标签二", "标签三"],
        inputVisible: false,
        inputValue: "",
        //图片上传
        actionUrl: "https://jsonplaceholder.typicode.com/posts/",
        //富文本编辑器
        isClear: false,
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
      this.getDataById();
      console.log(process.env);
    },
    methods: {
      async getDataById() {
        await lookTutorial({
          id: this.$route.params.id
        }).then(res => {
          if (res.code == 1) {
            // res.data.previewImage = process.env.VUE_APP_BASE_API + "/vshare/file/" + res.data.previewImage;
            this.form = res.data;
          }else {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
        });
      },
    }
  };
</script>

<style lang="less" scoped>
  @import "../../../assets/style/myUI.less";

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

    .previewImage {
      .wh(290px, 160px);
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

    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }

    //图片上传
    .bannerBg {
      height: 255px;
      width: 363px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px dashed rgba(0, 0, 0, 0.15);
      background: #fafafc;

      /deep/.el-upload .avatar {
        height: 255px;
        width: 363px;
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

    .download-num {
      display: inline-block;
      margin-left: 20px;
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

    /deep/.bottom-form .select .el-input__inner {
      .wh(363px, 40px);
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