<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'taskList'}">
            <img class="appManage" src="@/assets/images/home.png" />
            课程管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <img class="appManage" src="@/assets/images/file.png" />查看
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </Top>
    <div class="bottom">
      <el-form ref="form" :model="form" label-width="120px" class="bottom-form">
        <el-form-item label="课程名称：">
          <span>{{form.name}}</span>
        </el-form-item>
        <el-form-item label="课程级别：">
          <span>{{form.assignmentTypeName}}</span>
        </el-form-item>
        <el-form-item label="发布状态：">
          <span>{{form.isPublish==0?'未发布':'已发布'}}</span>
        </el-form-item>
        <el-form-item label="课程标签：">
          <el-tag class="bottom-tag" :key="tag" v-for="tag in dynamicTags" :disable-transitions="false">{{tag}}</el-tag>
        </el-form-item>
        <el-form-item label="课程分类：">
          <!-- <span>{{form.assignmentTypeName}}</span>
          <span v-if="form.catgoryName!=''">/</span> -->
          <span>{{form.catgoryName}}</span>
        </el-form-item>
        <el-form-item label="已领/领取名额：">
          <span>{{form.getAmount}}/{{form.quota}}</span>
        </el-form-item>
        <el-form-item v-if="addtype == 1" label="商品编号：">
          <span>{{form.subjectMatterId}}</span>
          <span class="old-price">商品原价：</span>
          <span class="price">{{form.subjectMatterPrice}}</span>
          <span>商品返佣：</span>
          <span>{{form.rebatePrice}}</span>
        </el-form-item>
        <el-form-item v-if="addtype == 1" label="商品链接：">
          <span>{{form.promoteUri}}</span>
        </el-form-item>
        <el-form-item label="热度信息：">
          <p>销量：{{form.sellAmounts}}</p>
          <p>返利收益：{{form.rebateRate}}</p>
        </el-form-item>
        <el-form-item :label="addtype == 1?'商品图片：':'课程图片：'">
          <img :src="form.imgUrl" width="290" height="160" />
        </el-form-item>
        <el-form-item v-if="form.videoinfos.length!=0" label="课程视频：" v-for="(v, index) in form.videoinfos" :key="v.key"
          :prop="'videoinfos.' + index + '.value'">
          <span>视频{{index+1}}：{{v.videoName}}</span>
          <span class="account">已下载/下载名额：{{v.downloadTime}}/{{v.downloadTimeTotal}}</span>
          <el-upload class="upload-demo" :action="uploadActionUrl" :on-preview="handlePreview" :on-remove="handleRemove"
            :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
          </el-upload>
        </el-form-item>
        <el-form-item v-else label="课程视频：">
          <span>暂无视频</span>
        </el-form-item>
        <el-form-item label="课程详情：" class="editor">
          <div v-html="form.desc"></div>
        </el-form-item>
      </el-form>
      <router-link :to="{name:'taskList'}" tag="el-button" class="btn ok-btn">确定</router-link>
    </div>
  </div>
</template>

<script>
  import {
    lookTask,
    getType
  } from "@/api/taskManagement/taskList.js";
  import Top from "@/components/top.vue";
  import editorBar from "@/components/wangEditor.vue";
  import Popup from "@/components/popup.vue";

  export default {
    inject: ["reload"], //注入reload方法
    components: {
      Top,
      editorBar,
      Popup
    },
    data() {
      return {
        form: {
          //销量
          sellAmounts: 0,
          //返利收益
          rebateRate: 0,
          //课程名称
          name: "",
          //课程详情
          desc: "",
          videoinfos: [{
            //视频名称
            videoName: "",
            //下载次数
            downloadTime: 0,
            //视频链接
            videoUrl: "",
            //携带参数
            downloadTimeTotal: 0,
            id: ""
          }],
          //互斥的单选框
          type: 1,
          //商品链接
          promoteUri: ""
        },
        //动态编辑标签
        dynamicTags: [],
        inputVisible: false,
        label: "",
        //图片上传
        extraParams: {
          fileType: 5 //普通图片
        },
        addtype:1,
        uploadActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile",
        imageUrl: "",
        imgUrl: "",
        //富文本编辑器
        isClear: false,
        detail: "",
        fileList: [],
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
        await lookTask(this.$route.params.id).then(res => {
          if (res.code == 1) {
            res.data.videoinfos.forEach((v, i) => {
              if (v.videoUrl == '') {
                res.data.videoinfos.splice(res.data.videoinfos[i], 1);
              }
            })
            //商品返佣
            this.form = res.data;
            if(res.data.attribute ==2){
              this.addtype =1
            }
            if(res.data.attribute ==1){
              this.addtype =2
            }
            if(res.data.attribute ==3){
              this.addtype =3
            }
           
            if (this.form.label != "") {
              this.dynamicTags = this.form.label.split(",");
            }
          }
        });
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let label = this.label;
        if (label) {
          this.dynamicTags.push(label);
        }
        this.inputVisible = false;
        this.label = "";
      },
      //动态增减表单项
      addDomain() {
        this.form.videoinfos.push({
          value: "",
          key: Date.now()
        });
      },
      removeDomain(item) {
        var index = this.form.videoinfos.indexOf(item);
        if (index !== 0) {
          this.form.videoinfos.splice(index, 1);
        }
      },
      change(val) {
        // console.log(val);
      },
      //上传视频 1
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      //上传视频 2
      handlePreview(file) {
        // console.log(file);
      },
      //上传视频 3
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        );
      },
      //上传视频 4
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },

      // 上传成功
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        if (res.code == 1) {
          this.$message({
            message: "上传图片成功",
            type: "success"
          });
          this.form.imgUrl = res.data;
        }
      },
      //上传前的回调函数
      beforeAvatarUpload(file) {
        const isJPEG = file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPEG) {
          this.$message.error("上传头像图片只能是 JPEG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isJPEG && isLt2M;
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

    .account,
    .old-price {
      display: inline-block;
      margin-left: 30px;
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

    .bannerBg {
      height: 275px;
      width: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px dashed rgba(0, 0, 0, 0.15);
      background: #fafafc;

      /deep/.el-upload .avatar {
        height: 275px;
        width: 500px;
      }

      /deep/.bannerBg .el-upload {
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

    /deep/.input5 .el-input__inner {
      .wh(500px, 40px);
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