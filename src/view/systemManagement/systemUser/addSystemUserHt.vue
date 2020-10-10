<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'systemUserHt'}">
            <img class="appManage" src="@/assets/images/home.png" />
            系统管理
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{name:'systemUserHt'}">
            <img class="appManage" src="@/assets/images/file-list.png" />用户管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <img class="appManage" src="@/assets/images/file.png" />后台用户-增加
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn" @click="saveUser">保存</el-button>
        <router-link :to="{name:'drbManagement'}">
          <el-button class="btn right-btn" @click="back">取消</el-button>
        </router-link>
      </div>
    </Top>
    <div class="bottom">
      <div class="tit tit1">
        <span>基本信息</span>
      </div>
      <div class="item">
        <span class="label-name">头像：</span>
        <span class="label-con">
          <Upload :imageUrl="headUrl2" @imageurl="imageurl" :action="actionUrl" :imgType="imgType" class="logo-img"></Upload>
        </span>
      </div>
      <div class="item">
        <span class="label-name">账号:</span>
        <span class="label-con">
          <el-input class="input-w" v-model="account" autocomplete="off" :disabled="disabled"></el-input>
        </span>
      </div>
      <div class="item">
        <span class="label-name">用户名：</span>
        <span class="label-con">
          <el-input class="input-w" v-model="nickname" autocomplete="off" ></el-input>
        </span>
      </div>
      <div class="tit tit2">
        <span>{{type=='edit'?'修改密码':'新建密码'}}</span>
      </div>
      <div class="item" v-if="type =='edit'">
        <span class="label-name">旧密码</span>
        <span class="label-con">
          <el-input class="input-o" v-model="oldPassword" autocomplete="off"></el-input>
        </span>
      </div>
      <div class="item" v-if="type =='edit'">
        <span class="label-name">新密码</span>
        <span class="label-con">
          <el-input class="input-o" v-model="password" autocomplete="off"></el-input>
        </span>
      </div>
      <div class="item" v-if="type =='edit'">
        <span class="label-name">确认密码</span>
        <span class="label-con">
          <el-input class="input-o" v-model="password2" autocomplete="off"></el-input>
        </span>
      </div>
      <div class="item" v-if="type =='add'">
        <span class="label-name">密码</span>
        <span class="label-con">
          <el-input class="input-o" v-model="password" autocomplete="off"></el-input>
        </span>
      </div>
    </div>
  </div>
</template>
      
      <script>
import { addUser,getUser,editUser } from "@/api/systemManagement/systemUser/systemUserHt.js";
import Top from "@/components/top.vue";
import Upload from "@/components/upload.vue";

export default {
  components: {
    Top,
    Upload
  },
  data() {
    return {
      disabled:false,
      id:'',
      headUrl:'',
      headUrl2:'',// 传递给子组件的值
      account:'',
      nickname:'',
      oldPassword:'',
      password:'',
      password2:'',
      pic1: "",
      wxName1: "",
      tit1: "",
      pic2: "",
      wxName2: "",
      tit2: "",
      imgType:{
          fileType: 5 //普通图片
        },
      //图片上传
      actionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile"
    };
  },
  created(){
    this.type = this.$route.params.type;
    this.id = this.$route.params.id
    if(this.type == 'edit'){
      this.disabled=true
      this.getDetail(this.id)
    }
  },
  mounted() {
    console.log(process.env);
  },
  methods: {
    // 获取详情
    getDetail(id){
      var obj ={
        id:id
      }
      getUser(obj).then((res) => {
        if(res.data.headUrl){
          this.headUrl2 =  process.env.VUE_APP_BASE_API + "/vshare/file/" + res.data.headUrl;
        }
        this.account = res.data.account;
        this.nickname = res.data.nickname;
        //this.password = res.data.password,
      })
    },
    // 获取返回的图片路劲
    imageurl(val){
      this.headUrl = val;
      // console.log(val)
    },
    // 保存用户信息
    saveUser(){
      // console.log(this.type)
      // 判断是编辑还是新增
      if(this.type == 'add'){
        var obj ={
          	account: this.account,
            headUrl: this.headUrl,
            nickname: this.nickname,
            password: this.password,
            
        }
        addUser(obj).then((res) => {
          if(res.code){
           this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.$router.go(-1)
          }else{
            this.$message({
            message: res.msg,
            type: 'error'
          });
          }
        })
      }else{
        var obj ={
          	id: this.id,
            headUrl: this.headUrl,
            nickname: this.nickname,
            newPassword: this.password,
            oldPassword:this.oldPassword
        }
        editUser(obj).then((res) => {
          if(res.code ==1){
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.$router.go(-1)
          }else{
          this.$message({
            message: res.msg,
            type: 'error'
          });
          }

        })
      }
    },
    back(){
      this.$router.go(-1)
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.multipleSelection = val;
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
    width: 370px;
    &:nth-child(2n) {
      margin-left: 10px;
    }
  }
  //图片上传
  /deep/.uploader .el-upload {
    vertical-align: top;
    .wh(182px, 182px);
    border-radius: 50%;
  }

  /deep/.avatar-uploader-icon:after {
    content: "";
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
    .label-con {
      display: inline-block;
      .logo-img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
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