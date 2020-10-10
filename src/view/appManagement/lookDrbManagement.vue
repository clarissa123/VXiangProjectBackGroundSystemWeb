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
            <img class="appManage" src="@/assets/images/file.png" />查看达人
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top-right" slot="btn">
        <router-link :to="{name:'drbManagement'}">
          <el-button class="btn left-btn">返回</el-button>
        </router-link>
      </div>
    </Top>
    <div class="bottom">
      <div class="tit tit1">
        <span>基本信息</span>
      </div>
      <div class="item">
        <span class="label-name headImage">头像：</span>
        <span class="label-con">
          <img :src="headImage" alt class="image" />
        </span>
      </div>
      <div class="item">
        <span class="label-name">用户ID：</span>
        <span class="label-con">{{id}}</span>
      </div>
      <div class="item">
        <span class="label-name">用户昵称：</span>
        <span class="label-con">{{nickName}}</span>
      </div>
      <div class="tit tit2">
        <span>推广数据</span>
      </div>
      <div class="item">
        <span class="label-name">{{data1}}：</span>
        <span class="label-con">{{data1Value}}</span>
      </div>
      <div class="item">
        <span class="label-name">{{data2}}：</span>
        <span class="label-con">{{data2Value}}</span>
      </div>
      <div class="item">
        <span class="label-name">{{data3}}：</span>
        <span class="label-con">{{data3Value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { lookSetting } from "@/api/appManagement/drbManagement.js";
import Top from "@/components/top.vue";
import Upload from "@/components/upload.vue";

export default {
  components: {
    Top,
    Upload
  },
  data() {
    return {
      //图片上传
      uploadActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile",
      width: "368px",
      height: "368px",
      extraParams: {
        fileType: 5 //普通图片
      },
      imageUrl: "",
      data1: "",
      data2: "",
      data3: "",
      data1Value: "",
      data2Value: "",
      data3Value: "",
      headImage: "",
      id: "",
      nickName: ""
    };
  },
  mounted() {
    this.getAttr();
    this.look();
    console.log(process.env);
  },
  methods: {
    //获取属性名
    async getAttr() {
      this.loading = true;
      await lookSetting().then(res => {
        if (res.code == 1) {
          this.loading = false;
          this.data1 = res.data.data1;
          this.data2 = res.data.data2;
          this.data3 = res.data.data3;
        }else {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
      });
    },
    //查看回显
    async look() {
      let data = this.$route.params.row;
      this.data1Value = data.data1Value;
      this.data2Value = data.data2Value;
      this.data3Value = data.data3Value;
      this.nickName = data.nickName;
      this.id = data.id;
      this.headImage = data.headImage;
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
    width: 370px;
  }

  .input-o {
    width: 180px;

    &:nth-child(2n) {
      margin-left: 10px;
    }
  }

  //图片上传
  .bannerBg {
    height: 182px;
    width: 182px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed rgba(0, 0, 0, 0.15);
    background: #fafafc;

    /deep/.el-upload .avatar {
      height: 182px;
      width: 182px;
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
    .image {
      .wh(182px, 182px);
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