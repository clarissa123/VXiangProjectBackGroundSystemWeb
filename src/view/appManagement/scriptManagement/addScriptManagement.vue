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
            <img class="appManage" src="@/assets/images/file.png" />新增脚本
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </Top>
    <div class="bottom">
      <el-form ref="form" :model="form" label-width="80px" class="bottom-form">
        <el-form-item label="主标题">
          <el-input v-model="form.mainTitle" class="input1"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            class="select"
            v-model="form.typeId"
            clearable
            placeholder="请选择"
            @click.native="clickSelect"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="脚本图片：">
          <el-upload
            class="bannerBg"
            :action="uploadActionUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :data="extraParams"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-button v-else class="uploadBtn" type="primary">选择图片</el-button>
            <div v-if="!imageUrl" class="uploadWen">尺寸：363px * 255px</div>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="副标题">
          <el-input v-model="form.subTitle" class="input1"></el-input>
        </el-form-item>
        <el-form-item label="脚本详情：" class="editor">
          <editor-bar v-model="form.content" :isClear="isClear" @change="change"></editor-bar>
        </el-form-item>
        <el-button class="btn ok-btn" @click="addTutorial">保存</el-button>
        <router-link class="btn no-btn" tag="el-button" :to="{name:'courseManagementList'}">取消</router-link>
      </el-form>
    </div>
    <!-- 配置热度信息弹框 -->
    <Popup
      :showModal="Popup.showModal"
      :width="Popup.width"
      :height="Popup.height"
      :title="Popup.title"
      @close="clickModal"
      v-if="Popup.showModal"
    >
      <div class="slot-content-w">
        <div class="slot-middle">
          <div class="item">
            <div class="itemLeft">销量</div>
            <input type="text" class="itemRight input" />
          </div>
          <div class="item">
            <div class="itemLeft">返利收益</div>
            <input type="text" class="itemRight input" />
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel" @click="clickModal">取消</div>
          <div class="btn ok">确定</div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import { addTutorial } from "@/api/appManagement/scriptManagement/scriptManagementList.js";
import { getTutorialTypeList } from "@/api/appManagement/scriptManagement/scriptManagementType.js";
import Top from "@/components/top.vue";
import Upload from "@/components/upload.vue";
import editorBar from "@/components/wangEditor.vue";
import Popup from "@/components/popup.vue";

export default {
  inject: ["reload"], //注入reload方法
  components: {
    Top,
    Upload,
    editorBar,
    Popup
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
    console.log(process.env);
  },
  methods: {
    clickSelect() {
      this.getTutorialTypeList();
    },
    //获取下拉框菜单
    async getTutorialTypeList() {
      await getTutorialTypeList().then(res => {
        res.data.list.forEach(v => {
          v.value = v.id;
          v.label = v.typeName;
        });
        this.options = res.data.list;
      });
    },
    //新增
    async addTutorial() {
      let params = {
        content: this.form.content,
        mainTitle: this.form.mainTitle,
        subTitle: this.form.subTitle,
        previewImage: this.form.previewImage,
        typeId: this.form.typeId
      };
      await addTutorial(params).then(res => {
        if (res.code == 1) {
          this.reload();
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$router.push({
            name: "scriptManagementList"
          });
        }else {
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
          this.form.previewImage = res.data;
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
    },

    change(val) {
      // console.log(val);
    },

    // 打开/关闭 弹窗
    clickModal() {
      this.Popup.showModal = !this.Popup.showModal;
    }
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

  .el-tag + .el-tag {
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