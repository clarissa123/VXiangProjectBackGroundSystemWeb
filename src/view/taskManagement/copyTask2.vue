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
            <img class="appManage" src="@/assets/images/file.png" />快速复制课程
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </Top>
    <div class="bottom">
      <el-form ref="form" :model="form" label-width="80px" class="bottom-form">
        <el-form-item label="课程名称：">
          <el-input v-model="form.name" class="input1"></el-input>
        </el-form-item>
        <el-form-item label="课程级别：">
          <el-radio-group v-model="form.type">
            <el-radio @change="changeSelect" :label="item.typeId" v-for="item in allType" :key="item.typeId">
              {{item.typeName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程标签：">
          <el-tag class="bottom-tag" :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false"
            @close="handleClose(tag)">{{tag}}</el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="label" ref="saveTagInput" size="small"
            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标 签</el-button>
        </el-form-item>
        <el-form-item label="课程分类：">
          <el-select class="select" v-model="form.catgoryId" clearable placeholder="请选择"
            @click.native="clickSecondSelect" @change="selectType">
            <el-option v-for="item in options" :disabled="form.type==''" :label="item.label" :key="item.value"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领取名额：">
          <span>{{receiveQuota}}</span>
        </el-form-item>
        <el-form-item label="商品编号：">
          <el-input v-model="form.id" class="inp input3"></el-input>
          <span>商品原价：</span>
          <span class="price">{{form.subjectMatterPrice}}</span>
          <span>商品返佣：</span>
          <span>{{form.rebatePrice}}</span>
        </el-form-item>
        <el-form-item label="商品链接：">
          <el-input v-model="form.promoteUri" class="input4"></el-input>
          <el-button class="hot-info-btn" @click="clickModal">配置热度信息</el-button>
        </el-form-item>
        <el-form-item label="商品图片：">
          <el-upload class="bannerBg" :action="uploadActionUrl" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="extraParams">
            <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
            <el-button v-else class="uploadBtn" type="primary">选择图片</el-button>
            <div v-if="!form.imgUrl" class="uploadWen">尺寸：500px * 275px</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程视频：" v-for="(v, index) in form.videoinfos" :key="v.key"
          :prop="'videoinfos.' + index + '.value'">
          <el-input class="input5" v-model="v.videoName"></el-input>
          <span class="download-num">下载次数：</span>
          <el-input class="input6" v-model="v.downloadTimeTotal"></el-input>
          <el-upload class="upload-demo" :action="videoActionUrl" :on-preview="handlePreviewVideo" :data="extraParams"
            :on-remove="handleRemoveVideo" :objectBind="index" :before-remove="beforeRemoveVideo" multiple :limit="1"
            :on-exceed="handleExceedVideo"
            :on-success="(file, fileList) => {handleAvatarSuccessVideo(index,file, fileList)}" :file-list="v.videoArr">
            <el-button size="small" type="primary" class="upload-file">
              <i class="el-icon-download"></i>上传文件
            </el-button>
          </el-upload>
          <el-button @click.prevent="removeDomain(v)" class="delete-btn" v-if="index!==0">删除</el-button>
          <el-button @click="addDomain" class="add-btn">增加视频</el-button>
        </el-form-item>
        <el-form-item label="课程详情：" class="editor">
          <editor-bar v-model="form.desc" :isClear="isClear" @change="change"></editor-bar>
        </el-form-item>
        <el-button class="btn ok-btn" @click="addTask">保存</el-button>
        <router-link class="btn no-btn" tag="el-button" :to="{name:'taskList'}">取消</router-link>
      </el-form>
    </div>
    <!-- 配置热度信息弹框 -->
    <Popup :showModal="Popup.showModal" :width="Popup.width" :height="Popup.height" :title="Popup.title"
      @close="clickModal" v-if="Popup.showModal">
      <div class="slot-content-w">
        <div class="slot-middle">
          <div class="item">
            <div class="itemLeft">销量</div>
            <input type="text" class="itemRight input" v-model="form.sellAmounts" />
          </div>
          <div class="item">
            <div class="itemLeft">返利收益</div>
            <input type="text" class="itemRight input" v-model="form.rebateRate" />
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel" @click="clickModal">取消</div>
          <div class="btn ok" @click="clickModal">确定</div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
  import {
    addTask,
    lookTask,
    getQueryPage,
    getType,
    getFirstType
  } from "@/api/taskManagement/taskList.js";
  import Top from "@/components/top.vue";
  import Upload from "@/components/upload.vue";
  import editorBar from "@/components/wangEditor.vue";
  import Popup from "@/components/popup.vue";

  export default {
    inject: ["reload"], //注入reload方法
    name: "editTask",
    computed: {
      receiveQuota: function () {
        let sum = 0;
        for (let i in this.form.videoinfos) {
          sum += Number(this.form.videoinfos[i].downloadTimeTotal);
        }
        return sum;
      }
    },
    components: {
      Top,
      Upload,
      editorBar,
      Popup
    },
    data() {
      return {
        //课程级别
        allType: [],
        //一级类目下拉框
        typeOptions: [],
        //图片上传
        extraParams: {
          fileType: 5 //普通图片
        },
        uploadActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile",
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
          type: '',
          //商品链接
          promoteUri: "",
          //选中的课程分类
          typeItem: {},
          //一级类目
          typeId: null,
          //二级分类
          catgoryId: null,
          //二级分类名称
          catgoryName: ""
        },
        //课程分类下拉框
        options: [],
        //动态编辑标签
        dynamicTags: [],
        inputVisible: false,
        label: "",
        //图片上传
        uploadActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFileForShopping",
        //视频上传
        videoActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile",
        extraParams: {
          fileType: 6 //视频
        },
        imageUrl: "",
        imgUrl: "",
        //富文本编辑器
        isClear: false,
        detail: "",
        //上传图片
        fileList: [],
        //上传视频
        fileListVideo: [],
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
      this.getAllType();
      // this.getTypeList();
      // this.getFirstType(); // 获取一级类目
      this.getSecondType(); // 获取二级类目
      this.getDataById();
      console.log(process.env);
    },
    methods: {
      //课程级别的单选框
      changeSelect(value) {
        this.form.type = value;
        this.form.catgoryId = '';
        this.options = []
        this.getSecondType()
      },
      //点击二级分类下拉框
      clickSecondSelect() {
        if (this.form.type != '') {
          this.getSecondType(); //获取二级分类
        } else {
          this.$message({
            message: "请先选择课程级别，再选择课程分类",
            type: "warning"
          });
        }
      },
      //获取二级分类下拉框
      async getSecondType() {
        let res = await getQueryPage({
          assignmentType: this.form.type
        });
        if (res.msg == "成功") {
          res.data.rows.forEach(v => {
            v.value = String(v.id);
            v.label = v.assignmentCatName;
          });
          this.options = res.data.rows;
        }
      },
      //选中二级分类
      selectType(event) {
        this.$forceUpdate();
        this.form.catgoryId = event;
        this.form.typeItem = this.options.find(v => {
          return v.id == String(event);
        });
        this.form.catgoryName = this.form.typeItem.assignmentCatName;
      },
      //查询所有课程类型
      async getAllType() {
        let res = await getType();
        this.allType = res.data;
        this.allType.forEach(v => {
          v.typeId = String(v.typeId);
        });
      },
      async getDataById() {
        await lookTask(this.$route.params.id).then(res => {
          if (res.code == 1) {
            this.form = res.data;
            this.form.type = String(res.data.type);
            this.form.typeId = String(res.data.type);
            this.form.catgoryId = String(res.data.catgoryId);
            this.form.attribute = res.data.attribute;
            res.data.videoinfos.forEach((v, i) => {
              var obj = {
                id: v.id,
                url: v.videoUrl,
                name: v.videoName
              };
              v.videoArr = [];
              v.videoArr.push(obj);
            });
            this.form.videoinfos = res.data.videoinfos;
            if (this.form.label != "") {
              this.dynamicTags = this.form.label.split(",");
            }
          }
        });
      },
      //新增
      async addTask() {
        this.form.videoinfos.forEach(v => {
          //如果有videoArr 就去掉videoArr
          if (v.videoArr) {
            delete v.videoArr;
          }
          v.id = "";
        });
        let params = {
          // 涨粉1 带货2 教程3
          attribute: this.form.attribute,
          desc: this.form.desc,
          label: this.dynamicTags.toString(),
          name: this.form.name,
          promoteUri: this.form.promoteUri,
          rebateRate: Number(this.form.rebateRate),
          sellAmounts: Number(this.form.sellAmounts),
          imgUrl: this.form.imgUrl,
          subjectMatterId: this.form.subjectMatterId,
          type: this.form.type,
          videoinfos: this.form.videoinfos,
          // catgoryId: Number(this.form.typeItem.id),
          // catgoryName: this.form.typeItem.assignmentCatName
          catgoryId: this.form.catgoryId,
          catgoryName: this.form.catgoryName,
          type: this.form.type
        };
        await addTask(params).then(res => {
          if (res.code == 1) {
            this.reload();
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$router.push({
              name: "taskList"
            });
          }
        });
      },
      // 打开/关闭 弹窗
      clickModal() {
        this.Popup.showModal = !this.Popup.showModal;
      },
      // 动态编辑标签
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
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
          downloadTime: 0,
          downloadTimeTotal: 0,
          id: "",
          videoName: "",
          videoUrl: ""
        });
      },
      removeDomain(item) {
        var index = this.form.videoinfos.indexOf(item);
        if (index !== 0) {
          this.form.videoinfos.splice(index, 1);
        }
      },
      //富文本编辑器内容
      change(val) {
        // console.log(val);
      },
      //上传图片 1
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      //上传图片 2
      handlePreview(file) {
        // console.log(file);
      },
      //上传图片 3
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        );
      },
      //上传图片 4
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      // 上传成功
      handleAvatarSuccess(res, file) {
        this.form.imgUrl = URL.createObjectURL(file.raw);
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
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isJPEG && isLt2M;
      },
      //上传视频 1
      handleRemoveVideo(file, fileList) {
        // console.log(file, fileList);
      },
      //上传视频 2
      handlePreviewVideo(file) {
        // console.log(file);
      },
      //上传视频 3
      handleExceedVideo(files, fileList) {
        this.$message.warning(
          `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        );
      },
      //上传视频 4
      beforeRemoveVideo(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      //上传视频 上传成功
      handleAvatarSuccessVideo(index, res, file, fileList) {
        if (res.code == 1) {
          this.$message({
            message: "上传视频成功",
            type: "success"
          });
          this.form.videoinfos[index].videoUrl = res.data;
        }
      },
      // //获取课程分类列表
      // async getTypeList() {
      //   let res = await getQueryPage();
      //   if (res.msg == "成功") {
      //     this.options = res.data.rows;
      //     this.options.forEach(v => {
      //       v.id = String(v.id);
      //       delete v.createTime;
      //       delete v.updateTime;
      //     });
      //   }
      // }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/style/myUI.less";

  /deep/.upload-demo .el-upload-list__item:first-child {
    margin-top: 0;
  }

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
    /deep/.uploader .el-upload {
      .wh(500px, 275px);
      vertical-align: top;
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
      vertical-align: top;
    }

    /deep/.select .el-input__inner {
      .wh(180px, 40px);
      margin-right: 12px;
    }

    /deep/.select .el-input__suffix {
      right: 15px;
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
          padding-left: 10px;
          padding-right: 10px;
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

  //上传视频
  /deep/.el-upload-list {
    display: inline-flex;
  }
</style>