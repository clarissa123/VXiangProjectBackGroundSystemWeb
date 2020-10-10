<template>
  <div class="xieyi">
    <div class="header">
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'kfManagement'}">
            <img class="appManage" src="@/assets/images/home.png" />
            APP管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <img class="appManage" src="@/assets/images/file.png" />协议&制度
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="content">
      <!-- 协议 -->
      <div class="xieyi-box">
        <div class="title-box">
          <p>用户协议</p>
          <el-button type="primary" v-if="xieyiFlag==false" size="small" @click="editxieyi">修改</el-button>
          <div v-if="xieyiFlag==true">
            <el-button size="small" @click="editxieyi">取消</el-button>
            <el-button type="primary" size="small" @click="saveXieyi">保存</el-button>
          </div>
        </div>
        <div class="des-box" v-if="xieyiFlag==false" v-html="xieyiContent"></div>
        <div class="des-box2" v-if="xieyiFlag==true">
          <EditorBar v-model="xieyiContent" :isClear="isClear" @on-change="change"></EditorBar>
        </div>
      </div>
      <!-- 制度 -->
      <div class="zhidu-box">
        <div class="title-box">
          <p>平台制度</p>
          <el-button type="primary" v-if="zhiduFlag==false" size="small" @click="editzhidu">修改</el-button>
          <div v-if="zhiduFlag==true">
            <el-button size="small" @click="editzhidu">取消</el-button>
            <el-button type="primary" size="small" @click="saveZhidu">保存</el-button>
          </div>
        </div>
        <div class="des-box" v-if="zhiduFlag==false" v-html="zhiduContent"></div>
        <div class="des-box2" v-if="zhiduFlag==true">
          <EditorBar v-model="zhiduContent" :isClear="isClear" @on-change="change"></EditorBar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { xieyiPromise, xieyiZhidui } from '../../api/taskManagement/taskExamine'
import Top from "@/components/top.vue";
import EditorBar from "@/components/wangEditor.vue";
export default {
  data() {
    return {
      xieyiFlag: false,
      zhiduFlag: false,
      //富文本编辑器
      isClear: false,
      xieyiContent: '',
      zhiduContent: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      xieyiZhidui().then(res => {
        this.xieyiContent = res.data[0].appContent
        this.zhiduContent = res.data[1].appContent
      })
    },
    editxieyi() {
      this.xieyiFlag = !this.xieyiFlag
    },
    editzhidu() {
      this.zhiduFlag = !this.zhiduFlag
    },
    saveXieyi() {
      xieyiPromise({ appContent: this.xieyiContent, appTitle: '用户协议', id: 1 }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.xieyiFlag = !this.xieyiFlag
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      })
    },
    saveZhidu() {
      xieyiPromise({ appContent: this.zhiduContent, appTitle: '平台制度', id: 2 }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.zhiduFlag = !this.zhiduFlag
          this.getList()
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      })
    },
    change(val) {
      // console.log(val);
    }
  },
  components: {
    Top,
    EditorBar
  },
}
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 22px;
}
.content {
  .xieyi-box {
    height: 430px;
    box-sizing: border-box;
    padding: 20px;
    margin-top: 20px;
    width: 100%;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    .title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 16px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .des-box {
      margin-top: 20px;
      width: 100%;
      height: 358px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 19;
      overflow: hidden;
    }
    .des-box2 {
      margin-top: 20px;
      width: 100%;
      min-height: 358px;
      overflow-y: auto;
    }
  }
  .zhidu-box {
    height: 430px;
    box-sizing: border-box;
    padding: 20px;
    margin-top: 20px;
    width: 100%;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    .title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 16px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .des-box {
      margin-top: 20px;
      width: 100%;
      height: 358px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 19;
      overflow: hidden;
    }
    .des-box2 {
      margin-top: 20px;
      width: 100%;
      min-height: 358px;
      overflow-y: auto;
    }
  }
}
</style>