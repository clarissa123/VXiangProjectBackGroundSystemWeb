<template>
  <el-upload class="avatar-uploader uploader" :action="action" :show-file-list="false" :data="imgType"
    :on-success="handleAvatarSuccess":before-upload="beforeAvatarUpload">
    <img v-if="newImageUrl" :src="newImageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
  export default {
    data() {
      return {
        newImageUrl: this.imageUrl
      };
    },
    props: {
      action: {
        type: String
      },
      imgType: {
        type: Object
      },
      imageUrl: {
        type: String,
        default () {
          return ''
        }
      }
    },
    watch: {
      imageUrl(oldVal, newVal) {
        this.newImageUrl = this.imageUrl
      }
    },
    mounted() {
      // console.log(this.newImageUrl)
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.newImageUrl = URL.createObjectURL(file.raw);
        // console.log(res.data)
        this.$emit("imageurl", res.data)
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

<style lang="less">
  @import "../assets/style/mixin.less";

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    .wh(500px, 275px);
    display: block;
  }

  .avatar-uploader-icon {
    .wh(106px, 32px);
    line-height: 32px;
    background: @blue;
    .borderRadius(4px);
    .center();

    &:before {
      color: @white;
      height: 0;
      content: "选择图片";
      font-size: 14px;
      font-weight: 400;
      position: absolute;
      left: 25%;
      top: 0;
    }

    &:after {
      color: @font-color;
      content: "尺寸：500px * 275px";
      font-size: 14px;
      font-weight: 400;
      position: absolute;
      left: -20%;
      top: 100%;
      .wh(150px, 100%);
    }
  }
</style>