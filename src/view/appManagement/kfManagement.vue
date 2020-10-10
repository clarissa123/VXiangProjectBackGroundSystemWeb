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
        <router-link class="btn left-btn" :to="{name:'addKfManagement'}" tag="el-button">添加</router-link>
        <el-button class="btn right-btn" @click="clickDelete">删除</el-button>
      </div>
    </Top>
    <div class="bottom">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        class="table"
        :data="tableData"
        style="width: 100%"
        :cell-style="cell"
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
        :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}"
      >
        <el-table-column type="selection" v-model="ids" align="center"></el-table-column>
        <el-table-column prop="id" label="编号" align="center"></el-table-column>
        <el-table-column prop="qrcode" label="二维码" align="center">
          <!-- 图片的显示 -->
          <template slot-scope="scope">
            <img :src="scope.row.qrcode" width="184" height="184" />
          </template>
        </el-table-column>
        <el-table-column prop="officialName" label="微信名" align="center"></el-table-column>
        <el-table-column prop="describe" label="标题" align="center"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" sortable align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <span class="cursor update-btn" @click="jumpToEdit(scope.row.id,scope.row)">编辑</span>
            <span class="dot">|</span>
            <span class="cursor update-btn" @click="rowDelete(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  getCustomerList,
  deleteCustomer
} from "@/api/appManagement/kfManagement.js";
import Top from "@/components/top.vue";
export default {
  inject: ["reload"], //注入reload方法
  components: {
    Top
  },
  data() {
    return {
      //表格
      tableData: [],
      loading: false,
      //上传图片
      extraParams: {
        fileType: 5 //普通图片
      },
      uploadActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile",
      imageUrl: "",
      valueOne: "",
      //删除的id数组
      ids: [],

      //编辑id
      updateId: 0,

      //弹框 添加
      Popup: {
        width: 785,
        height: 680,
        showModal: false,
        title: "添加"
      }
    };
  },
  mounted() {
    this.getList();
    console.log(process.env);
  },
  methods: {
    //打开/关闭 弹窗（图片推广-添加）
    clickModal1() {
      this.Popup.showModal = !this.Popup.showModal;
    },
    //新增
    async addPic() {
      let data = {
        imageUrl: this.valueOne
      };
      await addPic(data).then(res => {
        if (res.code == 1) {
          this.Popup.showModal = !this.Popup.showModal;
          this.getList();
          this.$message({
            message: "添加成功",
            type: "success"
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
    //跳转到编辑页
    jumpToEdit(id, row) {
      this.$router.push({
        name: 'editKfManagement',
        params: {
          id: id,
          row: row,
        }
      });
    },
    //批量删除 1
    handleSelectionChange(res) {
      this.ids = res;
    },
    //批量删除 2
    clickDelete() {
      this.$confirm('是否确认删除？', '提示', {}).then(() => {
        deleteCustomer({
          ids: this.ids
            .map(v => {
              return v.id;
            })
            .join(",")
        }).then(res => {
          if (res.code == 1) {
            this.getList();
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
        });
      }).catch(() => {
        console.log('cancle')
      });
    },
    //行内删除
    rowDelete(id) {
      this.$confirm('是否确认删除？', '提示', {}).then(() => {
        deleteCustomer({
        ids: id
      }).then(res => {
        if (res.code == 1) {
          this.getList();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
      });
      }).catch(() => {
        console.log('cancle')
      });
    },
    //上传成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.code == 1) {
        this.$message({
          message: "上传图片成功",
          type: "success"
        });
        this.valueOne = res.data;
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
    //列表
    async getList() {
      this.loading = true;
      var result = await getCustomerList().then(res => {
        if (res.code == 1) {
          this.loading = false;
          res.data.forEach(v => {
            v.qrcode =
              process.env.VUE_APP_BASE_API + "/vshare/file/" + v.qrcode;
          });
          this.tableData = res.data;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
      });
    },
    //编辑回显
    clickEditModal(row) {
      this.PopupThree.showModal = !this.PopupThree.showModal;
      this.updateId = row.id;
      this.imageUrl = row.imageUrl;
    },
    //编辑提交
    async clickEdit() {
      let data = {
        id: this.updateId,
        imageUrl: this.valueOne
      };
      await updatePic(data).then(res => {
        if (res.code == 1) {
          this.getList();
          this.$message({
            message: "删除成功",
            type: "success"
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

    cell({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      //第二列添加 颜色
      if (columnIndex === 2) {
        return "color:#1890FF";
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/style/myUI.less";
</style>